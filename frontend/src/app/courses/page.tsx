'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Button,
  Badge,
  Stack,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  UnorderedList,
  ListItem,
  HStack,
  Icon,
  Divider
} from '@chakra-ui/react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiCalendar, FiUsers, FiTarget, FiCheckCircle, FiUser } from 'react-icons/fi';
import { useState } from 'react';

const MotionCard = motion(Card);

const courses = [
  {
    id: 'junior-ai',
    name: 'Junior AI Program',
    description: 'AI and Programming In Action - For Middle & High School Students',
    duration: '6 weeks (12 lesson hours)',
    level: 'Beginner',
    age: 'Age 12-15 years',
    color: 'blue',
    startDate: 'Sept 2025',
    classSize: 12,
    suitableFor: 'Beginners with no coding experience, curious minds who love technology, students who enjoy solving puzzles and creating things',
    objectives: 'By the end of this course, students will be able to write Python programs, build simple AI applications, understand how AI works in everyday life, and create their own AI-powered projects',
    prerequisites: 'Basic computer skills, Grade 6+ math, enthusiasm to learn',
    inspirationalQuote: '"The future belongs to those who understand AI today"',
    curriculum: [
      'Introduction to AI & Python basics: Learn what AI is through fun examples and write your first Python programs',
      'Building chatbots with natural language: Create a simple chatbot that can answer questions about your favorite topics',
      'Computer vision basics: Make programs that can recognize faces, objects, and hand gestures using OpenCV',
      'AI in games: Design and code simple AI opponents for games like Tic-Tac-Toe and Rock-Paper-Scissors',
      'Machine learning fundamentals: Train your first ML model to predict patterns using Scikit-learn',
      'Final project: Build an AI-powered app combining chatbot, vision, or game AI to solve a real problem'
    ]
  },
  {
    id: 'generative-ai',
    name: 'Generative AI Program',
    description: 'Generative AI Education for Middle Graders',
    duration: '6 weeks (12 lesson hours)',
    level: 'Intermediate',
    age: 'Age 13-16 years',
    color: 'purple',
    startDate: 'Sept 2025',
    classSize: 8,
    suitableFor: 'Students interested in creative AI applications, young artists and writers exploring AI tools, those with basic programming knowledge wanting to level up',
    objectives: 'By the end of this course, students will be able to master prompt engineering techniques, build applications using AI APIs, create AI-generated art and content, and understand ethical AI development',
    prerequisites: 'Basic Python knowledge, Grade 7+ math, familiarity with computers',
    inspirationalQuote: '"Creativity meets intelligence in the age of generative AI"',
    curriculum: [
      'Understanding generative AI: Explore ChatGPT, DALL-E, and how AI creates text, images, and music',
      'Prompt engineering mastery: Learn to write effective prompts for AI tools to get amazing results',
      'Building with AI APIs: Connect to OpenAI and Hugging Face APIs using Python to create custom applications',
      'AI art and creativity: Generate artwork, stories, and music using tools like Stable Diffusion and MuseNet',
      'Ethical AI and safety: Understand AI biases, deepfakes, and responsible AI development practices',
      'Capstone project: Develop a creative AI application like a story generator, art creator, or study assistant'
    ]
  },
  {
    id: 'advanced-ai',
    name: 'Advanced Generative AI Program',
    description: 'Advanced Generative AI Education for High School Students',
    duration: '8 weeks (16 lesson hours)',
    level: 'Advanced',
    age: 'Ages 16 and up',
    color: 'green',
    startDate: 'Sept 2025',
    classSize: 6,
    suitableFor: 'Students with programming experience, future AI engineers and researchers, those preparing for college-level computer science',
    objectives: 'By the end of this course, students will be able to implement neural networks from scratch, fine-tune and deploy LLMs, build production-ready AI applications, and understand cutting-edge AI research',
    prerequisites: 'Intermediate Python skills, Algebra II or higher, basic understanding of AI concepts',
    inspirationalQuote: '"Today\'s students, tomorrow\'s AI innovators"',
    curriculum: [
      'Deep learning foundations: Neural networks, transformers, and attention mechanisms using PyTorch/TensorFlow',
      'Large Language Models (LLMs): Fine-tune GPT models and build custom chatbots with LangChain',
      'Diffusion models deep dive: Understand and implement image generation with Stable Diffusion',
      'RAG systems: Build retrieval-augmented generation apps combining databases with LLMs',
      'Multi-modal AI: Create applications that work with text, images, and audio using CLIP and Whisper',
      'Advanced prompt engineering: Chain-of-thought, few-shot learning, and prompt optimization techniques',
      'AI agents and automation: Design autonomous AI agents using AutoGPT and LangChain agents',
      'Industry project: Build a production-ready AI application with proper deployment and scaling'
    ]
  }
];

export default function CoursesPage() {
  const router = useRouter();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const quoteBg = useColorModeValue('gray.50', 'gray.700');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);

  const handleViewCurriculum = (course: typeof courses[0]) => {
    setSelectedCourse(course);
    onOpen();
  };

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
                height="100%"
                display="flex"
                flexDirection="column"
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
                <CardHeader pb={2}>
                  <Stack direction="row" justify="space-between" align="center" mb={2}>
                    <Badge colorScheme={course.color} px={2} py={1} borderRadius="md">
                      {course.level}
                    </Badge>
                    <Text fontSize="sm" color="gray.500">
                      {course.age}
                    </Text>
                  </Stack>
                  <Heading size="md" mb={2}>{course.name}</Heading>

                  <HStack spacing={3} mb={2}>
                    <Badge
                      colorScheme="orange"
                      px={2}
                      py={1}
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      gap={1}
                      fontSize="xs"
                    >
                      <Icon as={FiCalendar} boxSize={3} />
                      {course.startDate}
                    </Badge>
                    <Badge
                      colorScheme="teal"
                      px={2}
                      py={1}
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      gap={1}
                      fontSize="xs"
                    >
                      <Icon as={FiUsers} boxSize={3} />
                      Class: {course.classSize}
                    </Badge>
                  </HStack>

                  <Box
                    bg={quoteBg}
                    p={3}
                    borderRadius="md"
                    mt={2}
                    position="relative"
                  >
                    <Text
                      fontSize="sm"
                      fontStyle="italic"
                      color={useColorModeValue('gray.700', 'gray.300')}
                      textAlign="center"
                    >
                      {course.inspirationalQuote}
                    </Text>
                  </Box>
                </CardHeader>

                <CardBody flex="1" display="flex" flexDirection="column" pt={2}>
                  <Stack spacing={3} flex="1" fontSize="sm">
                    <Text color="gray.600">{course.description}</Text>

                    <Box>
                      <HStack mb={1}>
                        <Icon as={FiUser} color={`${course.color}.500`} boxSize={4} />
                        <Text fontWeight="semibold" fontSize="sm">Suitable for:</Text>
                      </HStack>
                      <Text color="gray.600" fontSize="xs" pl={5}>
                        {course.suitableFor}
                      </Text>
                    </Box>

                    <Box>
                      <HStack mb={1}>
                        <Icon as={FiTarget} color={`${course.color}.500`} boxSize={4} />
                        <Text fontWeight="semibold" fontSize="sm">Objectives:</Text>
                      </HStack>
                      <Text color="gray.600" fontSize="xs" pl={5}>
                        {course.objectives}
                      </Text>
                    </Box>

                    <Box>
                      <HStack mb={1}>
                        <Icon as={FiCheckCircle} color={`${course.color}.500`} boxSize={4} />
                        <Text fontWeight="semibold" fontSize="sm">Prerequisites:</Text>
                      </HStack>
                      <Text color="gray.600" fontSize="xs" pl={5}>
                        {course.prerequisites}
                      </Text>
                    </Box>

                    <Divider my={2} />

                    <Text fontWeight="semibold" color="gray.700" fontSize="sm">
                      Duration: {course.duration}
                    </Text>

                    <Box flex="1" />

                    <Stack spacing={2}>
                      <Button
                        variant="outline"
                        colorScheme={course.color}
                        size="sm"
                        onClick={() => handleViewCurriculum(course)}
                      >
                        View Full Curriculum
                      </Button>
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
                  </Stack>
                </CardBody>
              </MotionCard>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      <Footer />

      {/* Curriculum Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Stack spacing={1}>
              <Heading size="md">{selectedCourse.name} Curriculum</Heading>
              <HStack spacing={4}>
                <Badge colorScheme={selectedCourse.color}>{selectedCourse.level}</Badge>
                <Text fontSize="sm" color="gray.600">{selectedCourse.duration}</Text>
              </HStack>
            </Stack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Text fontWeight="semibold" color="gray.700">
                What you'll learn:
              </Text>
              <UnorderedList spacing={3} pl={4}>
                {selectedCourse.curriculum.map((item, index) => (
                  <ListItem key={index} color="gray.700">
                    {item}
                  </ListItem>
                ))}
              </UnorderedList>
              <Box mt={4} p={4} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="md">
                <Text fontSize="sm" fontWeight="semibold">
                  Ready to start your AI journey?
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  Limited spots available - {selectedCourse.classSize} students per class
                </Text>
              </Box>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme={selectedCourse.color}
              onClick={() => {
                router.push(`/enroll?course=${selectedCourse.id}`);
                onClose();
              }}
            >
              Enroll Now
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}