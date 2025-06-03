'use client';

import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  useColorModeValue,
  HStack,
  VStack,
  SimpleGrid,
  Heading,
  Icon,
  IconButton,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiLinkedin } from 'react-icons/fi';

export function Footer() {
  const bg = useColorModeValue('gray.900', 'gray.900');
  const color = useColorModeValue('gray.400', 'gray.400');
  const linkHoverColor = useColorModeValue('white', 'white');
  const borderColor = useColorModeValue('gray.800', 'gray.700');

  const quickLinks = [
    { label: 'Courses', href: '/courses' },
    { label: 'Programs', href: '/programs' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const programs = [
    'Junior AI Program',
    'Generative AI Program',
    'Advanced AI Program',
    'CollegeNinja',
    'Research Program'
  ];

  const footerLinks = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms' },
    { label: 'Resources', href: '/resources' },
  ];

  return (
    <Box bg={bg} color={color} mt="auto">
      <Container maxW="container.xl" py={12}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          {/* Company Info */}
          <VStack align="start" spacing={4}>
            <Heading size="lg" color="white">StemPro Academy</Heading>
            <Text fontSize="sm">
              Empowering the next generation with AI and programming education.
            </Text>
            <HStack spacing={4}>
              <IconButton
                aria-label="Facebook"
                icon={<FiFacebook />}
                variant="ghost"
                color={color}
                _hover={{ color: linkHoverColor, transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              />
              <IconButton
                aria-label="Twitter"
                icon={<FiTwitter />}
                variant="ghost"
                color={color}
                _hover={{ color: linkHoverColor, transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              />
              <IconButton
                aria-label="LinkedIn"
                icon={<FiLinkedin />}
                variant="ghost"
                color={color}
                _hover={{ color: linkHoverColor, transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              />
            </HStack>
          </VStack>

          {/* Quick Links */}
          <VStack align="start" spacing={4}>
            <Heading size="md" color="white">Quick Links</Heading>
            <VStack align="start" spacing={2}>
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  as={NextLink}
                  href={link.href}
                  _hover={{ color: linkHoverColor, textDecoration: 'none', transform: 'translateX(2px)' }}
                  transition="all 0.2s"
                >
                  {link.label}
                </Link>
              ))}
            </VStack>
          </VStack>

          {/* Programs */}
          <VStack align="start" spacing={4}>
            <Heading size="md" color="white">Our Programs</Heading>
            <VStack align="start" spacing={2}>
              {programs.map((program) => (
                <Text key={program} fontSize="sm">
                  {program}
                </Text>
              ))}
            </VStack>
          </VStack>

          {/* Contact Info */}
          <VStack align="start" spacing={4}>
            <Heading size="md" color="white">Contact Us</Heading>
            <VStack align="start" spacing={3}>
              <HStack>
                <Icon as={FiMapPin} />
                <Text fontSize="sm">Bellevue, WA</Text>
              </HStack>
              <HStack>
                <Icon as={FiMail} />
                <Link
                  href="mailto:info@stempro.org"
                  _hover={{ color: linkHoverColor, textDecoration: 'none' }}
                  transition="all 0.2s"
                  fontSize="sm"
                >
                  info@stempro.org
                </Link>
              </HStack>
              <HStack>
                <Icon as={FiPhone} />
                <Link
                  href="tel:425-230-0688"
                  _hover={{ color: linkHoverColor, textDecoration: 'none' }}
                  transition="all 0.2s"
                  fontSize="sm"
                >
                  425-230-0688
                </Link>
              </HStack>
            </VStack>
          </VStack>
        </SimpleGrid>

        <Box
          borderTop={1}
          borderStyle="solid"
          borderColor={borderColor}
          mt={10}
          pt={10}
        >
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={4}
            justify={{ base: 'center', md: 'space-between' }}
            align={{ base: 'center', md: 'center' }}
          >
            <Text fontSize="sm">© 2025 StemPro Academy. All rights reserved</Text>
            <HStack spacing={6}>
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  as={NextLink}
                  href={link.href}
                  fontSize="sm"
                  _hover={{ color: linkHoverColor, textDecoration: 'none' }}
                  transition="all 0.2s"
                >
                  {link.label}
                </Link>
              ))}
            </HStack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}