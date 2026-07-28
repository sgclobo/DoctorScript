import Head from "expo-router/head";
import { ScrollViewStyleReset } from "expo-router/html";

export default function RootHtml({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Head>
          <meta name="application-name" content="DoctorScript" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="theme-color" content="#0f766e" />
          <link rel="manifest" href="/manifest.webmanifest" />
          <link rel="apple-touch-icon" href="/icon-192.png" />
        </Head>
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
