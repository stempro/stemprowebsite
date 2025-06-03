'use client';

import { Box, Container, Heading, Text, VStack, Tab, TabList, TabPanel, TabPanels, Tabs, Button, Stack, List, ListItem, Badge, Icon, useColorModeValue, Alert, AlertIcon, AlertTitle, AlertDescription, Link, HStack, Flex } from '@chakra-ui/react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { motion } from 'framer-motion';
import { FiCode, FiUsers, FiBookOpen, FiAward, FiBriefcase, FiClock, FiMusic, FiMail, FiExternalLink } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const MotionBox = motion(Box);

export default function ProgramsPage() {
  const router = useRouter();
  const tabBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const highlightBg = useColorModeValue('blue.50', 'blue.900');
  const urgentBg = useColorModeValue('purple.50', 'purple.900');
  const urgentBorder = useColorModeValue('purple.400', 'purple.600');
  const gradientAlert = useColorModeValue(
    'linear(to-r, purple.500, pink.500)',
    'linear(to-r, purple.700, pink.700)'
  );

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const programs = [
    {
      id: 'college-ninja',
      title: '👨‍🎓 CollegeNinja: Code-to-Campus Series',
      subtitle: 'Master College Applications with AI & Programming',
      description: 'Why just apply to college when you can master the process? StemPro Academy\'s flagship CollegeNinja: Code-to-Campus Series empowers students and parents to become college application experts.',
      highlights: [
        'Master the Process: Craft a profile that highlights your unique strengths',
        'AI-Driven Gap Analysis: Identify growth areas to match top college expectations',
        'Execute with Precision: Harness AI tools for SAT, ACT, and essay prep'
      ],
      outcomes: [
        'Become an expert in preparing standout college applications',
        'Build a distinctive, competitive application using AI',
        'Develop practical skills in AI and programming',
        'Complete the program with a portfolio showcasing innovation'
      ],
      duration: 'Flexible sessions customized to fit each student\'s schedule',
      classSize: 'Small groups of 5 to 8 students',
      color: 'blue'
    },
    {
      id: 'junior-researcher',
      title: '🧑‍🔬 High School Research Program',
      subtitle: 'High-Impact Research Mentorship',
      description: 'Empowering students to achieve excellence and recognition through real-world research projects. Our students have earned prestigious publications in IEEE journals and presented their work at MIT URTC.',
      highlights: [
        'Research methodology and data analysis',
        'Academic writing and presenting findings',
        'One-on-one mentorship throughout the process'
      ],
      outcomes: [
        'Complete a publishable research project',
        'Gain academic recognition',
        'Enhance college applications with research experience',
        'Build foundation for lifelong learning'
      ],
      duration: 'Flexible, with sessions customized to individual schedules',
      classSize: 'One-on-one mentorship',
      color: 'purple'
    },
    {
      id: 'interview-clinic',
      title: '👨‍⚕️ Interview Clinic',
      subtitle: 'Mastering Interviews for Internships, Jobs, and Admissions',
      description: 'Build the confidence and skills needed to excel in high-stakes interviews with expert guidance from seasoned industry professionals.',
      highlights: [
        'In-depth mock interviews',
        'Communication training',
        'Personalized feedback from industry mentors'
      ],
      outcomes: [
        'Enhanced confidence in interviews',
        'Refined communication skills',
        'Tools to stand out in internship and job interviews',
        'Preparation for college admission interviews'
      ],
      duration: 'On-demand sessions tailored to your availability',
      classSize: 'Individual sessions',
      color: 'green'
    }
  ];

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      {/* Top Banner Alert */}
      <Box
        bgGradient={gradientAlert}
        color="white"
        py={3}
        px={4}
        position="relative"
        overflow="hidden"
      >
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Container maxW="container.xl">
            <Flex align="center" justify="center" wrap="wrap" gap={2}>
              <Icon as={FiMusic} boxSize={5} />
              <Text fontSize="lg" fontWeight="bold">
                🎵 NEW: Music AI Research Program Now Open!
              </Text>
              <Text fontSize="md">
                Join our groundbreaking research collaboration with Moodbox.IO. Only 2 spots remaining!
              </Text>
              <Button
                size="sm"
                bg="whiteAlpha.200"
                color="white"
                _hover={{ bg: 'whiteAlpha.300' }}
                onClick={() => router.push('/register')}
                ml={2}
              >
                Register Now →
              </Button>
            </Flex>
          </Container>
        </MotionBox>
      </Box>

      <Header />

      <Box flex="1" py={16}>
        <Container maxW="container.xl">
          {/* Hero Section */}
          <MotionBox {...fadeInUp} mb={12}>
            <VStack spacing={6} textAlign="center">
              <Heading as="h1" size="2xl">Transformative Programs</Heading>
              <Text fontSize="xl" color="gray.600" maxW="4xl">
                StemPro Academy offers transformative programs designed to prepare students for success in college applications, research, and professional interviews. With a unique blend of AI tools, coding, and expert mentorship, our programs provide a hands-on approach to mastering college admissions, building impactful research, and excelling in high-stakes interviews.
              </Text>
            </VStack>
          </MotionBox>

          {/* Music Research Program Highlight Box */}
          <MotionBox
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            bg={urgentBg}
            borderWidth="2px"
            borderColor={urgentBorder}
            borderRadius="xl"
            p={8}
            mb={12}
            position="relative"
            overflow="hidden"
          >
            {/* Animated background pattern */}
            <Box
              position="absolute"
              top="-50%"
              right="-10%"
              w="300px"
              h="300px"
              bg="purple.300"
              borderRadius="full"
              opacity={0.1}
              filter="blur(40px)"
            />

            <VStack spacing={4} position="relative" zIndex={1}>
              <HStack spacing={3}>
                <Icon as={FiMusic} boxSize={8} color="purple.600" />
                <Heading size="lg" color={useColorModeValue('purple.800', 'purple.200')}>
                  🚀 Onboard Now! Music AI Research Program with Moodbox.IO
                </Heading>
              </HStack>

              <Text fontSize="lg" fontWeight="medium" textAlign="center">
                Join our exciting Music Analysis & Music Therapy research program in collaboration with
                Moodbox.IO, a cutting-edge music technology startup revolutionizing therapeutic applications of AI in music.
              </Text>

              <Flex
                direction={{ base: 'column', md: 'row' }}
                gap={6}
                w="full"
                justify="center"
                align="center"
              >
                <VStack>
                  <Badge colorScheme="purple" fontSize="lg" p={3} borderRadius="md" variant="solid">
                    ⚡ FILLING FAST: 8/10 Spaces Taken!
                  </Badge>
                  <Text fontSize="sm" color="gray.600">Only 2 spots remaining</Text>
                </VStack>

                <VStack align="start" spacing={1}>
                  <HStack>
                    <Icon as={FiClock} color="purple.600" />
                    <Text fontWeight="bold">Duration: 10 weeks</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiUsers} color="purple.600" />
                    <Text fontWeight="bold">Application Deadline: June 15, 2025</Text>
                  </HStack>
                </VStack>
              </Flex>

              <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} pt={4}>
                <Button
                  colorScheme="purple"
                  size="lg"
                  onClick={() => router.push('/register')}
                  rightIcon={<FiExternalLink />}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'xl',
                  }}
                  transition="all 0.2s"
                >
                  Register Now
                </Button>
                <Button
                  variant="outline"
                  colorScheme="purple"
                  size="lg"
                  as={Link}
                  href="mailto:info@stempro.org?subject=Music AI Research Program Inquiry"
                  leftIcon={<FiMail />}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  Questions? Email us
                </Button>
              </Stack>
            </VStack>
          </MotionBox>

          {/* Programs Tabs */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs variant="soft-rounded" colorScheme="blue" size="lg">
              <TabList mb={8} justifyContent="center" flexWrap="wrap">
                <Tab mx={2} mb={2}>CollegeNinja</Tab>
                <Tab mx={2} mb={2}>High School Research</Tab>
                <Tab mx={2} mb={2}>Interview Clinic</Tab>
              </TabList>

              <TabPanels>
                {programs.map((program, index) => (
                  <TabPanel key={program.id}>
                    <MotionBox
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      bg={tabBg}
                      p={8}
                      borderRadius="xl"
                      borderWidth="1px"
                      borderColor={borderColor}
                      shadow="lg"
                    >
                      <VStack align="stretch" spacing={6}>
                        <Box>
                          <Heading size="lg" mb={2}>{program.title}</Heading>
                          <Text fontSize="xl" fontWeight="semibold" color={`${program.color}.600`}>
                            {program.subtitle}
                          </Text>
                        </Box>

                        <Text fontSize="lg" color="gray.600">
                          {program.description}
                        </Text>

                        <Box>
                          <Heading size="md" mb={3}>Program Highlights</Heading>
                          <List spacing={2}>
                            {program.highlights.map((highlight, idx) => (
                              <ListItem key={idx} display="flex" alignItems="flex-start">
                                <Icon as={FiCode} color={`${program.color}.500`} mt={1} mr={2} />
                                <Text>{highlight}</Text>
                              </ListItem>
                            ))}
                          </List>
                        </Box>

                        <Box bg={highlightBg} p={6} borderRadius="lg">
                          <Heading size="md" mb={3}>Outcomes</Heading>
                          <List spacing={2}>
                            {program.outcomes.map((outcome, idx) => (
                              <ListItem key={idx} display="flex" alignItems="flex-start">
                                <Icon as={FiAward} color={`${program.color}.500`} mt={1} mr={2} />
                                <Text>{outcome}</Text>
                              </ListItem>
                            ))}
                          </List>
                        </Box>

                        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} align="center">
                          <Badge colorScheme={program.color} p={2} borderRadius="md" display="flex" alignItems="center">
                            <Icon as={FiClock} mr={2} />
                            Duration: {program.duration}
                          </Badge>
                          <Badge colorScheme={program.color} p={2} borderRadius="md" display="flex" alignItems="center">
                            <Icon as={FiUsers} mr={2} />
                            Class Size: {program.classSize}
                          </Badge>
                        </Stack>

                        <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} pt={4}>
                          <Button
                            colorScheme={program.color}
                            size="lg"
                            onClick={() => program.id === 'college-ninja' ? router.push('/collegeninja') : router.push('/register')}
                            flex={1}
                            _hover={{
                              transform: 'translateY(-2px)',
                              boxShadow: 'lg',
                            }}
                            transition="all 0.2s"
                          >
                            {program.id === 'college-ninja' ? 'Learn More' : 'Sign Up Now'}
                          </Button>
                          <Button
                            variant="outline"
                            colorScheme={program.color}
                            size="lg"
                            onClick={() => router.push('/schedule')}
                            flex={1}
                            _hover={{
                              transform: 'translateY(-2px)',
                              boxShadow: 'lg',
                            }}
                            transition="all 0.2s"
                          >
                            Schedule Consultation
                          </Button>
                        </Stack>

                        {program.id !== 'interview-clinic' && (
                          <Button
                            variant="link"
                            colorScheme={program.color}
                            onClick={() => router.push('/success')}
                            alignSelf="flex-start"
                          >
                            View Success Stories →
                          </Button>
                        )}
                      </VStack>
                    </MotionBox>
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </MotionBox>

          {/* CTA Section */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            mt={16}
            textAlign="center"
            bg="gray.50"
            p={12}
            borderRadius="xl"
          >
            <Heading size="lg" mb={4}>Ready to Transform Your Future?</Heading>
            <Text fontSize="lg" mb={8}>
              Join us today to gain hands-on experience and achieve your goals!
            </Text>
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} justify="center">
              <Button
                colorScheme="blue"
                size="lg"
                onClick={() => router.push('/register')}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                transition="all 0.2s"
              >
                Sign Up Today
              </Button>
              <Button
                variant="outline"
                colorScheme="blue"
                size="lg"
                onClick={() => router.push('/schedule')}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                transition="all 0.2s"
              >
                Schedule a Free Consultation
              </Button>
            </Stack>
          </MotionBox>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}