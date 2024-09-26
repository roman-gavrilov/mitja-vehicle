import "../app/global.css";

import { createClient, repositoryName } from "@/prismicio";
import { PrismicNextLink, PrismicPreview } from "@prismicio/next";
import { asText } from "@prismicio/client";
import { PrismicText } from "@prismicio/react";
/**
 * PrismicPreview enables previews.
 */

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden antialiased font-sans">
        <Header />
        {children}
        <PrismicPreview repositoryName={repositoryName} />
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
        {/* Left section: Site Title */}
        <PrismicNextLink href="/" className="flex items-center space-x-2">
          <span className="text-xl font-semibold tracking-tight text-black border p-1 border-gray-300 rounded-sm">
            <PrismicText field={settings.data.siteTitle} />
          </span>
        </PrismicNextLink>

        {/* Middle section: Navigation */}
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