// frontend/src/components/Layout/Card.tsx
import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';

interface CardProps extends BoxProps {
  variant?: 'elevated' | 'outline' | 'filled';
}

export function Card({ children, variant = 'elevated', ...props }: CardProps) {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const variants = {
    elevated: {
      bg,
      shadow: 'md',
      _hover: { shadow: 'lg' },
    },
    outline: {
      bg: 'transparent',
      border: '1px',
      borderColor,
    },
    filled: {
      bg: useColorModeValue('gray.50', 'gray.900'),
    },
  };

  return (
    <Box
      rounded="lg"
      p={6}
      transition="all 0.2s"
      {...variants[variant]}
      {...props}
    >
      {children}
    </Box>
  );
}