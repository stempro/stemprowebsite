'use client';

import { Box, Container, Heading, Text, VStack, List, ListItem, useColorModeValue } from '@chakra-ui/react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function PrivacyPage() {
  const textColor = useColorModeValue('gray.700', 'gray.300');

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />

      <Box flex="1" py={16}>
        <Container maxW="container.lg">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <VStack spacing={8} align="stretch">
              <Box textAlign="center">
                <Heading as="h1" size="2xl" mb={4}>Privacy Policy</Heading>
                <Text color="gray.600">Last updated: October 1, 2024</Text>
              </Box>

              <Text fontSize="lg" color={textColor}>
                Welcome to StemPro Academy! This Privacy Policy describes how we collect, use, and protect your personal information when you visit our website or use our services.
              </Text>

              <Box>
                <Heading as="h2" size="lg" mb={4}>1. Information We Collect</Heading>
                <List spacing={3}>
                  <ListItem>
                    <Text fontWeight="bold">Personal Information:</Text> Details like your name, email address, and phone number.
                  </ListItem>
                  <ListItem>
                    <Text fontWeight="bold">Usage Data:</Text> Information on how you use the site, including your IP address and browser type.
                  </ListItem>
                  <ListItem>
                    <Text fontWeight="bold">Cookies and Tracking:</Text> We use cookies to track site activity and collect certain information.
                  </ListItem>
                </List>
              </Box>

              <Box>
                <Heading as="h2" size="lg" mb={4}>2. How We Use Your Information</Heading>
                <List spacing={3}>
                  <ListItem>Provide, maintain, and improve our services.</ListItem>
                  <ListItem>Send updates and promotional materials.</ListItem>
                  <ListItem>Monitor usage patterns and enhance the user experience.</ListItem>
                  <ListItem>Protect our services against fraud.</ListItem>
                </List>
              </Box>

              <Box>
                <Heading as="h2" size="lg" mb={4}>3. Sharing Your Information</Heading>
                <List spacing={3}>
                  <ListItem>To comply with legal obligations.</ListItem>
                  <ListItem>To service providers assisting in site operations.</ListItem>
                  <ListItem>If required in mergers or acquisitions.</ListItem>
                </List>
              </Box>

              <Box>
                <Heading as="h2" size="lg" mb={4}>4. Security of Your Information</Heading>
                <Text color={textColor}>
                  We take the security of your personal information seriously, implementing measures to protect it, though no method of transmission over the internet is 100% secure.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" mb={4}>5. Your Data Rights</Heading>
                <List spacing={3}>
                  <ListItem>Access, update, or delete your information.</ListItem>
                  <ListItem>Opt-out of marketing communications.</ListItem>
                  <ListItem>Request a copy of your data.</ListItem>
                </List>
              </Box>

              <Box>
                <Heading as="h2" size="lg" mb={4}>6. Third-Party Links</Heading>
                <Text color={textColor}>
                  Our website may contain links to other sites. We recommend reviewing their privacy policies before providing any personal information.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" mb={4}>7. Changes to This Privacy Policy</Heading>
                <Text color={textColor}>
                  We may update our Privacy Policy from time to time and will notify you by posting the new policy on this page.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" mb={4}>8. Contact Us</Heading>
                <List spacing={2}>
                  <ListItem>
                    <Text fontWeight="bold">Email:</Text>{' '}
                    <a href="mailto:info@stempro.org" style={{ color: '#3182CE' }}>info@stempro.org</a>
                  </ListItem>
                  <ListItem>
                    <Text fontWeight="bold">Phone:</Text> 425-230-0688
                  </ListItem>
                </List>
              </Box>
            </VStack>
          </MotionBox>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}