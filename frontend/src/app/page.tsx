'use client';

import { Box, Container, Heading, Text, Button, Stack, SimpleGrid, Card, CardBody, CardHeader, VStack, HStack, Icon, useColorModeValue, Flex, Badge, Avatar, AvatarGroup } from '@chakra-ui/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiCode, FiUsers, FiAward, FiBookOpen, FiTrendingUp, FiTarget, FiChevronRight, FiStar, FiChevronDown } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { useEffect, useState } from 'react';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionIcon = motion(Icon);

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
      description: 'Build real projects that showcase your skills',
      color: 'blue'
    },
    {
      icon: FiUsers,
      title: 'Expert Mentorship',
      description: 'Learn from industry professionals',
      color: 'purple'
    },
    {
      icon: FiAward,
      title: 'Proven Success',
      description: 'Students admitted to top universities',
      color: 'green'
    },
    {
      icon: FiBookOpen,
      title: 'Comprehensive Programs',
      description: 'From beginner to advanced levels',
      color: 'orange'
    }
  ];

  const programs = [
    {
      title: 'CollegeNinja',
      subtitle: 'Code-to-Campus',
      description: 'Master college applications with AI & programming skills',
      gradient: 'linear(135deg, #667eea 0%, #764ba2 100%)',
      students: '100+',
      rating: 4.9
    },
    {
      title: 'AI Courses',
      subtitle: 'Junior to Advanced',
      description: 'Learn AI from basics to building your own models',
      gradient: 'linear(135deg, #f093fb 0%, #f5576c 100%)',
      students: '500+',
      rating: 4.8
    },
    {
      title: 'Research Program',
      subtitle: 'Publication Ready',
      description: 'Conduct research and get published in top journals',
      gradient: 'linear(135deg, #4facfe 0%, #00f2fe 100%)',
      students: '50+',
      rating: 5.0
    }
  ];

  const stats = [
    { number: '95%', label: 'Top-Tier Admissions', icon: FiAward },
    { number: '500+', label: 'Students Taught', icon: FiUsers },
    { number: '50+', label: 'Research Papers', icon: FiBookOpen },
    { number: '4.9/5', label: 'Student Rating', icon: FiStar }
  ];

  if (!mounted) return null;

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />

      {/* Hero Section - Reduced Height */}
      <Box
        position="relative"
        overflow="hidden"
        bgGradient={gradientBg}
        minH={{ base: "85vh", md: "75vh" }}
        display="flex"
        alignItems="center"
        pb={20} // Extra padding bottom for stats overlap
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
          <VStack spacing={6} textAlign="center" py={10}>
            <MotionHeading
              as="h1"
              size={{ base: "2xl", md: "3xl" }}
              fontWeight="bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Empowering the Next Generation of
              <Text as="span" color="blue.500"> Innovators</Text>
            </MotionHeading>

            <MotionText
              fontSize={{ base: "lg", md: "xl" }}
              color="gray.600"
              maxW="2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Bridge to tech careers through hands-on AI and programming education.
              From Python basics to advanced AI.
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
                  Free Consultation
                </Button>
              </Stack>
            </MotionBox>
          </VStack>
        </Container>

        {/* Scroll Indicator */}
        <Box
          position="absolute"
          bottom="30px"
          left="50%"
          transform="translateX(-50%)"
          cursor="pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight * 0.7, behavior: 'smooth' })}
        >
          <VStack spacing={2}>
            <Text fontSize="sm" color="gray.600">Scroll to explore</Text>
            <MotionIcon
              as={FiChevronDown}
              boxSize={6}
              color="blue.500"
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </VStack>
        </Box>
      </Box>

      {/* Floating Stats Cards - Overlapping Hero */}
      <Box position="relative" mt={{ base: -16, md: -20 }} zIndex={2} px={4}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 4, md: 6 }}>
            {stats.map((stat, index) => (
              <MotionCard
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                bg={cardBg}
                shadow="xl"
                borderWidth="1px"
                borderColor={borderColor}
                _hover={{ transform: 'translateY(-5px)', shadow: '2xl' }}
                style={{ transition: 'all 0.3s' }}
              >
                <CardBody textAlign="center" p={{ base: 4, md: 6 }}>
                  <Icon as={stat.icon} boxSize={8} color="blue.500" mb={2} />
                  <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="blue.600">
                    {stat.number}
                  </Text>
                  <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">
                    {stat.label}
                  </Text>
                </CardBody>
              </MotionCard>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Programs Section - Immediately Visible */}
      <Box py={{ base: 16, md: 20 }} bg={useColorModeValue('white', 'gray.900')}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <MotionBox
              textAlign="center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge colorScheme="blue" mb={4} fontSize="sm">Our Programs</Badge>
              <Heading size="2xl" mb={4}>Transform Your Future</Heading>
              <Text fontSize="lg" color="gray.600">
                Choose the program that matches your goals
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

      {/* Features Section - Condensed */}
      <Box py={{ base: 16, md: 20 }} bg={useColorModeValue('gray.50', 'gray.800')}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <MotionBox
              textAlign="center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Heading size="xl" mb={4}>Why Choose StemPro?</Heading>
            </MotionBox>

            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 4, md: 6 }} w="full">
              {features.map((feature, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  textAlign="center"
                >
                  <Box
                    p={3}
                    bg={`${feature.color}.100`}
                    borderRadius="full"
                    color={`${feature.color}.600`}
                    display="inline-flex"
                    mb={3}
                  >
                    <Icon as={feature.icon} boxSize={6} />
                  </Box>
                  <Heading size="sm" mb={2}>{feature.title}</Heading>
                  <Text fontSize="sm" color="gray.600">{feature.description}</Text>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        py={{ base: 16, md: 20 }}
        bgGradient="linear(to-r, blue.400, purple.600)"
        color="white"
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.xl" position="relative">
          <VStack spacing={8} textAlign="center">
            <MotionHeading
              size="xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Ready to Start Your Journey?
            </MotionHeading>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
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