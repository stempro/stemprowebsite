'use client';

import { Box, Container, Heading, Text, VStack, Card, CardBody, CardHeader, SimpleGrid, Icon, List, ListItem, Button, useColorModeValue } from '@chakra-ui/react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { motion } from 'framer-motion';
import { FiUsers, FiBookOpen, FiMail, FiPhone, FiCheckCircle } from 'react-icons/fi';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function JoinUsPage() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const highlightBg = useColorModeValue('blue.50', 'blue.900');

  const opportunities = [
    {
      icon: FiUsers,
      title: '👥 Board Members',
      role: 'Board Member',
      description: 'We are seeking board members who are committed to our mission of empowering the next generation through STEM education. As a board member, you will provide strategic direction, support program development, and assist with fundraising efforts to help StemPro Academy grow and impact more students.',
      responsibilities: [
        'Advise on the strategic direction and vision of StemPro Academy',
        'Help build partnerships and networks within the STEM community',
        'Support fundraising and community engagement initiatives',
        'Attend quarterly board meetings (virtual participation available)'
      ],
      requirements: [
        'Passion for STEM education and community building',
        'Experience in education, business, or nonprofit organizations (preferred)',
        'Willingness to commit time and resources for StemPro Academy\'s growth'
      ],
      color: 'purple'
    },
    {
      icon: FiBookOpen,
      title: '👩‍🏫 Teachers with Industry Experience',
      role: 'STEM Instructor',
      description: 'We are looking for teachers who have hands-on industry experience in AI, programming, engineering, and other STEM fields. Join us to bring real-world knowledge and inspire students through project-based learning in a dynamic educational environment.',
      responsibilities: [
        'Design and deliver engaging project-based lessons to students',
        'Share industry insights and practical applications to enrich the curriculum',
        'Mentor and guide students in their projects and skills development',
        'Collaborate with our team to enhance course content and resources'
      ],
      requirements: [
        'Industry experience in a relevant STEM field (AI, programming, engineering, etc.)',
        'Passion for teaching and making a difference in students\' lives',
        'Strong communication and mentorship skills',
        'Teaching or mentoring experience (preferred, but not required)'
      ],
      color: 'green'
    }
  ];

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
            mb={12}
          >
            <VStack spacing={6} textAlign="center">
              <Heading as="h1" size="2xl">Join Us at StemPro Academy</Heading>
              <Text fontSize="xl" color="gray.600" maxW="3xl">
                StemPro Academy is growing, and we're looking for passionate and committed individuals to join our team!
                If you're enthusiastic about making a difference in STEM education, we'd love to hear from you.
              </Text>
            </VStack>
          </MotionBox>

          {/* Opportunities Section */}
          <VStack spacing={8}>
            {opportunities.map((opportunity, index) => (
              <MotionCard
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                shadow="lg"
                w="full"
                _hover={{ shadow: 'xl' }}
              >
                <CardHeader bg={highlightBg} borderTopRadius="md">
                  <VStack align="start" spacing={2}>
                    <Heading size="lg">{opportunity.title}</Heading>
                    <Text fontWeight="bold" color={`${opportunity.color}.600`}>
                      Role: {opportunity.role}
                    </Text>
                  </VStack>
                </CardHeader>
                <CardBody>
                  <VStack align="stretch" spacing={6}>
                    <Text fontSize="lg">{opportunity.description}</Text>

                    <Box>
                      <Heading size="md" mb={3}>Responsibilities:</Heading>
                      <List spacing={2}>
                        {opportunity.responsibilities.map((resp, idx) => (
                          <ListItem key={idx} display="flex" alignItems="flex-start">
                            <Icon as={FiCheckCircle} color={`${opportunity.color}.500`} mt={1} mr={2} />
                            <Text>{resp}</Text>
                          </ListItem>
                        ))}
                      </List>
                    </Box>

                    <Box>
                      <Heading size="md" mb={3}>Requirements:</Heading>
                      <List spacing={2}>
                        {opportunity.requirements.map((req, idx) => (
                          <ListItem key={idx} display="flex" alignItems="flex-start">
                            <Icon as={FiCheckCircle} color={`${opportunity.color}.500`} mt={1} mr={2} />
                            <Text>{req}</Text>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </VStack>
                </CardBody>
              </MotionCard>
            ))}
          </VStack>

          {/* Contact Section */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            mt={16}
            bg="gray.50"
            p={12}
            borderRadius="xl"
            textAlign="center"
          >
            <Heading size="lg" mb={6}>Get In Touch</Heading>
            <Text fontSize="lg" mb={8}>
              If you're interested in joining us or learning more about these roles,
              please don't hesitate to reach out. We'd be delighted to discuss how you
              can become part of the StemPro Academy team!
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} maxW="md" mx="auto">
              <Button
                leftIcon={<FiMail />}
                colorScheme="blue"
                size="lg"
                onClick={() => window.location.href = 'mailto:info@stempro.org'}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                transition="all 0.2s"
              >
                info@stempro.org
              </Button>
              <Button
                leftIcon={<FiPhone />}
                variant="outline"
                colorScheme="blue"
                size="lg"
                onClick={() => window.location.href = 'tel:425-230-0688'}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                transition="all 0.2s"
              >
                425-230-0688
              </Button>
            </SimpleGrid>
          </MotionBox>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}