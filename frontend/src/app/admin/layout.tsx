// frontend/src/app/admin/layout.tsx
'use client';

import { Box, Container, Flex, VStack, HStack, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import { FiUsers, FiBookOpen, FiCalendar, FiHome } from 'react-icons/fi';
import { usePathname, useRouter } from 'next/navigation';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

interface SidebarItemProps {
  icon: any;
  children: string;
  href: string;
}

const SidebarItem = ({ icon, children, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === href;
  const bg = useColorModeValue('brand.50', 'brand.900');
  const color = useColorModeValue('brand.600', 'brand.200');

  return (
    <HStack
      w="full"
      px={4}
      py={3}
      cursor="pointer"
      bg={isActive ? bg : 'transparent'}
      color={isActive ? color : 'inherit'}
      rounded="md"
      _hover={{ bg: bg }}
      onClick={() => router.push(href)}
    >
      <Icon as={icon} />
      <Text>{children}</Text>
    </HStack>
  );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const sidebarBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    if (!isAuthenticated || !user?.is_admin) {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user?.is_admin) {
    return null;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />

      <Flex flex="1">
        <Box
          w="250px"
          bg={sidebarBg}
          borderRight="1px"
          borderColor={borderColor}
          p={4}
        >
          <VStack align="stretch" spacing={2}>
            <Text fontWeight="bold" fontSize="lg" mb={4}>
              Admin Panel
            </Text>
            <SidebarItem icon={FiHome} href="/admin">
              Dashboard
            </SidebarItem>
            <SidebarItem icon={FiUsers} href="/admin/users">
              Users
            </SidebarItem>
            <SidebarItem icon={FiBookOpen} href="/admin/enrollments">
              Enrollments
            </SidebarItem>
            <SidebarItem icon={FiCalendar} href="/admin/schedules">
              Schedules
            </SidebarItem>
          </VStack>
        </Box>

        <Box flex="1" bg={useColorModeValue('gray.50', 'gray.900')}>
          <Container maxW="container.xl" py={8}>
            {children}
          </Container>
        </Box>
      </Flex>

      <Footer />
    </Box>
  );
}

// frontend/src/app/admin/users/page.tsx
