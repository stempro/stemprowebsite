'use client';

import { Box, Container, Heading, Text, VStack, FormControl, FormLabel, Input, Select, Textarea, Button, Card, CardBody, useToast, SimpleGrid, useColorModeValue, Icon, HStack } from '@chakra-ui/react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiBook, FiUser, FiMail } from 'react-icons/fi';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    zip_code: '',
    course: '',
    student_type: '',
    country: '',
    comments: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const courses = [
    { value: 'Junior AI Program', label: 'Junior AI Program - Middle & High School' },
    { value: 'Generative AI Program', label: 'Generative AI Program - Middle School' },
    { value: 'Advanced Generative AI Program', label: 'Advanced AI Program - High School' },
    { value: 'CollegeNinja', label: 'CollegeNinja: Code-to-Campus' },
    { value: 'High School Research Program', label: 'High School Research Program' },
    { value: 'Interview Clinic', label: 'Interview Clinic' },
    { value: 'Music AI Research Program', label: 'Music AI Research Program with Harmonic AI' }
  ];

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Debug: Log the form data and API URL
    console.log('Form Data:', formData);
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

    try {
      // Check if API URL is defined
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('API URL is not configured. Please check your environment variables.');
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/enrollments/`;
      console.log('Full API URL:', apiUrl);

      // Create the payload with proper structure
      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        zip_code: formData.zip_code.trim(),
        course: formData.course,
        student_type: formData.student_type,
        country: formData.country,
        comments: formData.comments.trim()
      };

      console.log('Payload being sent:', payload);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Log response details for debugging
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Try to get response text regardless of status
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (response.ok) {
        toast({
          title: 'Registration Successful!',
          description: 'Thank you for registering. We\'ll send you a confirmation email shortly.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        // Reset form
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          zip_code: '',
          course: '',
          student_type: '',
          country: '',
          comments: ''
        });

        // Redirect after a short delay
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        // Try to parse error message from response
        let errorMessage = 'Registration failed. Please try again.';
        let errorDetails = '';

        try {
          const errorData = JSON.parse(responseText);
          console.log('Error data:', errorData);

          // Handle different error response formats
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.detail) {
            if (typeof errorData.detail === 'string') {
              errorMessage = errorData.detail;
            } else if (Array.isArray(errorData.detail)) {
              errorMessage = errorData.detail.map((err: any) => err.msg || err.message).join(', ');
            }
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }

          // If there are field-specific errors
          if (errorData.errors) {
            errorDetails = Object.entries(errorData.errors)
              .map(([field, errors]: [string, any]) => `${field}: ${errors}`)
              .join('\n');
          }
        } catch (e) {
          // If response is not JSON, use the response text
          if (responseText.includes("'str' object has no attribute 'exists'")) {
            errorMessage = 'Server configuration error. The backend is trying to validate data incorrectly.';
            errorDetails = 'Please contact support or check the backend enrollment validation code.';
          } else {
            errorMessage = `Error ${response.status}: ${response.statusText || responseText}`;
          }
        }

        throw new Error(errorDetails ? `${errorMessage}\n${errorDetails}` : errorMessage);
      }
    } catch (error: any) {
      console.error('Registration error:', error);

      toast({
        title: 'Registration Failed',
        description: error.message || 'Something went wrong. Please check your connection and try again.',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate form before submission
  const isFormValid = () => {
    return (
      formData.first_name.trim() !== '' &&
      formData.last_name.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.zip_code.trim() !== '' &&
      formData.course !== '' &&
      formData.student_type !== '' &&
      formData.country !== ''
    );
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />

      <Box flex="1" py={16}>
        <Container maxW="container.xl">
          {/* Hero Section */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            mb={12}
          >
            <VStack spacing={6} textAlign="center">
              <HStack spacing={3}>
                <Icon as={FiBook} boxSize={10} color="blue.500" />
                <Heading as="h1" size="2xl">Course Registration</Heading>
              </HStack>
              <Text fontSize="xl" color="gray.600" maxW="2xl">
                Ready to start your journey with StemPro Academy? Register for our programs and join a community of future innovators.
              </Text>
            </VStack>
          </MotionBox>

          {/* Registration Form */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            maxW="3xl"
            mx="auto"
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            shadow="xl"
          >
            <CardBody p={10}>
              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  {/* Personal Information Section */}
                  <Box w="full">
                    <HStack mb={4}>
                      <Icon as={FiUser} color="blue.500" />
                      <Heading size="md">Personal Information</Heading>
                    </HStack>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <FormControl isRequired>
                        <FormLabel>First Name</FormLabel>
                        <Input
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          placeholder="First Name"
                          size="lg"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Last Name</FormLabel>
                        <Input
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          placeholder="Last Name"
                          size="lg"
                        />
                      </FormControl>
                    </SimpleGrid>
                  </Box>

                  {/* Contact Information Section */}
                  <Box w="full">
                    <HStack mb={4}>
                      <Icon as={FiMail} color="blue.500" />
                      <Heading size="md">Contact Information</Heading>
                    </HStack>

                    <VStack spacing={6}>
                      <FormControl isRequired>
                        <FormLabel>Email Address</FormLabel>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          size="lg"
                        />
                      </FormControl>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                        <FormControl isRequired>
                          <FormLabel>Phone</FormLabel>
                          <Input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="(123) 456-7890"
                            size="lg"
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Zip Code</FormLabel>
                          <Input
                            name="zip_code"
                            value={formData.zip_code}
                            onChange={handleChange}
                            placeholder="12345"
                            size="lg"
                          />
                        </FormControl>
                      </SimpleGrid>
                    </VStack>
                  </Box>

                  {/* Course Selection Section */}
                  <Box w="full">
                    <HStack mb={4}>
                      <Icon as={FiBook} color="blue.500" />
                      <Heading size="md">Course Selection</Heading>
                    </HStack>

                    <VStack spacing={6}>
                      <FormControl isRequired>
                        <FormLabel>Select Course</FormLabel>
                        <Select
                          name="course"
                          value={formData.course}
                          onChange={handleChange}
                          placeholder="Choose a course"
                          size="lg"
                        >
                          {courses.map((course) => (
                            <option key={course.value} value={course.value}>
                              {course.label}
                            </option>
                          ))}
                        </Select>
                      </FormControl>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                        <FormControl isRequired>
                          <FormLabel>I am a...</FormLabel>
                          <Select
                            name="student_type"
                            value={formData.student_type}
                            onChange={handleChange}
                            placeholder="Select an option"
                            size="lg"
                          >
                            <option value="HStudent">High School Student (Grade 9-12)</option>
                            <option value="MStudent">Middle School Student (Grade 6-8)</option>
                            <option value="CStudent">College Student</option>
                            <option value="Parent">Parent of a Student</option>
                            <option value="Career">Adult/Professional</option>
                            <option value="Other">Other</option>
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
                            <option value="Other">Other Countries</option>
                          </Select>
                        </FormControl>
                      </SimpleGrid>

                      <FormControl>
                        <FormLabel>Additional Comments (Optional)</FormLabel>
                        <Textarea
                          name="comments"
                          value={formData.comments}
                          onChange={handleChange}
                          placeholder="Tell us anything else you'd like us to know..."
                          rows={4}
                          size="lg"
                        />
                      </FormControl>
                    </VStack>
                  </Box>

                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    width="full"
                    isLoading={isSubmitting}
                    isDisabled={!isFormValid()}
                    loadingText="Registering..."
                    fontSize="lg"
                    py={7}
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                    }}
                    transition="all 0.2s"
                  >
                    Complete Registration
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => router.push('/')}
                    width="full"
                  >
                    Cancel
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </MotionCard>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}