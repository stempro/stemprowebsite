// frontend/src/components/UI/LoadingSpinner.tsx
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function LoadingSpinner({ message = 'Loading...', size = 'lg' }: LoadingSpinnerProps) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minH="200px"
      w="full"
    >
      <VStack spacing={4}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size={size}
        />
        {message && (
          <Text color="gray.600" fontSize="sm">
            {message}
          </Text>
        )}
      </VStack>
    </Box>
  );
}