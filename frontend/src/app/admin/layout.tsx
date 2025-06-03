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

// frontend/src/app/admin/page.tsx
'use client';

import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  Heading,
  Text,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useAdminStore } from '@/store/adminStore';

interface StatsCardProps {
  title: string;
  stat: string;
  increase?: string;
  type?: 'increase' | 'decrease';
}

function StatsCard({ title, stat, increase, type }: StatsCardProps) {
  const bg = useColorModeValue('white', 'gray.800');

  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={'5'}
      shadow={'xl'}
      bg={bg}
      rounded={'lg'}
    >
      <StatLabel fontWeight={'medium'} isTruncated>
        {title}
      </StatLabel>
      <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
        {stat}
      </StatNumber>
      {increase && (
        <StatHelpText>
          <StatArrow type={type} />
          {increase}
        </StatHelpText>
      )}
    </Stat>
  );
}

export default function AdminDashboard() {
  const { users, enrollments, schedules, fetchUsers, fetchEnrollments, fetchSchedules } = useAdminStore();

  useEffect(() => {
    fetchUsers();
    fetchEnrollments();
    fetchSchedules();
  }, [fetchUsers, fetchEnrollments, fetchSchedules]);

  const activeUsers = users.filter(u => u.is_active).length;
  const pendingEnrollments = enrollments.filter(e => e.status === 'pending').length;
  const pendingSchedules = schedules.filter(s => s.status === 'pending').length;

  return (
    <Box>
      <Heading mb={8}>Admin Dashboard</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={{ base: 5, lg: 8 }} mb={8}>
        <StatsCard
          title={'Total Users'}
          stat={users.length.toString()}
          increase={'12%'}
          type={'increase'}
        />
        <StatsCard
          title={'Active Users'}
          stat={activeUsers.toString()}
        />
        <StatsCard
          title={'Total Enrollments'}
          stat={enrollments.length.toString()}
          increase={'8%'}
          type={'increase'}
        />
        <StatsCard
          title={'Pending Schedules'}
          stat={pendingSchedules.toString()}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        <Box bg={useColorModeValue('white', 'gray.800')} p={6} rounded="lg" shadow="md">
          <Heading size="md" mb={4}>Recent Activity</Heading>
          <Text color="gray.600">
            {pendingEnrollments} pending enrollments need review
          </Text>
          <Text color="gray.600" mt={2}>
            {pendingSchedules} consultation requests waiting
          </Text>
        </Box>

        <Box bg={useColorModeValue('white', 'gray.800')} p={6} rounded="lg" shadow="md">
          <Heading size="md" mb={4}>Quick Stats</Heading>
          <Text color="gray.600">
            Admin users: {users.filter(u => u.is_admin).length}
          </Text>
          <Text color="gray.600" mt={2}>
            Students: {users.filter(u => u.role === 'student').length}
          </Text>
          <Text color="gray.600" mt={2}>
            Parents: {users.filter(u => u.role === 'parent').length}
          </Text>
        </Box>
      </SimpleGrid>
    </Box>
  );
}

// frontend/src/app/admin/users/page.tsx
'use client';

import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useToast,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { FiMoreVertical, FiEdit, FiTrash2, FiUserCheck, FiUserX } from 'react-icons/fi';
import { useEffect, useState, useRef } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { formatDate } from '@/lib/utils';
import { User } from '@/types';

export default function AdminUsersPage() {
  const { users, fetchUsers, deleteUser, toggleUserActive, makeUserAdmin } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id);
      toast({
        title: 'User deleted',
        status: 'success',
        duration: 3000,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error deleting user',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleToggleActive = async (userId: string) => {
    try {
      await toggleUserActive(userId);
      toast({
        title: 'User status updated',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error updating user status',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleMakeAdmin = async (userId: string) => {
    try {
      await makeUserAdmin(userId);
      toast({
        title: 'User is now an admin',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error making user admin',
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Box>
      <HStack justify="space-between" mb={8}>
        <Heading>Users Management</Heading>
        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </HStack>

      <Box overflowX="auto" bg="white" rounded="lg" shadow="md">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Joined</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredUsers.map((user) => (
              <Tr key={user.id}>
                <Td>
                  {user.name}
                  {user.is_admin && (
                    <Badge ml={2} colorScheme="purple">
                      Admin
                    </Badge>
                  )}
                </Td>
                <Td>{user.email}</Td>
                <Td>
                  <Badge colorScheme="blue">{user.role}</Badge>
                </Td>
                <Td>
                  <Badge colorScheme={user.is_active ? 'green' : 'red'}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </Td>
                <Td>{formatDate(user.created_at)}</Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem
                        icon={user.is_active ? <FiUserX /> : <FiUserCheck />}
                        onClick={() => handleToggleActive(user.id)}
                      >
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </MenuItem>
                      {!user.is_admin && (
                        <MenuItem
                          icon={<FiUserCheck />}
                          onClick={() => handleMakeAdmin(user.id)}
                        >
                          Make Admin
                        </MenuItem>
                      )}
                      <MenuItem
                        icon={<FiTrash2 />}
                        color="red.500"
                        onClick={() => {
                          setSelectedUser(user);
                          onOpen();
                        }}
                      >
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete User
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}