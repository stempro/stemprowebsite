'use client';

import { Box, Container, Heading, Text, VStack, Stack, SimpleGrid, Card, CardBody, CardHeader, Button, Icon, useColorModeValue } from '@chakra-ui/react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiUsers, FiAward, FiTarget, FiBookOpen } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function AboutPage() {
  const router = useRouter();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />

      <Box flex="1" py={16}>
        <Container maxW="container.xl">
          {/* Hero Section */}
          <MotionBox {...fadeInUp} mb={16}>
            <VStack spacing={6} textAlign="center">
              <Heading as="h1" size="2xl">About StemPro Academy</Heading>
              <Text fontSize="xl" color="gray.600" maxW="4xl">
                StemPro Academy is a nonprofit organization founded by engineering professionals to advance STEM education through real-world, project-based learning. We bridge students to tech careers, equipping them with hands-on skills in AI, programming, and data science.
              </Text>
            </VStack>
          </MotionBox>

          {/* Mission Section */}
          <MotionCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            mb={16}
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            p={8}
            borderRadius="xl"
            shadow="lg"
          >
            <CardHeader>
              <Heading size="lg" display="flex" alignItems="center">
                <Icon as={FiTarget} mr={3} color="blue.500" />
                Our Mission
              </Heading>
            </CardHeader>
            <CardBody>
              <Text fontSize="lg">
                StemPro Academy empowers students to excel in STEM, with a focus on AI and programming. Through hands-on, project-based learning, we provide resources and guidance for real-world success, supporting students and parents in building skills for both academic and career achievements.
              </Text>
            </CardBody>
          </MotionCard>

          {/* Programs Overview */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            mb={16}
          >
            <VStack spacing={8}>
              <Heading size="xl" textAlign="center">What We Offer</Heading>
              <Text fontSize="lg" textAlign="center" color="gray.600">
                We offer programs for all levels, from Python basics for middle schoolers to advanced AI for high schoolers and career starters. Our signature CollegeNinja: Code-to-Campus Program combines college application guidance with AI and programming skills, giving students a competitive edge in admissions.
              </Text>
              <Text fontSize="lg" textAlign="center" fontWeight="bold" color="blue.600">
                "Stay Updated, Learn Fresh, Teach the Latest"
              </Text>
            </VStack>
          </MotionBox>

          {/* Team Section */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            mb={16}
          >
            <Heading size="xl" textAlign="center" mb={12}>Our Team</Heading>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <MotionCard
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                p={6}
                borderRadius="lg"
              >
                <CardHeader>
                  <Heading size="md" display="flex" alignItems="center">
                    <Icon as={FiAward} mr={3} color="purple.500" />
                    Principal & Leadership
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Text>
                    Our Principal leads StemPro Academy with a profound commitment to STEM education, particularly in advancing AI and programming skills that prepare students for future challenges. With a strong background in both academia and industry, the Principal champions a vision that integrates state-of-the-art technology with hands-on, project-based learning.
                  </Text>
                </CardBody>
              </MotionCard>

              <MotionCard
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                p={6}
                borderRadius="lg"
              >
                <CardHeader>
                  <Heading size="md" display="flex" alignItems="center">
                    <Icon as={FiUsers} mr={3} color="green.500" />
                    Expert Mentors
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Text>
                    Our mentors are seasoned industry professionals and esteemed academics, bringing expertise from leading organizations and universities. They guide students through project-based learning, helping them tackle complex AI and programming challenges with real-world experience.
                  </Text>
                </CardBody>
              </MotionCard>

              <MotionCard
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                p={6}
                borderRadius="lg"
              >
                <CardHeader>
                  <Heading size="md" display="flex" alignItems="center">
                    <Icon as={FiBookOpen} mr={3} color="orange.500" />
                    Dedicated Teachers
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Text>
                    Our teachers are dedicated educators with robust STEM backgrounds and a commitment to personalized instruction. They adapt complex concepts into engaging, accessible lessons that foster critical thinking, collaboration, and a passion for lifelong learning.
                  </Text>
                </CardBody>
              </MotionCard>

              <MotionCard
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                p={6}
                borderRadius="lg"
              >
                <CardHeader>
                  <Heading size="md" display="flex" alignItems="center">
                    <Icon as={FiUsers} mr={3} color="red.500" />
                    Guest Speakers
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Text>
                    We regularly invite guest speakers, including alumni, industry leaders, and college admissions experts, who bring diverse perspectives and practical advice to our programs. These sessions offer students a well-rounded view of STEM fields.
                  </Text>
                </CardBody>
              </MotionCard>
            </SimpleGrid>
          </MotionBox>

          {/* Contact Section */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            textAlign="center"
            bg="blue.50"
            p={12}
            borderRadius="xl"
          >
            <Heading size="lg" mb={6}>Join Our Team</Heading>
            <Text fontSize="lg" mb={8}>
              We are always looking for passionate individuals to join our collaborative journey. Contact us to learn more about opportunities at StemPro Academy.
            </Text>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4} justify="center" align="center">
              <Button
                leftIcon={<FiMail />}
                colorScheme="blue"
                size="lg"
                onClick={() => window.location.href = 'mailto:info@stempro.org'}
              >
                info@stempro.org
              </Button>
              <Button
                leftIcon={<FiPhone />}
                variant="outline"
                colorScheme="blue"
                size="lg"
                onClick={() => window.location.href = 'tel:425-230-0688'}
              >
                425-230-0688
              </Button>
            </Stack>
          </MotionBox>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}