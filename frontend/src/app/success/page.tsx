'use client';

import { Box, Container, Heading, Text, VStack, Tab, TabList, TabPanel, TabPanels, Tabs, Card, CardBody, List, ListItem, Icon, useColorModeValue, Stack, Avatar, Flex } from '@chakra-ui/react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { motion } from 'framer-motion';
import { FiAward, FiTrendingUp, FiBookOpen, FiTarget, FiBriefcase, FiMail, FiPhone } from 'react-icons/fi';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function SuccessPage() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const quoteBg = useColorModeValue('blue.50', 'blue.900');

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const successCategories = [
    {
      id: 'admission-success',
      title: '🏆 College Success',
      content: {
        description: 'Our students have secured admission to prestigious universities like MIT, Carnegie Mellon, and UC Berkeley by demonstrating advanced STEM and AI proficiencies. Personalized guidance and project-based learning prepare students to present their unique strengths, making them stand out in competitive admissions.',
        achievements: [
          'MIT - Multiple admissions with AI research portfolios',
          'Carnegie Mellon - Computer Science program acceptances',
          'UC Berkeley - Engineering and Data Science admits',
          'Stanford - AI and entrepreneurship focused applications',
          'Columbia - Interdisciplinary STEM programs'
        ]
      }
    },
    {
      id: 'competition-achievements',
      title: '🥇 Competitions & Innovation',
      content: {
        description: 'Students excel in prestigious competitions, showcasing technical prowess and innovative thinking that enhances their academic profiles.',
        achievements: [
          'Seattle Youth Entrepreneur Challenge - Award-winning innovations',
          'Conrad Challenge - Outstanding results for solving real-world problems',
          'Diamond Challenge - Top awards in premier entrepreneurship competition',
          'Science Olympiad - Multiple medals in technology events',
          'Hackathon Winners - First place in regional and national competitions'
        ]
      }
    },
    {
      id: 'academic-distinctions',
      title: '📜 Academic Distinctions',
      content: {
        description: 'Our commitment to excellence reflects in students\' remarkable achievements in mathematics and computer science.',
        achievements: [
          'International Math Olympiad (IMO) - Medals in mathematical problem-solving',
          'AIME Qualifiers - High achievements in American Invitational Mathematics Examination',
          'USACO Gold & Platinum - Top tier in USA Computing Olympiad',
          'AP Computer Science - Perfect scores and National AP Scholar awards',
          'National Merit Scholars - Multiple finalists and winners'
        ]
      }
    },
    {
      id: 'publications-research',
      title: '📚 Publications & Research',
      content: {
        description: 'Students publish in top conferences and journals, establishing strong academic credentials for their future.',
        achievements: [
          'MIT URTC - Research presentations at Undergraduate Research Technology Conference',
          'IEEE Publications - Papers on AI and neural networks in leading journals',
          'ACM Conferences - Student research in computer science',
          'Patent Applications - Innovative solutions in AI and technology',
          'Research Collaborations - Work with university professors and industry labs'
        ]
      }
    },
    {
      id: 'career-development',
      title: '💼 Career Development',
      content: {
        description: 'Strong industry connections provide practical experiences with leading tech companies.',
        achievements: [
          'Microsoft - Summer internships in AI and cloud computing',
          'Amazon - Machine learning and robotics projects',
          'Google - Software engineering and AI research positions',
          'Meta - Data science and product development roles',
          'Startup Success - Students launching their own tech ventures'
        ]
      }
    }
  ];

  const testimonials = [
    {
      quote: "Working with StemPro Academy has been an incredible journey! With their guidance, my research on autonomous driving was accepted to the MIT URTC—an internationally renowned conference showcasing groundbreaking work in technology and engineering. I couldn't have reached this milestone without their mentorship, which not only helped me build technical skills but also prepared me to present my research at such a prestigious level. I'm excited for the opportunity to present and share my work, and I'm truly grateful for the support every step of the way!",
      author: "Meadow",
      role: "High School Research Student, 2024",
      location: "U.S."
    },
    {
      quote: "We are so grateful for StemPro Academy! Both my daughter and son joined their programs, and now they are in their dream colleges! StemPro helped them join Conrad Challenges, the Entrepreneurship Challenge, and the College Ninja Series. The projects were very hands-on, and both kids learned so much. As a parent, I felt very supported and informed. I cannot thank the mentors and teachers enough for their guidance and care. Thank you, StemPro Academy!",
      author: "Lily",
      role: "Parent of StemPro Students (2021 & 2023)",
      location: "U.S."
    }
  ];

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />

      <Box flex="1" py={16}>
        <Container maxW="container.xl">
          {/* Hero Section */}
          <MotionBox {...fadeInUp} mb={12}>
            <VStack spacing={6} textAlign="center">
              <Heading as="h1" size="2xl">Student Achievements & Success</Heading>
              <Text fontSize="xl" color="gray.600" maxW="4xl">
                StemPro Academy students thrive with a project-based approach, earning top university admissions, global awards, and research success. Our programs empower students for academic and career achievement.
              </Text>
            </VStack>
          </MotionBox>

          {/* Success Categories Tabs */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            mb={16}
          >
            <Tabs variant="soft-rounded" colorScheme="blue" size="md">
              <TabList mb={8} justifyContent="center" flexWrap="wrap">
                {successCategories.map((category) => (
                  <Tab key={category.id} mx={1} mb={2} fontSize={{ base: 'sm', md: 'md' }}>
                    {category.title}
                  </Tab>
                ))}
              </TabList>

              <TabPanels>
                {successCategories.map((category) => (
                  <TabPanel key={category.id}>
                    <MotionCard
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      bg={cardBg}
                      borderWidth="1px"
                      borderColor={borderColor}
                      borderRadius="xl"
                      shadow="lg"
                      p={8}
                    >
                      <CardBody>
                        <Text fontSize="lg" mb={6} color="gray.600">
                          {category.content.description}
                        </Text>
                        <List spacing={3}>
                          {category.content.achievements.map((achievement, idx) => (
                            <ListItem key={idx} display="flex" alignItems="flex-start">
                              <Icon as={FiAward} color="blue.500" mt={1} mr={3} flexShrink={0} />
                              <Text>{achievement}</Text>
                            </ListItem>
                          ))}
                        </List>
                      </CardBody>
                    </MotionCard>
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </MotionBox>

          {/* Testimonials Section */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            mb={16}
          >
            <Heading size="xl" textAlign="center" mb={12}>Testimonials</Heading>

            <Stack spacing={8}>
              {testimonials.map((testimonial, idx) => (
                <MotionCard
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                  bg={quoteBg}
                  borderRadius="xl"
                  p={8}
                  position="relative"
                  overflow="hidden"
                  _before={{
                    content: '"""',
                    position: 'absolute',
                    top: '-20px',
                    left: '20px',
                    fontSize: '120px',
                    color: 'blue.200',
                    opacity: 0.3,
                    fontFamily: 'serif'
                  }}
                >
                  <CardBody>
                    <Text fontSize="lg" fontStyle="italic" mb={6} position="relative" zIndex={1}>
                      {testimonial.quote}
                    </Text>
                    <Flex align="center" justify="flex-end">
                      <Box textAlign="right">
                        <Text fontWeight="bold" fontSize="lg">{testimonial.author}</Text>
                        <Text color="gray.600">{testimonial.role}</Text>
                        <Text color="gray.500" fontSize="sm">{testimonial.location}</Text>
                      </Box>
                      <Avatar name={testimonial.author} ml={4} size="md" bg="blue.500" />
                    </Flex>
                  </CardBody>
                </MotionCard>
              ))}
            </Stack>
          </MotionBox>

          {/* Contact Section */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            textAlign="center"
            bg="gray.50"
            p={12}
            borderRadius="xl"
          >
            <Heading size="lg" mb={6}>Contact Us</Heading>
            <Text fontSize="lg" mb={8}>
              We'd love to hear from you! For inquiries or more information, reach out to us:
            </Text>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4} justify="center" align="center">
              <Box display="flex" alignItems="center">
                <Icon as={FiMail} mr={2} color="blue.500" />
                <a href="mailto:info@stempro.org" style={{ color: 'inherit', textDecoration: 'none' }}>
                  <Text fontWeight="semibold">info@stempro.org</Text>
                </a>
              </Box>
              <Box display="flex" alignItems="center">
                <Icon as={FiPhone} mr={2} color="blue.500" />
                <a href="tel:425-230-0688" style={{ color: 'inherit', textDecoration: 'none' }}>
                  <Text fontWeight="semibold">425-230-0688</Text>
                </a>
              </Box>
            </Stack>
          </MotionBox>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}