'use client';

import { Box, Container, Heading, Text, Button, Stack, SimpleGrid, Card, CardBody, CardHeader, VStack, HStack, Icon, useColorModeValue, Flex, Badge, Avatar, AvatarGroup } from '@chakra-ui/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiCode, FiUsers, FiAward, FiBookOpen, FiTrendingUp, FiTarget, FiChevronRight, FiStar } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { useEffect, useState } from 'react';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const gradientBg = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, gray.800, gray.900)'
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: FiCode,
      title: 'Project-Based Learning',
      description: 'Build real projects that showcase your skills and creativity',
      color: 'blue'
    },
    {
      icon: FiUsers,
      title: 'Expert Mentorship',
      description: 'Learn from industry professionals and experienced educators',
      color: 'purple'
    },
    {
      icon: FiAward,
      title: 'Proven Success',
      description: 'Students admitted to MIT, UC Berkeley, and other top universities',
      color: 'green'
    },
    {
      icon: FiBookOpen,
      title: 'Comprehensive Programs',
      description: 'From beginner to advanced, we have the right program for you',
      color: 'orange'
    }
  ];

  const programs = [
    {
      title: 'CollegeNinja',
      subtitle: 'Code-to-Campus',
      description: 'Master college applications with AI & programming skills',
      gradient: 'linear(135deg, #667eea 0%, #764ba2 100%)',
      students: '500+',
      rating: 4.9
    },
    {
      title: 'AI Courses',
      subtitle: 'Junior to Advanced',
      description: 'Learn AI from basics to building your own models',
      gradient: 'linear(135deg, #f093fb 0%, #f5576c 100%)',
      students: '800+',
      rating: 4.8
    },
    {
      title: 'Research Program',
      subtitle: 'Publication Ready',
      description: 'Conduct research and get published in IEEE journals',
      gradient: 'linear(135deg, #4facfe 0%, #00f2fe 100%)',
      students: '200+',
      rating: 5.0
    }
  ];

  const stats = [
    { number: '95%', label: 'College Acceptance Rate' },
    { number: '1000+', label: 'Students Taught' },
    { number: '50+', label: 'Research Papers' },
    { number: '4.9/5', label: 'Student Rating' }
  ];

  if (!mounted) return null;

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />

      {/* Hero Section with Parallax */}
      <Box
        position="relative"
        overflow="hidden"
        bgGradient={gradientBg}
        minH="100vh"
        display="flex"
        alignItems="center"
      >
        {/* Animated Background Elements */}
        <MotionBox
          position="absolute"
          top="10%"
          right="5%"
          w="300px"
          h="300px"
          bg="blue.300"
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
          bg="purple.300"
          borderRadius="full"
          filter="blur(120px)"
          opacity={0.3}
          style={{ y: y2 }}
        />

        <Container maxW="container.xl" position="relative" zIndex={1}>
          <VStack spacing={8} textAlign="center" py={20}>
            <MotionHeading
              as="h1"
              size="3xl"
              fontWeight="bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              Empowering the Next Generation of
              <br />
              <Text as="span" color="blue.500">Innovators</Text>
            </MotionHeading>

            <MotionText
              fontSize="xl"
              color="gray.600"
              maxW="3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              StemPro Academy bridges students to tech careers through hands-on AI and programming education.
              From Python basics to advanced AI, we prepare students for success in college admissions and beyond.
            </MotionText>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
                <Button
                  size="lg"
                  colorScheme="blue"
                  rightIcon={<FiChevronRight />}
                  onClick={() => router.push('/courses')}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  Explore Courses
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  colorScheme="blue"
                  onClick={() => router.push('/schedule')}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  Schedule Consultation
                </Button>
              </Stack>
            </MotionBox>
          </VStack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box py={16} bg="blue.600" color="white">
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
                <Text fontSize="4xl" fontWeight="bold">{stat.number}</Text>
                <Text fontSize="lg" opacity={0.9}>{stat.label}</Text>
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
              <Heading size="2xl" mb={4}>Why Choose StemPro Academy?</Heading>
              <Text fontSize="lg" color="gray.600">
                Real-world, project-based learning that makes a difference
              </Text>
            </MotionBox>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
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
                  <CardBody textAlign="center" p={8}>
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
                    <Heading size="md" mb={3}>{feature.title}</Heading>
                    <Text color="gray.600">{feature.description}</Text>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Programs Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <MotionBox
              textAlign="center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Heading size="2xl" mb={4}>Featured Programs</Heading>
              <Text fontSize="lg" color="gray.600">
                Transform your future with our signature programs
              </Text>
            </MotionBox>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              {programs.map((program, index) => (
                <MotionCard
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  position="relative"
                  overflow="hidden"
                  bg={cardBg}
                  shadow="lg"
                  _hover={{ shadow: '2xl' }}
                  cursor="pointer"
                  onClick={() => program.title === 'CollegeNinja' ? router.push('/collegeninja') : router.push('/programs')}
                >
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    h="4px"
                    bgGradient={program.gradient}
                  />
                  <CardHeader pb={2}>
                    <Heading size="lg">{program.title}</Heading>
                    <Text color="gray.500" fontSize="sm">{program.subtitle}</Text>
                  </CardHeader>
                  <CardBody pt={2}>
                    <Text color="gray.600" mb={4}>{program.description}</Text>
                    <HStack justify="space-between" align="center">
                      <HStack>
                        <AvatarGroup size="xs" max={3}>
                          <Avatar name="Student 1" />
                          <Avatar name="Student 2" />
                          <Avatar name="Student 3" />
                        </AvatarGroup>
                        <Text fontSize="sm" color="gray.500">{program.students}</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiStar} color="yellow.400" />
                        <Text fontSize="sm" fontWeight="bold">{program.rating}</Text>
                      </HStack>
                    </HStack>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        py={20}
        bgGradient="linear(to-r, blue.400, purple.600)"
        color="white"
        position="relative"
        overflow="hidden"
      >
        <MotionBox
          position="absolute"
          top="-50%"
          right="-10%"
          w="600px"
          h="600px"
          bg="whiteAlpha.200"
          borderRadius="full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        />
        <Container maxW="container.xl" position="relative">
          <VStack spacing={8} textAlign="center">
            <MotionHeading
              size="2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Ready to Start Your Journey?
            </MotionHeading>
            <MotionText
              fontSize="xl"
              maxW="2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Join our community and gain the skills you need for success
            </MotionText>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
                <Button
                  size="lg"
                  bg="white"
                  color="blue.600"
                  _hover={{
                    bg: 'gray.100',
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                  onClick={() => router.push('/register')}
                >
                  Enroll Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  borderColor="white"
                  color="white"
                  _hover={{
                    bg: 'whiteAlpha.200',
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                  onClick={() => router.push('/about')}
                >
                  Learn More
                </Button>
              </Stack>
            </MotionBox>
          </VStack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}