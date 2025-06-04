import { Box, Heading, Text, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
}

export function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <Box mb={8}>
      {breadcrumbs && (
        <Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />} mb={4}>
          {breadcrumbs.map((crumb, index) => (
            <BreadcrumbItem key={index} isCurrentPage={!crumb.href}>
              <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      )}
      <Heading size="lg" mb={2}>{title}</Heading>
      {description && <Text color="gray.600">{description}</Text>}
    </Box>
  );
}
