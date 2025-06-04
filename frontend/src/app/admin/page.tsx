
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
