'use client';

import { Box, Container, Heading, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function TermsPage() {
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
                <Heading as="h1" size="2xl" mb={4}>Terms of Use</Heading>
                <Text color="gray.600">Last updated: October 1, 2024</Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" mb={4}>1. Acceptance of Terms</Heading>
                <Text color={textColor}>
                  By accessing or using the StemPro Academy website, you agree to be bound by these Terms of Use, including our Privacy Policy. If you do not agree, please discontinue use of our site.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" mb={4}>2. Use of Website</Heading>
                <Text color={textColor}>
                  This website and its content are intended for personal, non-commercial use only. You agree not to use our site or services for any unlawful purpose or in any way that could damage our reputation or interfere with other users' experience.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" mb={4}>3. Intellectual Property Rights</Heading>
                <Text color={textColor}>
                  All content, materials, and intellectual property on this website, including text, graphics, logos, and images, are owned by StemPro Academy and protected by copyright and trademark laws. Unauthorized use of these materials is prohibited.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" mb={4}>4. User Accounts</Heading>
                <Text color={textColor}>
                  If you create an account on our website, you are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" mb={4}>5. Limitation of Liability</Heading>
                <Text color={textColor}>
                  StemPro Academy is not liable for any direct, indirect, incidental, or consequential damages arising from your use or inability to use this website. We do not warrant the accuracy or completeness of the information provided.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" mb={4}>6. Links to Third-Party Websites</Heading>
                <Text color={textColor}>
                  Our website may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of these external sites, and recommend reviewing their terms before providing personal information.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" mb={4}>7. Modification of Terms</Heading>
                <Text color={textColor}>
                  We may update these Terms of Use periodically. Changes will be posted on this page, and continued use of our site after any updates constitutes acceptance of those changes.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" mb={4}>8. Termination</Heading>
                <Text color={textColor}>
                  We reserve the right to terminate or restrict access to our website and services at our discretion, without notice, if we believe you have violated these Terms of Use.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" mb={4}>9. Contact Us</Heading>
                <Text color={textColor}>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:info@stempro.org" style={{ color: '#3182CE' }}>info@stempro.org</a>
                  <br />
                  <strong>Phone:</strong> 425-230-0688
                </Text>
              </Box>
            </VStack>
          </MotionBox>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}