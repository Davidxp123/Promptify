import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import backgroundImage from "../Promptify-backgroundImage.png";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata = {
  title: "Promptify — Better Prompts. Better Results.",
  description:
    "Select a persona, add your raw thoughts, and let Promptify craft the perfect AI prompt for you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body
        style={{
          "--promptify-background": `url(${backgroundImage.src})`,
        }}
      >
        {children}
      </body>
    </html>
  );
}