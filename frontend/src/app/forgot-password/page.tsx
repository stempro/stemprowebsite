'use client';

import { Box, Container, Heading, Text, VStack, FormControl, FormLabel, Input, Button, Card, CardBody, useToast, Link, useColorModeValue, Icon, Alert, AlertIcon } from '@chakra-ui/react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import NextLink from 'next/link';

const MotionCard = motion(Card);

export default function ForgotPasswordPage() {
  const router = useRouter();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsCodeSent(true);
        toast({
          title: 'Reset Code Sent',
          description: 'If the email exists, a reset code has been sent.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        // Redirect to reset password page with email
        setTimeout(() => {
          router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 2000);
      } else {
        throw new Error('Failed to send reset code');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send reset code. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />

      <Box flex="1" py={16} display="flex" alignItems="center">
        <Container maxW="container.sm">
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            shadow="xl"
          >
            <CardBody p={10}>
              <VStack spacing={8}>
                <Box textAlign="center">
                  <Icon as={FiMail} boxSize={12} color="blue.500" mb={4} />
                  <Heading size="xl" mb={2}>Forgot Password?</Heading>
                  <Text color="gray.600">
                    No worries! Enter your email and we'll send you a reset code.
                  </Text>
                </Box>

                {isCodeSent ? (
                  <Alert status="success" borderRadius="md">
                    <AlertIcon />
                    Reset code sent! Check your email and follow the instructions.
                  </Alert>
                ) : (
                  <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <VStack spacing={6}>
                      <FormControl isRequired>
                        <FormLabel>Email Address</FormLabel>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          size="lg"
                        />
                      </FormControl>

                      <Button
                        type="submit"
                        colorScheme="blue"
                        size="lg"
                        width="full"
                        isLoading={isSubmitting}
                        loadingText="Sending Reset Code..."
                        _hover={{
                          transform: 'translateY(-2px)',
                          boxShadow: 'lg',
                        }}
                        transition="all 0.2s"
                      >
                        Send Reset Code
                      </Button>
                    </VStack>
                  </form>
                )}

                <VStack spacing={2}>
                  <Link
                    as={NextLink}
                    href="/login"
                    color="blue.500"
                    display="flex"
                    alignItems="center"
                  >
                    <Icon as={FiArrowLeft} mr={2} />
                    Back to Login
                  </Link>

                  <Text fontSize="sm" color="gray.600">
                    Don't have an account?{' '}
                    <Link as={NextLink} href="/enroll" color="blue.500">
                      Sign up
                    </Link>
                  </Text>
                </VStack>
              </VStack>
            </CardBody>
          </MotionCard>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}