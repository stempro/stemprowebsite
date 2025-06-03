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
    { value: 'Junior Researcher Program', label: 'Junior Researcher Program' },
    { value: 'Interview Clinic', label: 'Interview Clinic' }
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

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enrollments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Registration Successful!',
          description: 'Thank you for registering. We\'ll send you a confirmation email shortly.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        router.push('/');
      } else {
        throw new Error('Failed to register');
      }
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: 'Something went wrong. Please try again.',
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