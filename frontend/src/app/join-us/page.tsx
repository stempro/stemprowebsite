'use client';

import { Box, Container, Heading, Text, VStack, Card, CardBody, CardHeader, SimpleGrid, Button, Badge, HStack, Icon, useColorModeValue, Divider, List, ListItem, ListIcon, Flex } from '@chakra-ui/react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiMapPin, FiMail, FiBriefcase, FiCode, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { useState } from 'react';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

interface JobPosition {
  id: string;
  title: string;
  icon: any;
  type: string;
  location: string;
  color: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
}

export default function JoinUsPage() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const positions: JobPosition[] = [
    {
      id: 'ai-instructor',
      title: 'AI Program Instructor',
      icon: FiUsers,
      type: 'Part-time',
      location: 'Remote',
      color: 'purple',
      description: 'Join our team as an AI Program Instructor and inspire the next generation of innovators. Share your expertise in artificial intelligence and machine learning with motivated students.',
      responsibilities: [
        'Design and deliver engaging AI curriculum for middle and high school students',
        'Create hands-on projects that demonstrate real-world AI applications',
        'Mentor students through their learning journey and project development',
        'Collaborate with the curriculum team to enhance course content',
        'Provide regular feedback and progress reports to students and parents'
      ],
      qualifications: [
        'Strong background in AI/ML with industry or research experience',
        'Excellent communication skills and passion for teaching',
        'Experience with Python, TensorFlow/PyTorch, and popular AI frameworks',
        'Bachelor\'s degree in Computer Science, AI, or related field (Master\'s preferred)',
        'Previous teaching or mentoring experience is a plus'
      ],
      benefits: [
        'Flexible remote work arrangement',
        'Competitive hourly compensation',
        'Opportunity to shape young minds in AI education',
        'Access to cutting-edge AI resources and tools',
        'Professional development opportunities'
      ]
    },
    {
      id: 'fullstack-developer',
      title: 'Full-Stack Developer',
      icon: FiCode,
      type: 'Contract',
      location: 'Remote',
      color: 'blue',
      description: 'We\'re looking for a talented Full-Stack Developer to help build and maintain our educational platform and student management systems.',
      responsibilities: [
        'Develop and maintain web applications using modern frameworks',
        'Build RESTful APIs and integrate with frontend applications',
        'Implement new features for our learning management system',
        'Ensure application security, performance, and scalability',
        'Collaborate with the team on technical architecture decisions'
      ],
      qualifications: [
        'Proficiency in React/Next.js and Node.js/Python',
        'Experience with database design (PostgreSQL, MongoDB)',
        'Strong understanding of web security best practices',
        'Familiarity with cloud platforms (AWS, Google Cloud)',
        '3+ years of full-stack development experience'
      ],
      benefits: [
        'Work on meaningful education technology projects',
        'Flexible hours and remote work',
        'Competitive contract rates',
        'Opportunity for long-term engagement',
        'Collaborative and supportive team environment'
      ]
    },
    {
      id: 'program-coordinator',
      title: 'Program Coordinator',
      icon: FiBriefcase,
      type: 'Part-time',
      location: 'Remote',
      color: 'green',
      description: 'Help us coordinate and manage our educational programs, ensuring smooth operations and excellent student experiences.',
      responsibilities: [
        'Coordinate class schedules and manage program logistics',
        'Communicate with students, parents, and instructors',
        'Track student progress and maintain program records',
        'Assist with enrollment and onboarding processes',
        'Support marketing efforts and program promotion'
      ],
      qualifications: [
        'Excellent organizational and communication skills',
        'Experience in educational administration or program management',
        'Proficiency with productivity tools and CRM systems',
        'Detail-oriented with strong multitasking abilities',
        'Bachelor\'s degree in Education, Business, or related field'
      ],
      benefits: [
        'Flexible part-time schedule',
        'Work from home opportunity',
        'Be part of an innovative education team',
        'Growth opportunities within the organization',
        'Make a direct impact on student success'
      ]
    },
    {
      id: 'marketing-partner',
      title: 'Marketing Partner',
      icon: FiTrendingUp,
      type: 'Contract',
      location: 'Remote',
      color: 'orange',
      description: 'Partner with us to expand our reach and help more students discover the power of AI and STEM education.',
      responsibilities: [
        'Develop and execute digital marketing strategies',
        'Manage social media presence and content creation',
        'Create compelling marketing materials and campaigns',
        'Analyze marketing metrics and optimize campaigns',
        'Build partnerships with schools and educational organizations'
      ],
      qualifications: [
        'Proven experience in digital marketing and social media',
        'Strong content creation and copywriting skills',
        'Experience with SEO, SEM, and email marketing',
        'Understanding of the education sector is a plus',
        'Self-motivated with entrepreneurial mindset'
      ],
      benefits: [
        'Performance-based compensation structure',
        'Creative freedom in campaign development',
        'Long-term partnership opportunity',
        'Work with a mission-driven organization',
        'Flexible working arrangement'
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
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
            mb={16}
          >
            <VStack spacing={6} textAlign="center">
              <Heading as="h1" size="2xl">Join Our Team</Heading>
              <Text fontSize="xl" color="gray.600" maxW="3xl">
                Be part of our mission to empower the next generation through innovative STEM education.
                We're looking for passionate individuals who want to make a real difference in students' lives.
              </Text>
            </VStack>
          </MotionBox>

          {/* Open Positions */}
          <VStack spacing={8} align="stretch">
            <Heading size="lg" textAlign="center">Open Positions</Heading>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                {positions.map((position) => (
                  <motion.div key={position.id} variants={itemVariants}>
                    <MotionCard
                      bg={cardBg}
                      borderWidth="1px"
                      borderColor={borderColor}
                      shadow="md"
                      _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }}
                      transition="all 0.3s"
                      cursor="pointer"
                      onClick={() => setSelectedJob(selectedJob === position.id ? null : position.id)}
                      h="full"
                    >
                      <CardHeader>
                        <Flex justify="space-between" align="flex-start">
                          <VStack align="flex-start" spacing={3} flex={1}>
                            <Icon as={position.icon} boxSize={8} color={`${position.color}.500`} />
                            <Heading size="md">{position.title}</Heading>
                            <HStack spacing={3}>
                              <Badge colorScheme={position.color}>{position.type}</Badge>
                              <HStack spacing={1} color="gray.600">
                                <Icon as={FiMapPin} boxSize={4} />
                                <Text fontSize="sm">{position.location}</Text>
                              </HStack>
                            </HStack>
                          </VStack>
                        </Flex>
                      </CardHeader>

                      <CardBody pt={0}>
                        <Text color="gray.600" mb={4}>{position.description}</Text>

                        {selectedJob === position.id && (
                          <VStack align="stretch" spacing={6} mt={6}>
                            <Divider />

                            <Box>
                              <Heading size="sm" mb={3}>Key Responsibilities</Heading>
                              <List spacing={2}>
                                {position.responsibilities.map((resp, idx) => (
                                  <ListItem key={idx} fontSize="sm">
                                    <ListIcon as={FiCheckCircle} color={`${position.color}.500`} />
                                    {resp}
                                  </ListItem>
                                ))}
                              </List>
                            </Box>

                            <Box>
                              <Heading size="sm" mb={3}>Qualifications</Heading>
                              <List spacing={2}>
                                {position.qualifications.map((qual, idx) => (
                                  <ListItem key={idx} fontSize="sm">
                                    <ListIcon as={FiCheckCircle} color={`${position.color}.500`} />
                                    {qual}
                                  </ListItem>
                                ))}
                              </List>
                            </Box>

                            <Box>
                              <Heading size="sm" mb={3}>What We Offer</Heading>
                              <List spacing={2}>
                                {position.benefits.map((benefit, idx) => (
                                  <ListItem key={idx} fontSize="sm">
                                    <ListIcon as={FiCheckCircle} color={`${position.color}.500`} />
                                    {benefit}
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          </VStack>
                        )}

                        <Button
                          size="sm"
                          variant="link"
                          colorScheme={position.color}
                          mt={4}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJob(selectedJob === position.id ? null : position.id);
                          }}
                        >
                          {selectedJob === position.id ? 'Show Less' : 'View Details'} →
                        </Button>
                      </CardBody>
                    </MotionCard>
                  </motion.div>
                ))}
              </SimpleGrid>
            </motion.div>
          </VStack>

          {/* How to Apply Section */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            mt={16}
            bg="blue.50"
            p={12}
            borderRadius="xl"
            textAlign="center"
          >
            <VStack spacing={6}>
              <Icon as={FiMail} boxSize={12} color="blue.500" />
              <Heading size="lg">How to Apply</Heading>
              <Text fontSize="lg" maxW="2xl">
                Ready to join our team? We'd love to hear from you! Please send your resume and a brief cover letter
                explaining why you're interested in joining StemPro Academy to:
              </Text>
              <Button
                size="lg"
                colorScheme="blue"
                leftIcon={<FiMail />}
                onClick={() => window.location.href = 'mailto:careers@stempro.org?subject=Application for [Position Title]'}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                transition="all 0.2s"
              >
                careers@stempro.org
              </Button>
              <Text fontSize="sm" color="gray.600">
                Please include the position title in your email subject line.
              </Text>
            </VStack>
          </MotionBox>

          {/* Equal Opportunity Statement */}
          <Box mt={12} textAlign="center">
            <Text fontSize="sm" color="gray.600" maxW="3xl" mx="auto">
              StemPro Academy is an equal opportunity employer committed to building a diverse and inclusive team.
              We welcome applications from candidates of all backgrounds and experiences.
            </Text>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}