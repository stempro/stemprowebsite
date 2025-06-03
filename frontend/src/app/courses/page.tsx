'use client';

import { Box, Container, Heading, Text, SimpleGrid, Card, CardBody, CardHeader, Button, Badge, Stack, useColorModeValue } from '@chakra-ui/react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const MotionCard = motion(Card);

const courses = [
  {
    id: 'junior-ai',
    name: 'Junior AI Program',
    description: 'AI and Programming In Action - For Middle & High School Students',
    duration: '6 weeks (12 lesson hours)',
    level: 'Beginner',
    age: '12-15 years',
    color: 'blue'
  },
  {
    id: 'generative-ai',
    name: 'Generative AI Program',
    description: 'Generative AI Education for Middle Graders',
    duration: '6 weeks (12 lesson hours)',
    level: 'Intermediate',
    age: '13-16 years',
    color: 'purple'
  },
  {
    id: 'advanced-ai',
    name: 'Advanced Generative AI Program',
    description: 'Advanced Generative AI Education for High School Students',
    duration: '8 weeks (16 lesson hours)',
    level: 'Advanced',
    age: '16-18 years',
    color: 'green'
  }
];

export default function CoursesPage() {
  const router = useRouter();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />

      <Box flex="1" py={16}>
        <Container maxW="container.xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading as="h1" size="2xl" textAlign="center" mb={4}>
              Our Courses
            </Heading>
            <Text fontSize="xl" textAlign="center" color="gray.600" mb={12}>
              Choose the perfect AI program for your learning journey
            </Text>
          </motion.div>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {courses.map((course, index) => (
              <MotionCard
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="lg"
                overflow="hidden"
                position="relative"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  bg: `${course.color}.500`,
                }}
              >
                <CardHeader>
                  <Stack direction="row" justify="space-between" align="center" mb={2}>
                    <Badge colorScheme={course.color} px={2} py={1} borderRadius="md">
                      {course.level}
                    </Badge>
                    <Text fontSize="sm" color="gray.500">
                      {course.age}
                    </Text>
                  </Stack>
                  <Heading size="md">{course.name}</Heading>
                </CardHeader>
                <CardBody>
                  <Stack spacing={4}>
                    <Text color="gray.600">{course.description}</Text>
                    <Text fontWeight="semibold" color="gray.700">
                      Duration: {course.duration}
                    </Text>
                    <Button
                      colorScheme={course.color}
                      size="md"
                      onClick={() => router.push(`/enroll?course=${course.id}`)}
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg',
                      }}
                      transition="all 0.2s"
                    >
                      Enroll Now
                    </Button>
                  </Stack>
                </CardBody>
              </MotionCard>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}