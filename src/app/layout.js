import "@fontsource-variable/jost";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata = {
  title: { default: "WedPlan | Wedding Planning Platform", template: "%s | WedPlan" },
  description: "Find wedding photographers, venues, florists, caterers and stylists, and send booking requests in minutes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
