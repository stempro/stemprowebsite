'use client';

import { Box, Container, Heading, Text, VStack, SimpleGrid, Card, CardBody, Button, Stack, Icon, useColorModeValue, HStack, Badge, Stat, StatNumber, StatLabel, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, FormControl, FormLabel, Input, Select, useToast, Flex, Avatar, AvatarGroup, Divider } from '@chakra-ui/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiUsers, FiMessageSquare, FiCalendar, FiDatabase, FiTarget, FiExternalLink, FiCheck, FiStar, FiTrendingUp, FiAward, FiBookOpen, FiClock } from 'react-icons/fi';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function CollegeNinjaPage() {
  const router = useRouter();
  const toast = useToast();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const gradientBg = useColorModeValue(
    'linear(to-br, purple.50, pink.50)',
    'linear(to-br, gray.800, gray.900)'
  );

  const { isOpen: isStudentOpen, onOpen: onStudentOpen, onClose: onStudentClose } = useDisclosure();
  const { isOpen: isCounselorOpen, onOpen: onCounselorOpen, onClose: onCounselorClose } = useDisclosure();

  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    phone: '',
    zipCode: '',
    currentSchool: '',
    gradeLevel: ''
  });

  const [counselorForm, setCounselorForm] = useState({
    name: '',
    email: '',
    phone: '',
    zipCode: ''
  });

  const features = [
    {
      icon: FiUsers,
      title: 'Employ AI Agents',
      description: 'Connect with peers and mentors in dynamic chatrooms where AI enhances discussions and real-time support.',
      color: 'purple'
    },
    {
      icon: FiMessageSquare,
      title: 'Powerful Discussions',
      description: 'Get expert AI and counselor guidance for college and career planning, with flexible communication options.',
      color: 'pink'
    },
    {
      icon: FiCalendar,
      title: 'College Planning',
      description: 'Organize your academic journey using interactive planning tools. Create, edit, and visualize your college application timeline.',
      color: 'blue'
    },
    {
      icon: FiDatabase,
      title: 'Public Datasets',
      description: 'Explore extensive public datasets covering high schools, courses, summer programs, and more to make informed decisions.',
      color: 'green'
    },
    {
      icon: FiTarget,
      title: 'College Recommendations',
      description: 'Receive personalized college recommendations based on your unique profile. Our AI engine analyzes your strengths and interests.',
      color: 'orange'
    }
  ];

  const comingSoonFeatures = [
    'AI-Powered College Matching Algorithm',
    'Interactive Planning Timeline Builder',
    'Smart Application Tracker',
    'AI Essay Writing Assistant',
    'Virtual College Tours',
    'Scholarship Finder'
  ];

  const stats = [
    { number: '95%', label: 'College Acceptance Rate' },
    { number: '500+', label: 'Students Guided' },
    { number: '50+', label: 'Top Universities' },
    { number: '$2M+', label: 'Scholarships Earned' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Admitted to MIT',
      quote: 'CollegeNinja helped me organize my entire application process. The AI recommendations were spot-on!',
      avatar: 'SC'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Stanford University',
      quote: 'The timeline planner and essay assistance made the overwhelming process manageable and successful.',
      avatar: 'MR'
    },
    {
      name: 'Emily Park',
      role: 'Parent',
      quote: 'As a parent, CollegeNinja gave me the tools to support my daughter effectively through her college journey.',
      avatar: 'EP'
    }
  ];

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/collegeninja/student-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentForm),
      });

      if (response.ok) {
        toast({
          title: 'Sign-up Successful!',
          description: 'Welcome to CollegeNinja! We\'ll contact you when we launch.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onStudentClose();
        setStudentForm({
          name: '',
          email: '',
          phone: '',
          zipCode: '',
          currentSchool: '',
          gradeLevel: ''
        });
      } else {
        throw new Error('Sign-up failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign up. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCounselorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/collegeninja/counselor-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(counselorForm),
      });

      if (response.ok) {
        toast({
          title: 'Sign-up Successful!',
          description: 'Thank you for your interest! We\'ll contact you about partnership opportunities.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onCounselorClose();
        setCounselorForm({
          name: '',
          email: '',
          phone: '',
          zipCode: ''
        });
      } else {
        throw new Error('Sign-up failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign up. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />

      {/* Hero Section */}
      <Box
        position="relative"
        overflow="hidden"
        bgGradient={gradientBg}
        minH="80vh"
        display="flex"
        alignItems="center"
      >
        {/* Animated Background */}
        <MotionBox
          position="absolute"
          top="10%"
          right="5%"
          w="300px"
          h="300px"
          bg="purple.300"
          borderRadius="full"
          filter="blur(100px)"
          opacity={0.3}
          style={{ y: y1 }}
        />
        <MotionBox
          position="absolute"
          bottom="10%"
          left="5%"
          w="400px"
          h="400px"
          bg="pink.300"
          borderRadius="full"
          filter="blur(120px)"
          opacity={0.3}
          style={{ y: y2 }}
        />

        <Container maxW="container.xl" position="relative" zIndex={1}>
          <VStack spacing={8} textAlign="center">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge colorScheme="purple" fontSize="md" mb={4}>Launching Soon</Badge>
              <Heading as="h1" size="3xl" fontWeight="bold" mb={6}>
                CollegeNinja
              </Heading>
              <Text fontSize="2xl" fontWeight="medium" mb={4}>
                Your companion for school planning, college applications, and success.
              </Text>
              <Text fontSize="lg" color="gray.600" maxW="3xl" mx="auto">
                Join our revolutionary AI-powered platform that transforms the college application journey.
                From personalized recommendations to smart timeline planning, CollegeNinja combines cutting-edge
                technology with expert guidance to help you achieve your dream college admission.
              </Text>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} mt={8}>
                <Button
                  size="lg"
                  colorScheme="purple"
                  onClick={() => router.push('/collegeninja-platform')}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  Visit CollegeNinja Platform
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  colorScheme="purple"
                  onClick={onStudentOpen}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  Early Access Sign-up
                </Button>
              </Stack>
            </MotionBox>
          </VStack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box py={16} bg="purple.600" color="white">
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
            {stats.map((stat, index) => (
              <MotionBox
                key={index}
                textAlign="center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Stat>
                  <StatNumber fontSize="4xl">{stat.number}</StatNumber>
                  <StatLabel fontSize="lg" opacity={0.9}>{stat.label}</StatLabel>
                </Stat>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <MotionBox
              textAlign="center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Heading size="2xl" mb={4}>Powerful Features for Your Success</Heading>
              <Text fontSize="lg" color="gray.600">
                Everything you need to navigate the college application process with confidence
              </Text>
            </MotionBox>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
              {features.map((feature, index) => (
                <MotionCard
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  shadow="md"
                  _hover={{ shadow: 'xl' }}
                >
                  <CardBody p={8}>
                    <Flex justify="center" mb={4}>
                      <Box
                        p={3}
                        bg={`${feature.color}.100`}
                        borderRadius="full"
                        color={`${feature.color}.600`}
                      >
                        <Icon as={feature.icon} boxSize={8} />
                      </Box>
                    </Flex>
                    <Heading size="md" mb={3} textAlign="center">{feature.title}</Heading>
                    <Text color="gray.600" textAlign="center">{feature.description}</Text>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Coming Soon Section */}
      <Box py={16} bg="purple.50">
        <Container maxW="container.xl">
          <VStack spacing={8}>
            <Heading size="xl" textAlign="center">Coming Soon</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
              {comingSoonFeatures.map((feature, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <HStack
                    p={4}
                    bg="white"
                    borderRadius="lg"
                    shadow="sm"
                    _hover={{ shadow: 'md' }}
                    transition="all 0.2s"
                  >
                    <Icon as={FiClock} color="purple.500" />
                    <Text fontWeight="medium">{feature}</Text>
                  </HStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Heading size="xl" textAlign="center">Success Stories</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              {testimonials.map((testimonial, index) => (
                <MotionCard
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  bg={cardBg}
                  p={6}
                  borderRadius="lg"
                  shadow="md"
                >
                  <VStack align="start" spacing={4}>
                    <HStack>
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} as={FiStar} color="yellow.400" />
                      ))}
                    </HStack>
                    <Text fontSize="lg" fontStyle="italic">"{testimonial.quote}"</Text>
                    <Divider />
                    <HStack>
                      <Avatar name={testimonial.name} size="sm" />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold">{testimonial.name}</Text>
                        <Text fontSize="sm" color="gray.600">{testimonial.role}</Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </MotionCard>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20} bg="purple.600" color="white">
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center">
            <Heading size="2xl">Join the CollegeNinja Community</Heading>
            <Text fontSize="xl" maxW="2xl">
              Be among the first to experience the future of college planning
            </Text>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full" maxW="3xl">
              <Card bg="whiteAlpha.200" backdropFilter="blur(10px)" p={6}>
                <VStack spacing={4}>
                  <Icon as={FiBookOpen} boxSize={12} />
                  <Text fontSize="lg" fontWeight="bold">Coming Soon!</Text>
                  <Text>Platform launching July 2025</Text>
                </VStack>
              </Card>
              <Card
                bg="whiteAlpha.200"
                backdropFilter="blur(10px)"
                p={6}
                cursor="pointer"
                onClick={onStudentOpen}
                _hover={{ bg: 'whiteAlpha.300' }}
                transition="all 0.2s"
              >
                <VStack spacing={4}>
                  <Icon as={FiUsers} boxSize={12} />
                  <Text fontSize="lg" fontWeight="bold">Student/Parent Sign Up!</Text>
                  <Text>Get early access</Text>
                </VStack>
              </Card>
              <Card
                bg="whiteAlpha.200"
                backdropFilter="blur(10px)"
                p={6}
                cursor="pointer"
                onClick={onCounselorOpen}
                _hover={{ bg: 'whiteAlpha.300' }}
                transition="all 0.2s"
              >
                <VStack spacing={4}>
                  <Icon as={FiAward} boxSize={12} />
                  <Text fontSize="lg" fontWeight="bold">Counselor Sign Up!</Text>
                  <Text>Join as a partner</Text>
                </VStack>
              </Card>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Student Sign-up Modal */}
      <Modal isOpen={isStudentOpen} onClose={onStudentClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Student/Parent Early Access</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleStudentSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({...studentForm, name: e.target.value})}
                    placeholder="Enter your name"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                    placeholder="your.email@example.com"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    type="tel"
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm({...studentForm, phone: e.target.value})}
                    placeholder="(123) 456-7890"
                  />
                </FormControl>

                <SimpleGrid columns={2} spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Zip Code</FormLabel>
                    <Input
                      value={studentForm.zipCode}
                      onChange={(e) => setStudentForm({...studentForm, zipCode: e.target.value})}
                      placeholder="12345"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Grade Level</FormLabel>
                    <Select
                      value={studentForm.gradeLevel}
                      onChange={(e) => setStudentForm({...studentForm, gradeLevel: e.target.value})}
                      placeholder="Select grade"
                    >
                      <option value="9">9th Grade</option>
                      <option value="10">10th Grade</option>
                      <option value="11">11th Grade</option>
                      <option value="12">12th Grade</option>
                      <option value="college">College Student</option>
                      <option value="parent">Parent</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>

                <FormControl isRequired>
                  <FormLabel>Current School</FormLabel>
                  <Input
                    value={studentForm.currentSchool}
                    onChange={(e) => setStudentForm({...studentForm, currentSchool: e.target.value})}
                    placeholder="Your current school name"
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="purple"
                  width="full"
                  size="lg"
                  mt={4}
                >
                  Sign Up for Early Access
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Counselor Sign-up Modal */}
      <Modal isOpen={isCounselorOpen} onClose={onCounselorClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Counselor Partnership</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleCounselorSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    value={counselorForm.name}
                    onChange={(e) => setCounselorForm({...counselorForm, name: e.target.value})}
                    placeholder="Enter your name"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Professional Email</FormLabel>
                  <Input
                    type="email"
                    value={counselorForm.email}
                    onChange={(e) => setCounselorForm({...counselorForm, email: e.target.value})}
                    placeholder="your.email@school.edu"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    type="tel"
                    value={counselorForm.phone}
                    onChange={(e) => setCounselorForm({...counselorForm, phone: e.target.value})}
                    placeholder="(123) 456-7890"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Zip Code</FormLabel>
                  <Input
                    value={counselorForm.zipCode}
                    onChange={(e) => setCounselorForm({...counselorForm, zipCode: e.target.value})}
                    placeholder="12345"
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="purple"
                  width="full"
                  size="lg"
                  mt={4}
                >
                  Join as a Counselor Partner
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Footer />
    </Box>
  );
}