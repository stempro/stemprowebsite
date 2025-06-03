'use client';

import { Box, Container, Heading, Text, VStack, SimpleGrid, Card, CardBody, CardHeader, Button, Stat, StatLabel, StatNumber, StatHelpText, Icon, useColorModeValue, HStack, Badge } from '@chakra-ui/react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { motion } from 'framer-motion';
import { FiBook, FiCalendar, FiClock, FiAward, FiFileText, FiTrendingUp } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const MotionCard = motion(Card);

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Student');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
    }
    // In a real app, you would fetch user data here
  }, [router]);

  const stats = [
    {
      icon: FiBook,
      label: 'Courses Enrolled',
      value: '3',
      helpText: 'Active courses',
      color: 'blue'
    },
    {
      icon: FiClock,
      label: 'Hours Completed',
      value: '48',
      helpText: 'This month',
      color: 'green'
    },
    {
      icon: FiAward,
      label: 'Certificates',
      value: '2',
      helpText: 'Earned',
      color: 'purple'
    },
    {
      icon: FiTrendingUp,
      label: 'Progress',
      value: '85%',
      helpText: 'Overall completion',
      color: 'orange'
    }
  ];

  const enrolledCourses = [
    {
      title: 'Junior AI Program',
      progress: 75,
      nextClass: 'Tomorrow, 4:00 PM',
      status: 'active'
    },
    {
      title: 'CollegeNinja: Code-to-Campus',
      progress: 60,
      nextClass: 'Friday, 5:00 PM',
      status: 'active'
    },
    {
      title: 'Python Basics',
      progress: 100,
      nextClass: 'Completed',
      status: 'completed'
    }
  ];

  const upcomingSchedules = [
    {
      type: 'Class',
      title: 'AI Model Building',
      date: 'Tomorrow',
      time: '4:00 PM - 5:30 PM'
    },
    {
      type: 'Consultation',
      title: 'College Planning Session',
      date: 'Thursday',
      time: '3:00 PM - 3:45 PM'
    }
  ];

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />

      <Box flex="1" py={8} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.xl">
          {/* Welcome Section */}
          <VStack align="stretch" spacing={8}>
            <Box>
              <Heading size="lg" mb={2}>Welcome back, {userName}!</Heading>
              <Text color="gray.600">Here's your learning progress and upcoming activities.</Text>
            </Box>

            {/* Stats Grid */}
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
              {stats.map((stat, index) => (
                <MotionCard
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <CardBody>
                    <Stat>
                      <HStack mb={2}>
                        <Icon as={stat.icon} color={`${stat.color}.500`} boxSize={6} />
                        <StatLabel>{stat.label}</StatLabel>
                      </HStack>
                      <StatNumber fontSize="3xl">{stat.value}</StatNumber>
                      <StatHelpText>{stat.helpText}</StatHelpText>
                    </Stat>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>

            {/* Main Content Grid */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
              {/* Enrolled Courses */}
              <MotionCard
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
              >
                <CardHeader>
                  <HStack justify="space-between">
                    <Heading size="md">My Courses</Heading>
                    <Button size="sm" variant="ghost" onClick={() => router.push('/courses')}>
                      View All
                    </Button>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack align="stretch" spacing={4}>
                    {enrolledCourses.map((course, index) => (
                      <Box key={index} p={4} borderWidth="1px" borderRadius="md" borderColor={borderColor}>
                        <HStack justify="space-between" mb={2}>
                          <Text fontWeight="semibold">{course.title}</Text>
                          <Badge colorScheme={course.status === 'active' ? 'green' : 'gray'}>
                            {course.status}
                          </Badge>
                        </HStack>
                        <Box mb={2}>
                          <HStack justify="space-between" mb={1}>
                            <Text fontSize="sm" color="gray.600">Progress</Text>
                            <Text fontSize="sm" fontWeight="bold">{course.progress}%</Text>
                          </HStack>
                          <Box bg="gray.200" h="2" borderRadius="full">
                            <Box
                              bg={course.progress === 100 ? 'green.500' : 'blue.500'}
                              h="2"
                              borderRadius="full"
                              w={`${course.progress}%`}
                            />
                          </Box>
                        </Box>
                        <Text fontSize="sm" color="gray.600">
                          <Icon as={FiCalendar} mr={1} />
                          Next: {course.nextClass}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </CardBody>
              </MotionCard>

              {/* Upcoming Schedule */}
              <MotionCard
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
              >
                <CardHeader>
                  <HStack justify="space-between">
                    <Heading size="md">Upcoming Schedule</Heading>
                    <Button size="sm" variant="ghost" onClick={() => router.push('/schedule')}>
                      Schedule More
                    </Button>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack align="stretch" spacing={4}>
                    {upcomingSchedules.map((schedule, index) => (
                      <Box key={index} p={4} borderWidth="1px" borderRadius="md" borderColor={borderColor}>
                        <HStack justify="space-between" mb={2}>
                          <Badge colorScheme="purple">{schedule.type}</Badge>
                          <Text fontSize="sm" color="gray.600">{schedule.date}</Text>
                        </HStack>
                        <Text fontWeight="semibold" mb={1}>{schedule.title}</Text>
                        <Text fontSize="sm" color="gray.600">
                          <Icon as={FiClock} mr={1} />
                          {schedule.time}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </CardBody>
              </MotionCard>
            </SimpleGrid>

            {/* Quick Actions */}
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">Quick Actions</Heading>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
                  <Button
                    leftIcon={<FiBook />}
                    onClick={() => router.push('/courses')}
                    variant="outline"
                    colorScheme="blue"
                  >
                    Browse Courses
                  </Button>
                  <Button
                    leftIcon={<FiCalendar />}
                    onClick={() => router.push('/schedule')}
                    variant="outline"
                    colorScheme="green"
                  >
                    Schedule Consultation
                  </Button>
                  <Button
                    leftIcon={<FiFileText />}
                    onClick={() => router.push('/resources')}
                    variant="outline"
                    colorScheme="purple"
                  >
                    View Resources
                  </Button>
                  <Button
                    leftIcon={<FiAward />}
                    onClick={() => router.push('/success')}
                    variant="outline"
                    colorScheme="orange"
                  >
                    Success Stories
                  </Button>
                </SimpleGrid>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}