'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Icon,
} from '@chakra-ui/react';
import { FiCheckCircle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

export default function ThankYouPage() {
  const router = useRouter();

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />

      <Container maxW="container.md" py={20} flex="1">
        <VStack spacing={8} textAlign="center">
          <Icon as={FiCheckCircle} boxSize={20} color="green.500" />

          <Heading size="2xl">Thank You!</Heading>

          <Text fontSize="xl" color="gray.600">
            We have received your submission and will get in touch with you soon.
          </Text>

          <Text>
            Our team typically responds within 24-48 hours. Meanwhile, feel free to
            explore our programs and success stories.
          </Text>

          <VStack spacing={4}>
            <Button
              colorScheme="brand"
              size="lg"
              onClick={() => router.push('/')}
            >
              Go Back to Home
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/success-stories')}
            >
              View Success Stories
            </Button>
          </VStack>
        </VStack>
      </Container>

      <Footer />
    </Box>
  );
}