// frontend/src/app/success-stories/page.tsx
'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
  Flex,
  Icon,
  Stack,
} from '@chakra-ui/react';
import { FiAward, FiBookOpen, FiUsers, FiBriefcase, FiTrendingUp } from 'react-icons/fi';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

export default function SuccessStoriesPage() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const quoteBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />

      <Container maxW="container.xl" py={12} flex="1">
        <VStack spacing={12}>
          <Box textAlign="center">
            <Heading size="2xl" mb={4}>
              Student Achievements & Success
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="3xl" mx="auto">
              StemPro Academy students thrive with a project-based approach, earning top university
              admissions, global awards, and research success.
            </Text>
          </Box>

          <Tabs w="full" colorScheme="brand">
            <TabList flexWrap="wrap">
              <Tab>College Success</Tab>
              <Tab>Competitions</Tab>
              <Tab>Academic Distinctions</Tab>
              <Tab>Publications</Tab>
              <Tab>Career Development</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <VStack spacing={6} align="start">
                  <Flex align="center" gap={3}>
                    <Icon as={FiAward} boxSize={8} color="brand.500" />
                    <Heading size="lg">College Admission Success Stories</Heading>
                  </Flex>
                  <Text fontSize="lg">
                    Our students have secured admission to prestigious universities like MIT,
                    Carnegie Mellon, and UC Berkeley by demonstrating advanced STEM and AI proficiencies.
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                    <Card bg={cardBg}>
                      <CardBody>
                        <Text fontWeight="bold" mb={2}>Top University Admissions</Text>
                        <List spacing={1}>
                          <ListItem>• MIT - 12 students</ListItem>
                          <ListItem>• Stanford - 8 students</ListItem>
                          <ListItem>• UC Berkeley - 15 students</ListItem>
                          <ListItem>• Carnegie Mellon - 10 students</ListItem>
                        </List>
                      </CardBody>
                    </Card>
                    <Card bg={cardBg}>
                      <CardBody>
                        <Text fontWeight="bold" mb={2}>Success Rate</Text>
                        <Text>95% of our students get into their top 3 college choices</Text>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                </VStack>
              </TabPanel>

              <TabPanel>
                <VStack spacing={6} align="start">
                  <Flex align="center" gap={3}>
                    <Icon as={FiTrendingUp} boxSize={8} color="brand.500" />
                    <Heading size="lg">Competitions and Innovation</Heading>
                  </Flex>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
                    <Card bg={cardBg}>
                      <CardBody>
                        <Heading size="md" mb={3}>Seattle Youth Entrepreneur</Heading>
                        <Text>Award-winning innovations showcasing technical and business acumen</Text>
                      </CardBody>
                    </Card>
                    <Card bg={cardBg}>
                      <CardBody>
                        <Heading size="md" mb={3}>Conrad Challenge</Heading>
                        <Text>Outstanding results for solving real-world interdisciplinary problems</Text>
                      </CardBody>
                    </Card>
                    <Card bg={cardBg}>
                      <CardBody>
                        <Heading size="md" mb={3}>Diamond Challenge</Heading>
                        <Text>Top awards in premier high school entrepreneurship competition</Text>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                </VStack>
              </TabPanel>

              <TabPanel>
                <VStack spacing={6} align="start">
                  <Flex align="center" gap={3}>
                    <Icon as={FiBookOpen} boxSize={8} color="brand.500" />
                    <Heading size="lg">Academic and Technical Distinctions</Heading>
                  </Flex>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
                    <Card bg={cardBg}>
                      <CardBody>
                        <Heading size="md" mb={3}>Math Olympiad (IMO)</Heading>
                        <Text>Multiple medals showcasing excellence in mathematical problem-solving</Text>
                      </CardBody>
                    </Card>
                    <Card bg={cardBg}>
                      <CardBody>
                        <Heading size="md" mb={3}>AIME Qualifiers</Heading>
                        <Text>High achievements in American Invitational Mathematics Examination</Text>
                      </CardBody>
                    </Card>
                    <Card bg={cardBg}>
                      <CardBody>
                        <Heading size="md" mb={3}>USACO Gold & Platinum</Heading>
                        <Text>Remarkable results in USA Computing Olympiad</Text>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                </VStack>
              </TabPanel>

              <TabPanel>
                <VStack spacing={6} align="start">
                  <Flex align="center" gap={3}>
                    <Icon as={FiUsers} boxSize={8} color="brand.500" />
                    <Heading size="lg">Academic Publications and Research</Heading>
                  </Flex>
                  <Text fontSize="lg">
                    Students publish in top conferences and journals, enhancing their academic credentials:
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                    <Card bg={cardBg}>
                      <CardBody>
                        <Heading size="md" mb={3}>MIT URTC</Heading>
                        <Text>High-quality research presented at MIT's Undergraduate Research Technology Conference</Text>
                      </CardBody>
                    </Card>
                    <Card bg={cardBg}>
                      <CardBody>
                        <Heading size="md" mb={3}>IEEE Publications</Heading>
                        <Text>Papers on AI, neural networks, and cutting-edge topics in leading journals</Text>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                </VStack>
              </TabPanel>

              <TabPanel>
                <VStack spacing={6} align="start">
                  <Flex align="center" gap={3}>
                    <Icon as={FiBriefcase} boxSize={8} color="brand.500" />
                    <Heading size="lg">Internships and Career Development</Heading>
                  </Flex>
                  <Text fontSize="lg">
                    Strong industry ties offer practical experiences with tech leaders:
                  </Text>
                  <Card bg={cardBg}>
                    <CardBody>
                      <List spacing={2}>
                        <ListItem>• Microsoft - Software Engineering Internships</ListItem>
                        <ListItem>• Amazon - Machine Learning Research</ListItem>
                        <ListItem>• Google - AI/ML Summer Programs</ListItem>
                        <ListItem>• Meta - Data Science Internships</ListItem>
                      </List>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Box w="full" mt={12}>
            <Heading size="lg" mb={6} textAlign="center">
              Testimonials
            </Heading>
            <Stack spacing={6}>
              <Card bg={quoteBg}>
                <CardBody>
                  <Text fontSize="lg" fontStyle="italic" mb={4}>
                    "Working with StemPro Academy has been an incredible journey! With their guidance,
                    my research on autonomous driving was accepted to the MIT URTC—an internationally
                    renowned conference. I couldn't have reached this milestone without their mentorship."
                  </Text>
                  <Text fontWeight="bold">— Meadow, U.S., High School Research Student, 2024</Text>
                </CardBody>
              </Card>

              <Card bg={quoteBg}>
                <CardBody>
                  <Text fontSize="lg" fontStyle="italic" mb={4}>
                    "We are so grateful for StemPro Academy! Both my daughter and son joined their programs,
                    and now they are in their dream colleges! The projects were very hands-on, and both kids
                    learned so much. Thank you, StemPro Academy!"
                  </Text>
                  <Text fontWeight="bold">— Lily, U.S. Parent of StemPro Students (2021 & 2023)</Text>
                </CardBody>
              </Card>
            </Stack>
          </Box>
        </VStack>
      </Container>

      <Footer />
    </Box>
  );
}

// frontend/src/app/about/page.tsx
'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  Stack,
  List,
  ListItem,
  Button,
  useColorModeValue,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FiTarget, FiUsers, FiAward, FiMail, FiPhone } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

export default function AboutPage() {
  const router = useRouter();
  const cardBg = useColorModeValue('white', 'gray.800');
  const sectionBg = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />

      <Container maxW="container.xl" py={12} flex="1">
        <VStack spacing={12}>
          <Box textAlign="center">
            <Heading size="2xl" mb={4}>
              About StemPro Academy
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="3xl" mx="auto">
              A nonprofit organization founded by engineering professionals to advance STEM education
              through real-world, project-based learning.
            </Text>
          </Box>

          <Stack spacing={8} w="full">
            <Card bg={cardBg}>
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Heading size="lg">Our Story</Heading>
                  <Text fontSize="lg">
                    StemPro Academy bridges students to tech careers, equipping them with hands-on skills
                    in AI, programming, and data science. We offer programs for all levels, from Python
                    basics for middle schoolers to advanced AI for high schoolers and career starters.
                  </Text>
                  <Text fontSize="lg">
                    Our signature CollegeNinja: Code-to-Campus Program combines college application guidance
                    with AI and programming skills, giving students a competitive edge in admissions.
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="brand.600">
                    "Stay Updated, Learn Fresh, Teach the Latest"
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Box bg={sectionBg} p={8} rounded="lg">
              <VStack spacing={6}>
                <Flex align="center" gap={3}>
                  <Icon as={FiTarget} boxSize={8} color="brand.500" />
                  <Heading size="lg">Our Mission</Heading>
                </Flex>
                <Text fontSize="lg" textAlign="center">
                  StemPro Academy empowers students to excel in STEM, with a focus on AI and programming.
                  Through hands-on, project-based learning, we provide resources and guidance for real-world
                  success, supporting students and parents in building skills for both academic and career achievements.
                </Text>
              </VStack>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              <Card bg={cardBg}>
                <CardBody textAlign="center">
                  <Icon as={FiUsers} boxSize={12} color="brand.500" mb={4} />
                  <Heading size="md" mb={2}>Principal</Heading>
                  <Text>
                    Leading with commitment to STEM education and advancing AI skills
                  </Text>
                </CardBody>
              </Card>

              <Card bg={cardBg}>
                <CardBody textAlign="center">
                  <Icon as={FiAward} boxSize={12} color="brand.500" mb={4} />
                  <Heading size="md" mb={2}>Mentors</Heading>
                  <Text>
                    Industry professionals from leading tech organizations
                  </Text>
                </CardBody>
              </Card>

              <Card bg={cardBg}>
                <CardBody textAlign="center">
                  <Icon as={FiUsers} boxSize={12} color="brand.500" mb={4} />
                  <Heading size="md" mb={2}>Teachers</Heading>
                  <Text>
                    Dedicated educators with robust STEM backgrounds
                  </Text>
                </CardBody>
              </Card>

              <Card bg={cardBg}>
                <CardBody textAlign="center">
                  <Icon as={FiUsers} boxSize={12} color="brand.500" mb={4} />
                  <Heading size="md" mb={2}>Guest Speakers</Heading>
                  <Text>
                    Alumni, industry leaders, and admissions experts
                  </Text>
                </CardBody>
              </Card>
            </SimpleGrid>

            <Card bg={cardBg}>
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Heading size="lg">Join Our Team</Heading>
                  <Text fontSize="lg">
                    We are always looking for passionate individuals to join our collaborative journey.
                    Whether you're an educator, industry professional, or someone passionate about STEM
                    education, we'd love to hear from you.
                  </Text>
                  <Button
                    colorScheme="brand"
                    onClick={() => router.push('/join-us')}
                  >
                    Learn More
                  </Button>
                </VStack>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Heading size="lg">Contact Us</Heading>
                  <Text fontSize="lg">
                    We'd love to hear from you! For inquiries or more information, reach out to us:
                  </Text>
                  <List spacing={3}>
                    <ListItem>
                      <Flex align="center" gap={2}>
                        <Icon as={FiMail} />
                        <Text>Email: info@stempro.org</Text>
                      </Flex>
                    </ListItem>
                    <ListItem>
                      <Flex align="center" gap={2}>
                        <Icon as={FiPhone} />
                        <Text>Phone: 425-230-0688</Text>
                      </Flex>
                    </ListItem>
                  </List>
                </VStack>
              </CardBody>
            </Card>
          </Stack>
        </VStack>
      </Container>

      <Footer />
    </Box>
  );
}

// frontend/src/app/dashboard/page.tsx
'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Button,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { useAuthStore } from '@/store/authStore';
import { enrollmentsApi, schedulesApi } from '@/services/api';
import { Enrollment, Schedule } from '@/types';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [enrollmentsRes, schedulesRes] = await Promise.all([
          enrollmentsApi.getMy(),
          schedulesApi.getMy(),
        ]);
        setEnrollments(enrollmentsRes.data);
        setSchedules(schedulesRes.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'confirmed':
      case 'scheduled':
        return 'blue';
      case 'completed':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />

      <Container maxW="container.xl" py={12} flex="1">
        <VStack spacing={8} align="start">
          <Box>
            <Heading size="xl" mb={2}>
              Welcome back, {user.name}!
            </Heading>
            <Text color="gray.600">
              Manage your enrollments and consultations from your dashboard.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
            <Card bg={cardBg}>
              <CardBody>
                <VStack align="start">
                  <Text fontWeight="bold" color="gray.500">Total Enrollments</Text>
                  <Heading size="lg">{enrollments.length}</Heading>
                </VStack>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody>
                <VStack align="start">
                  <Text fontWeight="bold" color="gray.500">Active Courses</Text>
                  <Heading size="lg">
                    {enrollments.filter(e => e.status === 'confirmed').length}
                  </Heading>
                </VStack>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody>
                <VStack align="start">
                  <Text fontWeight="bold" color="gray.500">Consultations</Text>
                  <Heading size="lg">{schedules.length}</Heading>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          <Tabs w="full" colorScheme="brand">
            <TabList>
              <Tab>My Enrollments</Tab>
              <Tab>My Consultations</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                {enrollments.length === 0 ? (
                  <Card bg={cardBg}>
                    <CardBody textAlign="center" py={8}>
                      <Text mb={4}>You haven't enrolled in any courses yet.</Text>
                      <Button colorScheme="brand" onClick={() => router.push('/courses')}>
                        Browse Courses
                      </Button>
                    </CardBody>
                  </Card>
                ) : (
                  <Box overflowX="auto">
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Course</Th>
                          <Th>Enrolled Date</Th>
                          <Th>Status</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {enrollments.map((enrollment) => (
                          <Tr key={enrollment.id}>
                            <Td>{enrollment.course}</Td>
                            <Td>{formatDate(enrollment.created_at)}</Td>
                            <Td>
                              <Badge colorScheme={getStatusColor(enrollment.status)}>
                                {enrollment.status}
                              </Badge>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                )}
              </TabPanel>

              <TabPanel>
                {schedules.length === 0 ? (
                  <Card bg={cardBg}>
                    <CardBody textAlign="center" py={8}>
                      <Text mb={4}>You haven't scheduled any consultations yet.</Text>
                      <Button colorScheme="brand" onClick={() => router.push('/schedule')}>
                        Schedule Consultation
                      </Button>
                    </CardBody>
                  </Card>
                ) : (
                  <Box overflowX="auto">
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Request Date</Th>
                          <Th>Status</Th>
                          <Th>Scheduled For</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {schedules.map((schedule) => (
                          <Tr key={schedule.id}>
                            <Td>{formatDate(schedule.created_at)}</Td>
                            <Td>
                              <Badge colorScheme={getStatusColor(schedule.status)}>
                                {schedule.status}
                              </Badge>
                            </Td>
                            <Td>
                              {schedule.scheduled_date
                                ? formatDate(schedule.scheduled_date)
                                : 'Pending'}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>

          <HStack spacing={4}>
            <Button onClick={() => router.push('/profile')}>
              Edit Profile
            </Button>
            {user.is_admin && (
              <Button colorScheme="purple" onClick={() => router.push('/admin')}>
                Admin Panel
              </Button>
            )}
          </HStack>
        </VStack>
      </Container>

      <Footer />
    </Box>
  );
}

// frontend/src/app/thank-you/page.tsx
'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Icon,
} from '@chakra-ui/react';
import { FiCheckCircle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

export default function ThankYouPage() {
  const router = useRouter();

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />

      <Container maxW="container.md" py={20} flex="1">
        <VStack spacing={8} textAlign="center">
          <Icon as={FiCheckCircle} boxSize={20} color="green.500" />

          <Heading size="2xl">Thank You!</Heading>

          <Text fontSize="xl" color="gray.600">
            We have received your submission and will get in touch with you soon.
          </Text>

          <Text>
            Our team typically responds within 24-48 hours. Meanwhile, feel free to
            explore our programs and success stories.
          </Text>

          <VStack spacing={4}>
            <Button
              colorScheme="brand"
              size="lg"
              onClick={() => router.push('/')}
            >
              Go Back to Home
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/success-stories')}
            >
              View Success Stories
            </Button>
          </VStack>
        </VStack>
      </Container>

      <Footer />
    </Box>
  );
}