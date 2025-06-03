'use client';

import { Box, Container, Heading, Text, VStack, FormControl, FormLabel, Input, Select, Textarea, Button, Card, CardBody, useToast, SimpleGrid, InputGroup, InputRightElement, IconButton, useColorModeValue, Link, FormHelperText, Progress } from '@chakra-ui/react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import NextLink from 'next/link';

const MotionCard = motion(Card);

export default function EnrollPage() {
  const router = useRouter();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    country: '',
    postal_code: '',
    comments: '',
    password: '',
    repeatPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&\W]/.test(password)
    };

    setPasswordRequirements(requirements);

    const strength = Object.values(requirements).filter(Boolean).length;
    setPasswordStrength((strength / 5) * 100);
  };

  const checkEmailAvailability = async () => {
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
      setEmailTaken(data.email_taken);

      if (data.email_taken) {
        toast({
          title: 'Email already registered',
          description: 'Please use a different email or login instead.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error checking email:', error);
    }
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.email &&
      formData.role &&
      formData.country &&
      formData.postal_code &&
      formData.password &&
      formData.password === formData.repeatPassword &&
      !emailTaken &&
      Object.values(passwordRequirements).every(Boolean)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast({
        title: 'Please complete all fields correctly',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          country: formData.country,
          postal_code: formData.postal_code,
          comments: formData.comments
        }),
      });

      if (response.ok) {
        toast({
          title: 'Registration Successful!',
          description: 'Welcome to StemPro Academy! You can now log in.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        router.push('/login');
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
      }
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.message || 'Something went wrong. Please try again.',
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

      <Box flex="1" py={16}>
        <Container maxW="container.md">
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
                  <Heading size="xl" mb={2}>Register with Us</Heading>
                  <Text color="gray.600">
                    Registration is quick and secure! We respect your privacy and only require minimal information.
                  </Text>
                  <Text mt={2}>
                    Already have an account?{' '}
                    <Link as={NextLink} href="/login" color="blue.500" fontWeight="semibold">
                      Log In
                    </Link>
                  </Text>
                </Box>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                  <VStack spacing={6}>
                    <FormControl isRequired>
                      <FormLabel>Full Name</FormLabel>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        size="lg"
                      />
                    </FormControl>

                    <FormControl isRequired isInvalid={emailTaken}>
                      <FormLabel>Email</FormLabel>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={checkEmailAvailability}
                        placeholder="your.email@example.com"
                        size="lg"
                      />
                      {emailTaken && (
                        <FormHelperText color="red.500">
                          Email already registered.{' '}
                          <Link as={NextLink} href="/login" color="blue.500">
                            Go to login
                          </Link>
                        </FormHelperText>
                      )}
                    </FormControl>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                      <FormControl isRequired>
                        <FormLabel>You are</FormLabel>
                        <Select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          placeholder="Select an option"
                          size="lg"
                        >
                          <option value="student">Student</option>
                          <option value="parent">Parent of Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="visitor">Visitor</option>
                        </Select>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Country</FormLabel>
                        <Select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          placeholder="Select Country"
                          size="lg"
                        >
                          <option value="USA">USA</option>
                          <option value="Canada">Canada</option>
                          <option value="Other">Other</option>
                        </Select>
                      </FormControl>
                    </SimpleGrid>

                    <FormControl isRequired>
                      <FormLabel>Postal Code</FormLabel>
                      <Input
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleChange}
                        placeholder="Enter your postal code"
                        size="lg"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Additional Comments (Optional)</FormLabel>
                      <Textarea
                        name="comments"
                        value={formData.comments}
                        onChange={handleChange}
                        placeholder="Tell us more about yourself or your interests..."
                        rows={3}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Password</FormLabel>
                      <InputGroup size="lg">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create a strong password"
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
                      <Box mt={2}>
                        <Progress value={passwordStrength} size="xs" colorScheme={passwordStrength < 40 ? 'red' : passwordStrength < 80 ? 'yellow' : 'green'} />
                        <VStack align="start" mt={2} spacing={1}>
                          {Object.entries(passwordRequirements).map(([key, met]) => (
                            <Text key={key} fontSize="sm" color={met ? 'green.500' : 'gray.500'}>
                              {met ? <FiCheck style={{ display: 'inline' }} /> : <FiX style={{ display: 'inline' }} />}
                              {' '}
                              {key === 'length' && 'At least 8 characters'}
                              {key === 'uppercase' && 'One uppercase letter'}
                              {key === 'lowercase' && 'One lowercase letter'}
                              {key === 'number' && 'One number'}
                              {key === 'special' && 'One special character'}
                            </Text>
                          ))}
                        </VStack>
                      </Box>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Repeat Password</FormLabel>
                      <InputGroup size="lg">
                        <Input
                          type={showRepeatPassword ? 'text' : 'password'}
                          name="repeatPassword"
                          value={formData.repeatPassword}
                          onChange={handleChange}
                          placeholder="Repeat your password"
                          isInvalid={formData.repeatPassword && formData.password !== formData.repeatPassword}
                        />
                        <InputRightElement>
                          <IconButton
                            aria-label={showRepeatPassword ? 'Hide password' : 'Show password'}
                            icon={showRepeatPassword ? <FiEyeOff /> : <FiEye />}
                            variant="ghost"
                            onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                          />
                        </InputRightElement>
                      </InputGroup>
                      {formData.repeatPassword && formData.password !== formData.repeatPassword && (
                        <FormHelperText color="red.500">Passwords do not match</FormHelperText>
                      )}
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      size="lg"
                      width="full"
                      isLoading={isSubmitting}
                      isDisabled={!isFormValid()}
                      loadingText="Creating Account..."
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg',
                      }}
                      transition="all 0.2s"
                    >
                      Register
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => router.push('/')}
                      width="full"
                    >
                      Return to Home
                    </Button>
                  </VStack>
                </form>
              </VStack>
            </CardBody>
          </MotionCard>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}