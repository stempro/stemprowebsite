// frontend/src/components/UI/EmptyState.tsx
import { Box, Text, VStack, Icon } from '@chakra-ui/react';
import { FiInbox } from 'react-icons/fi';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
}

export function EmptyState({ title, description, icon = FiInbox }: EmptyStateProps) {
  return (
    <Box textAlign="center" py={10}>
      <VStack spacing={3}>
        <Icon as={icon} boxSize={12} color="gray.400" />
        <Text fontSize="lg" fontWeight="medium" color="gray.700">
          {title}
        </Text>
        {description && (
          <Text color="gray.500" maxW="md">
            {description}
          </Text>
        )}
      </VStack>
    </Box>
  );
}


// frontend/src/components/Layout/PageHeader.tsx
