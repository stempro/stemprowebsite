'use client';

import { Box, Container, Heading, Text, VStack, FormControl, FormLabel, Input, Button, Card, CardBody, useToast, InputGroup, InputRightElement, IconButton, useColorModeValue, Progress, FormHelperText, PinInput, PinInputField, HStack } from '@chakra-ui/react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiEye, FiEyeOff, FiCheck, FiX, FiLock } from 'react-icons/fi';

const MotionCard = motion(Card);

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    repeatPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    // Get email from URL params
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    } else {
      router.push('/forgot-password');
    }
  }, [searchParams, router]);

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

  const handlePasswordChange = (value: string) => {
    setFormData(prev => ({ ...prev, newPassword: value }));
    checkPasswordStrength(value);
  };

  const handlePinChange = (value: string) => {
    setFormData(prev => ({ ...prev, code: value }));
  };

  const isFormValid = () => {
    return (
      formData.code.length === 6 &&
      formData.newPassword &&
      formData.newPassword === formData.repeatPassword &&
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/password-reset-confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          code: formData.code,
          new_password: formData.newPassword
        }),
      });

      if (response.ok) {
        toast({
          title: 'Password Reset Successful!',
          description: 'You can now log in with your new password.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        router.push('/login');
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to reset password');
      }
    } catch (error: any) {
      toast({
        title: 'Reset Failed',
        description: error.message || 'Invalid or expired reset code.',
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
                  <Heading size="xl" mb={2}>Reset Password</Heading>
                  <Text color="gray.600">
                    We have sent you a 6-digit code to your email.
                    Please enter the code to reset your password.
                  </Text>
                </Box>

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                  <VStack spacing={6}>
                    <FormControl isRequired>
                      <FormLabel>Email Address</FormLabel>
                      <Input
                        type="email"
                        value={formData.email}
                        isReadOnly
                        bg="gray.50"
                        size="lg"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Enter 6-digit Code</FormLabel>
                      <HStack justify="center">
                        <PinInput
                          size="lg"
                          onChange={handlePinChange}
                          value={formData.code}
                        >
                          <PinInputField />
                          <PinInputField />
                          <PinInputField />
                          <PinInputField />
                          <PinInputField />
                          <PinInputField />
                        </PinInput>
                      </HStack>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>New Password</FormLabel>
                      <InputGroup size="lg">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.newPassword}
                          onChange={(e) => handlePasswordChange(e.target.value)}
                          placeholder="Enter new password"
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
                        <Progress
                          value={passwordStrength}
                          size="xs"
                          colorScheme={passwordStrength < 40 ? 'red' : passwordStrength < 80 ? 'yellow' : 'green'}
                        />
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
                      <FormLabel>Repeat New Password</FormLabel>
                      <InputGroup size="lg">
                        <Input
                          type={showRepeatPassword ? 'text' : 'password'}
                          value={formData.repeatPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, repeatPassword: e.target.value }))}
                          placeholder="Repeat new password"
                          isInvalid={formData.repeatPassword && formData.newPassword !== formData.repeatPassword}
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
                      {formData.repeatPassword && formData.newPassword !== formData.repeatPassword && (
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
                      loadingText="Resetting Password..."
                      leftIcon={<FiLock />}
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg',
                      }}
                      transition="all 0.2s"
                    >
                      Reset Password
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