import "../app/global.css";
import ClientErrorBoundary from './components/ClientErrorBoundary';
import { createClient, repositoryName } from "@/prismicio";
import { PrismicNextLink, PrismicPreview } from "@prismicio/next";
import { asText } from "@prismicio/client";
import { PrismicText } from "@prismicio/react";
import { Josefin_Sans } from 'next/font/google';
import { GoogleOAuthProvider } from '@react-oauth/google';

const josefinSans = Josefin_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-josefin-sans',
});

export const metadata = {
  title: 'Your App Name',
  description: 'Your app description',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={josefinSans.variable}>
      <body className="overflow-x-hidden antialiased font-sans">
        <ClientErrorBoundary>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
            {/* <Header /> */}
            {children}
            <PrismicPreview repositoryName={repositoryName} />
          </GoogleOAuthProvider>
        </ClientErrorBoundary>
      </body>
    </html>
  );
}

async function Header() {
  const client = createClient();
  const settings = await client.getSingle("settings");
  const navigation = await client.getSingle("navigation");

  return (
    <div className="mx-auto w-full border-b border-gray-300">
      <header className="flex items-center pl-[1.5rem] pr-[1.5rem] justify-between py-3">
        <PrismicNextLink href="/" className="flex items-center space-x-2">
          <span className="text-xl font-semibold tracking-tight text-black border p-1 border-gray-300 rounded-sm">
            <PrismicText field={settings.data.siteTitle} />
          </span>
        </PrismicNextLink>

        <nav>
          <ul className="flex items-center space-x-6">
            {navigation.data?.links.map((item) => (
              <li
                key={asText(item.label)}
                className="font-semibold tracking-tight text-gray-800 hover:text-black"
              >
                <PrismicNextLink field={item.link}>
                  <PrismicText field={item.label} />
                </PrismicNextLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </div>
  );
}