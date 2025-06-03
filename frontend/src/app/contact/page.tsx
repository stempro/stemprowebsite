'use client';

import { Box, Container, Heading, Text, VStack, SimpleGrid, Card, CardBody, Icon, Button, Stack, useColorModeValue } from '@chakra-ui/react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function ContactPage() {
  const router = useRouter();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconBg = useColorModeValue('blue.50', 'blue.900');

  const contactInfo = [
    {
      icon: FiMail,
      title: 'Email Us',
      content: 'info@stempro.org',
      link: 'mailto:info@stempro.org',
      color: 'blue'
    },
    {
      icon: FiPhone,
      title: 'Call Us',
      content: '425-230-0688',
      link: 'tel:425-230-0688',
      color: 'green'
    },
    {
      icon: FiMapPin,
      title: 'Location',
      content: 'Bellevue, WA',
      link: null,
      color: 'purple'
    },
    {
      icon: FiClock,
      title: 'Hours',
      content: 'Mon-Fri: 9AM-6PM PST',
      link: null,
      color: 'orange'
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
            mb={16}
          >
            <VStack spacing={6} textAlign="center">
              <Heading as="h1" size="2xl">Get in Touch</Heading>
              <Text fontSize="xl" color="gray.600" maxW="2xl">
                We'd love to hear from you! Whether you have questions about our programs,
                need guidance on choosing the right course, or want to join our team, we're here to help.
              </Text>
            </VStack>
          </MotionBox>

          {/* Contact Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} mb={16}>
            {contactInfo.map((info, index) => (
              <MotionCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                shadow="md"
                _hover={{ shadow: 'xl' }}
                cursor={info.link ? 'pointer' : 'default'}
                onClick={() => info.link && window.open(info.link, '_self')}
              >
                <CardBody textAlign="center" p={8}>
                  <Box
                    p={3}
                    bg={iconBg}
                    borderRadius="full"
                    display="inline-flex"
                    mb={4}
                  >
                    <Icon as={info.icon} boxSize={8} color={`${info.color}.500`} />
                  </Box>
                  <Heading size="md" mb={2}>{info.title}</Heading>
                  <Text color="gray.600" fontWeight={info.link ? 'semibold' : 'normal'}>
                    {info.content}
                  </Text>
                </CardBody>
              </MotionCard>
            ))}
          </SimpleGrid>

          {/* CTA Sections */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            <MotionCard
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              bg="blue.50"
              p={8}
              borderRadius="xl"
            >
              <VStack align="stretch" spacing={4}>
                <Heading size="lg">Ready to Start Learning?</Heading>
                <Text color="gray.600">
                  Join our programs and transform your future with AI and programming skills.
                </Text>
                <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
                  <Button
                    colorScheme="blue"
                    onClick={() => router.push('/register')}
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                    }}
                    transition="all 0.2s"
                  >
                    Enroll Now
                  </Button>
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    onClick={() => router.push('/courses')}
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                    }}
                    transition="all 0.2s"
                  >
                    View Courses
                  </Button>
                </Stack>
              </VStack>
            </MotionCard>

            <MotionCard
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              bg="purple.50"
              p={8}
              borderRadius="xl"
            >
              <VStack align="stretch" spacing={4}>
                <Heading size="lg">Need Personalized Guidance?</Heading>
                <Text color="gray.600">
                  Schedule a free consultation to find the perfect program for you or your child.
                </Text>
                <Button
                  colorScheme="purple"
                  onClick={() => router.push('/schedule')}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  Schedule Consultation
                </Button>
              </VStack>
            </MotionCard>
          </SimpleGrid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}