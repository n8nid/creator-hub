import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { DebugAuth } from "@/components/auth/debug-auth";
import { HeaderNav } from "@/components/header-nav";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Creator Hub",
  description: "A platform for creators",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* n8n-demo web component loader */}
        <script src="https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs@2.0.0/webcomponents-loader.js"></script>
        <script src="https://www.unpkg.com/lit@2.0.0-rc.2/polyfill-support.js"></script>
        <script
          type="module"
          src="https://cdn.jsdelivr.net/npm/@n8n_io/n8n-demo-component/n8n-demo.bundled.js"
        ></script>
      </head>
      <body className={inter.className}>
        {/* Dekorasi Ellipse Angular Gradient - Level Body */}
        <div className="ellipse-angular-hero"></div>
        <div className="ellipse-angular-about"></div>
        <div className="ellipse-angular-footer"></div>
        <AuthProvider>
          <HeaderNav />
          {children}
          <Toaster />
          <DebugAuth />
        </AuthProvider>
      </body>
    </html>
  );
}
