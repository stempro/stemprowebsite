'use client';

import { Box, Container, Heading, Text, Button, VStack, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function NotFound() {
  const router = useRouter();

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
    >
      <Container maxW="container.md">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VStack spacing={8} textAlign="center">
            <Icon as={FiAlertTriangle} boxSize={20} color="orange.500" />

            <VStack spacing={4}>
              <Heading size="3xl" bgGradient="linear(to-r, blue.400, purple.600)" bgClip="text">
                404
              </Heading>
              <Heading size="xl">Page Not Found</Heading>
              <Text fontSize="lg" color="gray.600" maxW="md">
                Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
              </Text>
            </VStack>

            <Button
              colorScheme="blue"
              size="lg"
              leftIcon={<FiHome />}
              onClick={() => router.push('/')}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              transition="all 0.2s"
            >
              Go Back Home
            </Button>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
}