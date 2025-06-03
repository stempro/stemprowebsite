'use client';

import { Box, Container, Heading, Text, VStack, Card, CardBody, Button, Icon, useColorModeValue } from '@chakra-ui/react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { motion } from 'framer-motion';
import { FiLock, FiBookOpen } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function ResourcesPage() {
  const router = useRouter();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconBg = useColorModeValue('blue.50', 'blue.900');

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />

      <Box flex="1" py={16}>
        <Container maxW="container.lg">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <VStack spacing={12}>
              {/* Header Section */}
              <VStack spacing={6} textAlign="center">
                <Heading as="h1" size="2xl">Resources</Heading>
                <Text fontSize="xl" color="gray.600" maxW="2xl">
                  Welcome to the StemPro Academy Resources page. Here, you'll find a collection of our past courses and programs,
                  offering valuable insights and materials.
                </Text>
              </VStack>

              {/* Login Card */}
              <MotionCard
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                shadow="xl"
                maxW="xl"
                w="full"
              >
                <CardBody p={10}>
                  <VStack spacing={8}>
                    <Box
                      p={4}
                      bg={iconBg}
                      borderRadius="full"
                    >
                      <Icon as={FiLock} boxSize={12} color="blue.500" />
                    </Box>

                    <VStack spacing={4} textAlign="center">
                      <Heading size="lg">Access Resources</Heading>
                      <Text color="gray.600">
                        Our resources are available exclusively to registered users.
                        Please log in to browse our full selection of past courses, programs, and learning materials.
                      </Text>
                    </VStack>

                    <VStack spacing={4} w="full">
                      <Button
                        colorScheme="blue"
                        size="lg"
                        width="full"
                        leftIcon={<FiBookOpen />}
                        onClick={() => router.push('/login')}
                        _hover={{
                          transform: 'translateY(-2px)',
                          boxShadow: 'lg',
                        }}
                        transition="all 0.2s"
                      >
                        Log In to Access Resources
                      </Button>

                      <Text fontSize="sm" color="gray.500">
                        Don't have an account?{' '}
                        <Button
                          variant="link"
                          colorScheme="blue"
                          size="sm"
                          onClick={() => router.push('/enroll')}
                        >
                          Sign up here
                        </Button>
                      </Text>
                    </VStack>
                  </VStack>
                </CardBody>
              </MotionCard>

              {/* Benefits Section */}
              <VStack spacing={6} textAlign="center" maxW="2xl">
                <Heading size="md">What You'll Find in Our Resources</Heading>
                <VStack spacing={3} align="stretch">
                  <Text>• Past course materials and recordings</Text>
                  <Text>• Program documentation and guides</Text>
                  <Text>• Student project showcases</Text>
                  <Text>• Additional learning resources</Text>
                  <Text>• Community discussion archives</Text>
                </VStack>
              </VStack>
            </VStack>
          </MotionBox>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}