'use client';
import { Box, Container, Heading, Text, VStack, Button, Stack, Icon, useColorModeValue, SimpleGrid, Card, CardBody, Progress, HStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiZap, FiArrowLeft, FiBell, FiClock, FiSend, FiTarget, FiUsers } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function CollegeNinjaPlatformPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const gradientBg = useColorModeValue(
    'linear(to-br, purple.600, pink.600)',
    'linear(to-br, purple.900, pink.900)'
  );

  // Calculate days until launch (Q2 2025 - let's say June 1, 2025)
  const launchDate = new Date('2025-07-31');
  const today = new Date();
  const daysUntilLaunch = Math.ceil((launchDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const features = [
    {
      icon: FiZap,
      title: 'AI-Powered Matching',
      description: 'Get personalized college recommendations based on your unique profile',
      color: 'purple'
    },
    {
      icon: FiTarget,
      title: 'Smart Applications',
      description: 'Track deadlines, manage documents, and optimize your applications',
      color: 'pink'
    },
    {
      icon: FiUsers,
      title: 'Expert Guidance',
      description: 'Connect with counselors and mentors for personalized support',
      color: 'blue'
    }
  ];

  const handleNotifyMe = async () => {
    if (email) {
      // In a real app, this would save the email for notifications
      setIsSubscribed(true);
      setTimeout(() => {
        router.push('/collegeninja');
      }, 2000);
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
        color="white"
        minH="70vh"
        display="flex"
        alignItems="center"
      >
        {/* Animated circles */}
        <MotionBox
          position="absolute"
          top="-20%"
          right="-10%"
          w="400px"
          h="400px"
          borderRadius="full"
          bg="whiteAlpha.200"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        />
        <MotionBox
          position="absolute"
          bottom="-20%"
          left="-10%"
          w="500px"
          h="500px"
          borderRadius="full"
          bg="whiteAlpha.200"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
        />

        <Container maxW="container.xl" position="relative" zIndex={1}>
          <VStack spacing={8} textAlign="center">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Icon as={FiClock} boxSize={16} mb={4} />
              <Heading as="h1" size="3xl" fontWeight="bold" mb={4}>
                CollegeNinja Platform
              </Heading>
              <Heading as="h2" size="xl" fontWeight="normal" opacity={0.9}>
                Coming Soon - July 2025
              </Heading>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              maxW="2xl"
            >
              <Text fontSize="xl" mb={8}>
                We're building something revolutionary. The future of college planning is almost here.
              </Text>

              {/* Countdown */}
              <Box bg="whiteAlpha.200" p={6} borderRadius="xl" backdropFilter="blur(10px)">
                <Text fontSize="lg" mb={2}>Launching in</Text>
                <Heading size="2xl">{daysUntilLaunch} Days</Heading>
              </Box>
            </MotionBox>

            {/* Notify Me Section */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              w="full"
              maxW="md"
            >
              {!isSubscribed ? (
                <VStack spacing={4}>
                  <Text fontSize="lg">Be the first to know when we launch!</Text>
                  <HStack w="full">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '12px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '16px',
                        backgroundColor: 'white',
                        color: '#333'
                      }}
                    />
                    <Button
                      colorScheme="purple"
                      size="lg"
                      leftIcon={<FiBell />}
                      onClick={handleNotifyMe}
                      isDisabled={!email}
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg',
                      }}
                      style={{ transition: 'all 0.2s' }}
                    >
                      Notify Me
                    </Button>
                  </HStack>
                </VStack>
              ) : (
                <Box bg="green.500" p={4} borderRadius="lg">
                  <Text fontSize="lg" fontWeight="bold">
                    ✓ You're on the list! We'll notify you when we launch.
                  </Text>
                </Box>
              )}
            </MotionBox>
          </VStack>
        </Container>
      </Box>

      {/* Features Preview */}
      <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <MotionBox
              textAlign="center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Heading size="xl" mb={4}>What's Coming</Heading>
              <Text fontSize="lg" color="gray.600">
                A glimpse of the powerful features we're building for you
              </Text>
            </MotionBox>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              {features.map((feature, index) => (
                <MotionCard
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  p={8}
                  textAlign="center"
                  _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}
                  style={{ transition: 'all 0.3s' }}
                >
                  <Icon
                    as={feature.icon}
                    boxSize={12}
                    color={`${feature.color}.500`}
                    mb={4}
                  />
                  <Heading size="md" mb={3}>{feature.title}</Heading>
                  <Text color="gray.600">{feature.description}</Text>
                </MotionCard>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Progress Section */}
      <Box py={16} bg="purple.50">
        <Container maxW="container.xl">
          <VStack spacing={8}>
            <Heading size="lg">Development Progress</Heading>
            <Box w="full" maxW="2xl">
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="bold">Platform Development</Text>
                <Text fontWeight="bold">75%</Text>
              </HStack>
              <Progress value={75} size="lg" colorScheme="purple" borderRadius="full" />
              <Text fontSize="sm" color="gray.600" mt={2}>
                AI matching algorithm, user dashboard, and core features are complete.
                Fine-tuning the experience for launch!
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20} textAlign="center">
        <Container>
          <VStack spacing={8}>
            <Heading size="xl">Can't Wait?</Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              While we put the finishing touches on the platform, you can still get started
              with our programs and prepare for your college journey.
            </Text>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
              <Button
                size="lg"
                leftIcon={<FiArrowLeft />}
                onClick={() => router.push('/collegeninja')}
                variant="outline"
                colorScheme="purple"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                style={{ transition: 'all 0.2s' }}
              >
                Back to CollegeNinja
              </Button>
              <Button
                size="lg"
                colorScheme="purple"
                onClick={() => router.push('/programs')}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                style={{ transition: 'all 0.2s' }}
              >
                Explore Our Programs
              </Button>
            </Stack>
          </VStack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}