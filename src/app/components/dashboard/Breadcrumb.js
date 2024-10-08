'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Breadcrumb = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);

  const breadcrumbs = pathSegments
    .filter(segment => !segment.startsWith('[') && !segment.match(/^[0-9a-fA-F]{24}$/)) // Filters out dynamic route slugs like [id]
    .map((segment, index, filteredSegments) => {
      const href = `/${filteredSegments.slice(0, index + 1).join('/')}`;
      return {
        href,
        label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
      };
    });

  return (
    <nav className="text-gray-500 ml-4 py-4">
      <ol className="list-none p-0 flex flex-wrap">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-gray-700">{breadcrumb.label}</span>
            ) : (
              <Link href={breadcrumb.href} className="underline hover:text-gray-700">
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
