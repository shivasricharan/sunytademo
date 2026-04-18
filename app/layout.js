import "./globals.css";

export const metadata = {
  title: "Sunyta × Vouch Demo",
  description: "Structured learner intent demo for financial planning education",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}