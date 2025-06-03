'use client';

import { Box, Container, Heading, Text, VStack, FormControl, FormLabel, Input, Button, Card, CardBody, useToast, Link, InputGroup, InputRightElement, IconButton, useColorModeValue, Divider, HStack } from '@chakra-ui/react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';
import NextLink from 'next/link';

const MotionCard = motion(Card);

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const checkEmail = async () => {
    if (!formData.email) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      setEmailExists(data.email_taken);
      setEmailChecked(true);

      if (!data.email_taken) {
        toast({
          title: 'Email not registered',
          description: 'Please sign up first to create an account.',
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error checking email:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('username', formData.email); // OAuth2 expects username field
      formDataObj.append('password', formData.password);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        body: formDataObj,
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage or context
        localStorage.setItem('access_token', data.access_token);

        toast({
          title: 'Login Successful!',
          description: 'Welcome back!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        router.push('/dashboard');
      } else {
        throw new Error(data.detail || 'Login failed');
      }
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid email or password',
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
                  <Heading size="xl" mb={2}>Welcome Back</Heading>
                  <Text color="gray.600">
                    Don't have an account?{' '}
                    <Link as={NextLink} href="/enroll" color="blue.500" fontWeight="semibold">
                      Sign Up
                    </Link>
                  </Text>
                </Box>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                  <VStack spacing={6}>
                    <FormControl isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={checkEmail}
                        placeholder="your.email@example.com"
                        size="lg"
                      />
                      {emailChecked && !emailExists && (
                        <Text color="red.500" fontSize="sm" mt={2}>
                          Email not registered.{' '}
                          <Link as={NextLink} href="/enroll" color="blue.500">
                            Sign up here
                          </Link>
                        </Text>
                      )}
                    </FormControl>

                    {emailExists && (
                      <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <InputGroup size="lg">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                          />
                          <InputRightElement>
                            <IconButton
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                              icon={showPassword ? <FiEyeOff /> : <FiEye />}
                              variant="ghost"
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>
                    )}

                    {emailExists && (
                      <>
                        <Box w="full" textAlign="right">
                          <Link as={NextLink} href="/forgot-password" color="blue.500" fontSize="sm">
                            Forgot Password?
                          </Link>
                        </Box>

                        <Button
                          type="submit"
                          colorScheme="blue"
                          size="lg"
                          width="full"
                          isLoading={isSubmitting}
                          loadingText="Logging in..."
                          leftIcon={<FiLock />}
                          _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg',
                          }}
                          transition="all 0.2s"
                        >
                          Log In
                        </Button>
                      </>
                    )}
                  </VStack>
                </form>

                <VStack spacing={4} w="full">
                  <HStack>
                    <Divider />
                    <Text fontSize="sm" color="gray.500" px={3}>OR</Text>
                    <Divider />
                  </HStack>

                  <HStack spacing={4} justify="center">
                    <Link as={NextLink} href="/" color="gray.600">
                      Back to Home
                    </Link>
                    <Text color="gray.400">•</Text>
                    <Link as={NextLink} href="/schedule" color="gray.600">
                      Schedule Consultation
                    </Link>
                  </HStack>
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