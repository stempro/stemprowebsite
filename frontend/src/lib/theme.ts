import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f1ff',
      100: '#b3d5ff',
      200: '#80b9ff',
      300: '#4d9eff',
      400: '#1a82ff',
      500: '#0066e6',
      600: '#0052b3',
      700: '#003d80',
      800: '#00294d',
      900: '#00141a',
    },
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
});