import { UrqlProvider } from "./UrqlProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <UrqlProvider>
        <body>{children}</body>
      </UrqlProvider>
    </html>
  );
}
