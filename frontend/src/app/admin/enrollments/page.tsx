// frontend/src/app/admin/enrollments/page.tsx
'use client';

import {
  Box,
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
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { FiMoreVertical, FiCheck, FiX } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { formatDate } from '@/lib/utils';
import { Enrollment } from '@/types';

export default function AdminEnrollmentsPage() {
  const { enrollments, fetchEnrollments, updateEnrollment } = useAdminStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const toast = useToast();

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const filteredEnrollments = enrollments.filter(enrollment =>
    filterStatus === 'all' || enrollment.status === filterStatus
  );

  const handleStatusUpdate = async (enrollmentId: string, status: string) => {
    try {
      await updateEnrollment(enrollmentId, { status });
      toast({
        title: 'Enrollment updated',
        description: `Status changed to ${status}`,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error updating enrollment',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'confirmed':
        return 'blue';
      case 'completed':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <Box>
      <HStack justify="space-between" mb={8}>
        <Heading>Course Enrollments</Heading>
        <Select
          maxW="200px"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
        </Select>
      </HStack>

      <Box overflowX="auto" bg="white" rounded="lg" shadow="md">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Student Name</Th>
              <Th>Email</Th>
              <Th>Course</Th>
              <Th>Type</Th>
              <Th>Country</Th>
              <Th>Status</Th>
              <Th>Enrolled</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredEnrollments.map((enrollment) => (
              <Tr key={enrollment.id}>
                <Td>{enrollment.first_name} {enrollment.last_name}</Td>
                <Td>{enrollment.email}</Td>
                <Td>{enrollment.course}</Td>
                <Td>
                  <Badge>{enrollment.student_type}</Badge>
                </Td>
                <Td>{enrollment.country}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(enrollment.status)}>
                    {enrollment.status}
                  </Badge>
                </Td>
                <Td>{formatDate(enrollment.created_at)}</Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      {enrollment.status !== 'confirmed' && (
                        <MenuItem
                          icon={<FiCheck />}
                          onClick={() => handleStatusUpdate(enrollment.id, 'confirmed')}
                        >
                          Mark as Confirmed
                        </MenuItem>
                      )}
                      {enrollment.status !== 'completed' && (
                        <MenuItem
                          icon={<FiCheck />}
                          onClick={() => handleStatusUpdate(enrollment.id, 'completed')}
                        >
                          Mark as Completed
                        </MenuItem>
                      )}
                      {enrollment.status !== 'pending' && (
                        <MenuItem
                          icon={<FiX />}
                          onClick={() => handleStatusUpdate(enrollment.id, 'pending')}
                        >
                          Mark as Pending
                        </MenuItem>
                      )}
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
