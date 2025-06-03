'use client';

import { Box, Container, Heading, Text, VStack, FormControl, FormLabel, Input, Select, Textarea, Button, Card, CardBody, useToast, SimpleGrid, Icon, useColorModeValue } from '@chakra-ui/react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiClock, FiVideo, FiUsers } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

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
    student_type: '',
    country: '',
    comments: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schedules/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Consultation Scheduled!',
          description: 'We\'ll contact you within 24 hours to confirm your consultation time.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        router.push('/');
      } else {
        throw new Error('Failed to schedule consultation');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to schedule consultation. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: FiClock,
      title: 'Free 30-45 min Session',
      description: 'Get personalized guidance at no cost'
    },
    {
      icon: FiVideo,
      title: 'Online Consultation',
      description: 'Meet with our faculty from anywhere'
    },
    {
      icon: FiUsers,
      title: 'Expert Guidance',
      description: 'Find the perfect program for your needs'
    }
  ];

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
              <Heading as="h1" size="2xl">Schedule an Evaluation</Heading>
              <Text fontSize="xl" color="gray.600" maxW="2xl">
                Meet with our faculty and identify the proper course level for you or your child.
                An evaluation is free and takes 30-45 minutes.
              </Text>
            </VStack>
          </MotionBox>

          {/* Benefits Cards */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={12}>
            {benefits.map((benefit, index) => (
              <MotionCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                p={6}
              >
                <VStack spacing={3}>
                  <Icon as={benefit.icon} boxSize={10} color="blue.500" />
                  <Heading size="md">{benefit.title}</Heading>
                  <Text color="gray.600" textAlign="center">{benefit.description}</Text>
                </VStack>
              </MotionCard>
            ))}
          </SimpleGrid>

          {/* Form Section */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            maxW="2xl"
            mx="auto"
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            shadow="lg"
          >
            <CardBody p={8}>
              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                    <FormControl isRequired>
                      <FormLabel>First Name</FormLabel>
                      <Input
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="Your First Name"
                        size="lg"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Your Last Name"
                        size="lg"
                      />
                    </FormControl>
                  </SimpleGrid>

                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
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
                      <FormLabel>Zip Code / Postal Code</FormLabel>
                      <Input
                        name="zip_code"
                        value={formData.zip_code}
                        onChange={handleChange}
                        placeholder="12345"
                        size="lg"
                      />
                    </FormControl>
                  </SimpleGrid>

                  <FormControl isRequired>
                    <FormLabel>I am a...</FormLabel>
                    <Select
                      name="student_type"
                      value={formData.student_type}
                      onChange={handleChange}
                      placeholder="Select an option"
                      size="lg"
                    >
                      <option value="HStudent">High School Student (Grade 9 to 12)</option>
                      <option value="MStudent">Middle School Student (Grade 6 to 8)</option>
                      <option value="CStudent">College Student</option>
                      <option value="Parent">Parent of a Student</option>
                      <option value="Career">Adult/Professional (Not a Student)</option>
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

                  <FormControl>
                    <FormLabel>Additional Information</FormLabel>
                    <Textarea
                      name="comments"
                      value={formData.comments}
                      onChange={handleChange}
                      placeholder="Briefly describe yourself or the specific topics you'd like to discuss..."
                      rows={4}
                      size="lg"
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    width="full"
                    isLoading={isSubmitting}
                    loadingText="Scheduling..."
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                    }}
                    transition="all 0.2s"
                  >
                    Schedule Consultation
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