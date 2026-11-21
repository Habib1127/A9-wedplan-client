import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { APIError } from "better-auth/api";
import { MongoClient, ObjectId } from "mongodb";

const globalForMongo = globalThis;
const client = globalForMongo._wedplanMongo ?? new MongoClient(process.env.MONGODB_URI);
if (!globalForMongo._wedplanMongo) globalForMongo._wedplanMongo = client;
const db = client.db(process.env.DB_NAME || "wedplan");

const appUrl = (process.env.BETTER_AUTH_URL || "http://localhost:3000").replace(/\/$/, "");

export const auth = betterAuth({
  baseURL: appUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [appUrl],
  database: mongodbAdapter(db),
  user: {
    modelName: "users",
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      isBlocked: { type: "boolean", required: false, defaultValue: false, input: false },
      businessName: { type: "string", required: false, input: true },
      subscriptionPlan: { type: "string", required: false, defaultValue: "free", input: false },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  plugins: [
    jwt({
      jwt: {
        issuer: appUrl,
        audience: appUrl,
        expirationTime: "15m",
        definePayload: ({ user }) => ({ id: user.id, email: user.email }),
      },
    }),
    nextCookies(),
  ],
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: {
            ...user,
            role: ["vendor", "customer"].includes(user.role) ? user.role : "customer",
            isBlocked: false,
            subscriptionPlan: "free",
            subscriptionExpiresAt: null,
          },
        }),
      },
      update: {
        before: async (data) => {
          const { role, isBlocked, subscriptionPlan, subscriptionExpiresAt, ...safe } = data;
          return { data: safe };
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          let id;
          try {
            id = new ObjectId(String(session.userId));
          } catch {
            return;
          }
          const found = await db.collection("users").findOne({ _id: id });
          if (found?.isBlocked) throw new APIError("FORBIDDEN", { message: "Your account has been blocked" });
        },
      },
    },
  },
});
