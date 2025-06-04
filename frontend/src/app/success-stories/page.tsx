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

// frontend/src/app/thank-you/page.tsx
