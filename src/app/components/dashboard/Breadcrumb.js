'use client';

import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

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
    <StyledBreadcrumbs aria-label="breadcrumb">
      {breadcrumbs.map((breadcrumb, index) => (
        index === breadcrumbs.length - 1 ? (
          <Typography key={breadcrumb.href} color="text.primary">
            {breadcrumb.label}
          </Typography>
        ) : (
          <Link 
            key={breadcrumb.href} 
            component={NextLink} 
            href={breadcrumb.href} 
            underline="hover" 
            color="inherit"
          >
            {breadcrumb.label}
          </Link>
        )
      ))}
    </StyledBreadcrumbs>
  );
};

export default Breadcrumb;
