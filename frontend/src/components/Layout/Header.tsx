'use client';

import { Box, Flex, Button, IconButton, Text, Menu, MenuButton, MenuList, MenuItem, Avatar, HStack, useColorModeValue, Container, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, VStack, useDisclosure, Stack, Badge } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiClock } from 'react-icons/fi';

const MotionBox = motion(Box);

const NavLink = ({ children, href, onClick, showBadge = false }: { children: React.ReactNode; href: string; onClick?: () => void; showBadge?: boolean }) => (
  <Link href={href} onClick={onClick}>
    <Box
      px={3}
      py={2}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
        transform: 'translateY(-2px)',
      }}
      transition="all 0.2s"
      cursor="pointer"
      position="relative"
    >
      <HStack spacing={2}>
        <Text>{children}</Text>
        {showBadge && (
          <Badge
            colorScheme="purple"
            variant="solid"
            fontSize="xs"
            display="flex"
            alignItems="center"
            gap={1}
          >
            <FiClock size={10} />
            Soon
          </Badge>
        )}
      </HStack>
    </Box>
  </Link>
);

export function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const bg = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const navItems = [
    { label: 'Courses', href: '/courses' },
    { label: 'Programs', href: '/programs' },
    { label: 'CollegeNinja', href: '/collegeninja' },
    { label: 'Success Stories', href: '/success' },
    { label: 'About Us', href: '/about' },
    { label: 'Join Us', href: '/join-us' },
  ];

  return (
    <MotionBox
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      bg={bg}
      borderBottom={1}
      borderStyle={'solid'}
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex={10}
      boxShadow="sm"
    >
      <Container maxW="container.xl">
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />

          <HStack spacing={8} alignItems={'center'}>
            <Link href="/">
              <HStack cursor="pointer" _hover={{ opacity: 0.8 }} transition="opacity 0.2s" spacing={3}>
                {/* Logo SVG */}
                <Box
                  w={{ base: "32px", md: "40px" }}
                  h={{ base: "32px", md: "40px" }}
                  position="relative"
                  flexShrink={0}
                >
                  <svg
                    viewBox="0 0 400 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: '100%', height: '100%' }}
                  >
                    {/* Outer C shape */}
                    <path
                      d="M200 80C122.68 80 60 142.68 60 220C60 297.32 122.68 360 200 360C239.66 360 275.84 343.9 301.84 317.9"
                      stroke="#3E3E5B"
                      strokeWidth="60"
                      strokeLinecap="round"
                      fill="none"
                    />

                    {/* Inner bars */}
                    <rect x="180" y="180" width="180" height="40" rx="8" fill="#5B7FFF" />
                    <rect x="180" y="260" width="180" height="40" rx="8" fill="#5B7FFF" />
                  </svg>
                </Box>
                <Text
                  fontSize={{ base: "lg", md: "2xl" }}
                  fontWeight="bold"
                  bgGradient="linear(to-r, blue.400, purple.600)"
                  bgClip="text"
                  display={{ base: 'none', sm: 'block' }}
                >
                  StemPro Academy
                </Text>
                <Text
                  fontSize={{ base: "lg", md: "2xl" }}
                  fontWeight="bold"
                  bgGradient="linear(to-r, blue.400, purple.600)"
                  bgClip="text"
                  display={{ base: 'block', sm: 'none' }}
                >
                  StemPro
                </Text>
              </HStack>
            </Link>

            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  showBadge={item.label === 'CollegeNinja'}
                >
                  {item.label}
                </NavLink>
              ))}
            </HStack>
          </HStack>

          <Flex alignItems={'center'}>
            <Stack direction="row" spacing={4} display={{ base: 'none', md: 'flex' }}>
              <Button
                variant="ghost"
                onClick={() => router.push('/login')}
                _hover={{
                  transform: 'translateY(-2px)',
                  bg: 'gray.100',
                }}
                transition="all 0.2s"
              >
                Login
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => router.push('/enroll')}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                transition="all 0.2s"
              >
                Enroll
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </Container>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <HStack spacing={2}>
              {/* Logo in drawer header */}
              <Box w="24px" h="24px" flexShrink={0}>
                <svg
                  viewBox="0 0 400 400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: '100%', height: '100%' }}
                >
                  <path
                    d="M200 80C122.68 80 60 142.68 60 220C60 297.32 122.68 360 200 360C239.66 360 275.84 343.9 301.84 317.9"
                    stroke="#3E3E5B"
                    strokeWidth="60"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <rect x="180" y="180" width="180" height="40" rx="8" fill="#5B7FFF" />
                  <rect x="180" y="260" width="180" height="40" rx="8" fill="#5B7FFF" />
                </svg>
              </Box>
              <Text fontSize="xl" fontWeight="bold" bgGradient="linear(to-r, blue.400, purple.600)" bgClip="text">
                StemPro Academy
              </Text>
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" mt={4}>
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  showBadge={item.label === 'CollegeNinja'}
                >
                  {item.label}
                </NavLink>
              ))}
              <Box pt={4}>
                <Button
                  variant="ghost"
                  width="full"
                  onClick={() => {
                    router.push('/login');
                    onClose();
                  }}
                  mb={2}
                >
                  Login
                </Button>
                <Button
                  colorScheme="blue"
                  width="full"
                  onClick={() => {
                    router.push('/enroll');
                    onClose();
                  }}
                >
                  Enroll
                </Button>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </MotionBox>
  );
}