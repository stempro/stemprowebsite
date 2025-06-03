'use client';

import { Box, Container, Heading, Text, VStack, FormControl, FormLabel, Input, Select, Textarea, Button, Card, CardBody, useToast, SimpleGrid, useColorModeValue, Icon, HStack, FormHelperText } from '@chakra-ui/react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiCalendar, FiUser, FiMail, FiPhone, FiMessageSquare } from 'react-icons/fi';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function SchedulePage() {
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
    country: '',
    service_type: '',
    student_type: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceTypes = [
    { value: 'course_consultation', label: 'Course Consultation' },
    { value: 'college_planning', label: 'College Planning Consultation' },
    { value: 'research_program', label: 'Research Program Inquiry' },
    { value: 'general_inquiry', label: 'General Inquiry' }
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

    // Debug logging
    console.log('Schedule Form Data:', formData);
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

    try {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('API URL is not configured');
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/schedules/`;
      console.log('Full API URL:', apiUrl);

      // Prepare payload
      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        zip_code: formData.zip_code.trim(),
        country: formData.country,
        service_type: formData.service_type,
        student_type: formData.student_type,
        message: formData.message.trim()
      };

      console.log('Payload being sent:', JSON.stringify(payload, null, 2));

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (response.ok) {
        toast({
          title: 'Consultation Scheduled!',
          description: 'Thank you! We\'ll contact you within 24 hours to confirm your consultation.',
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
          country: '',
          service_type: '',
          student_type: '',
          message: ''
        });

        // Redirect after delay
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        // Parse error
        let errorMessage = 'Failed to schedule consultation';
        try {
          const errorData = JSON.parse(responseText);
          console.log('Error data:', errorData);

          if (errorData.detail) {
            if (typeof errorData.detail === 'string') {
              errorMessage = errorData.detail;
            } else if (Array.isArray(errorData.detail)) {
              errorMessage = errorData.detail.map((err: any) =>
                err.msg || err.message || JSON.stringify(err)
              ).join(', ');
            } else if (typeof errorData.detail === 'object') {
              errorMessage = JSON.stringify(errorData.detail);
            }
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          errorMessage = responseText || `Error ${response.status}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Schedule submission error:', error);

      toast({
        title: 'Submission Failed',
        description: error.message || 'Please check your information and try again.',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.first_name.trim() !== '' &&
      formData.last_name.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.zip_code.trim() !== '' &&
      formData.country !== '' &&
      formData.service_type !== '' &&
      formData.student_type !== ''
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
                <Icon as={FiCalendar} boxSize={10} color="blue.500" />
                <Heading as="h1" size="2xl">Schedule a Consultation</Heading>
              </HStack>
              <Text fontSize="xl" color="gray.600" maxW="2xl">
                Book a free consultation with our expert advisors to discuss your educational goals and find the perfect program for you.
              </Text>
            </VStack>
          </MotionBox>

          {/* Schedule Form */}
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
                  {/* Personal Information */}
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

                  {/* Contact Information */}
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
                        <FormHelperText>We'll send confirmation details to this email</FormHelperText>
                      </FormControl>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                        <FormControl isRequired>
                          <FormLabel>Phone Number</FormLabel>
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

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
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

                        <FormControl isRequired>
                          <FormLabel>I am a...</FormLabel>
                          <Select
                            name="student_type"
                            value={formData.student_type}
                            onChange={handleChange}
                            placeholder="Select an option"
                            size="lg"
                          >
                            <option value="HStudent">High School Student</option>
                            <option value="MStudent">Middle School Student</option>
                            <option value="CStudent">College Student</option>
                            <option value="Parent">Parent of a Student</option>
                            <option value="Career">Adult/Professional</option>
                            <option value="Other">Other</option>
                          </Select>
                        </FormControl>
                      </SimpleGrid>
                    </VStack>
                  </Box>

                  {/* Consultation Details */}
                  <Box w="full">
                    <HStack mb={4}>
                      <Icon as={FiMessageSquare} color="blue.500" />
                      <Heading size="md">Consultation Details</Heading>
                    </HStack>

                    <VStack spacing={6}>
                      <FormControl isRequired>
                        <FormLabel>Service Type</FormLabel>
                        <Select
                          name="service_type"
                          value={formData.service_type}
                          onChange={handleChange}
                          placeholder="Select a service"
                          size="lg"
                        >
                          {serviceTypes.map((service) => (
                            <option key={service.value} value={service.value}>
                              {service.label}
                            </option>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Message (Optional)</FormLabel>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us about your goals, interests, or any specific questions you have..."
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
                    loadingText="Scheduling..."
                    fontSize="lg"
                    py={7}
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                    }}
                    transition="all 0.2s"
                  >
                    Schedule Consultation
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