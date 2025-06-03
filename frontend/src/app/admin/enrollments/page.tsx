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

// frontend/src/app/admin/schedules/page.tsx
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import { FiMoreVertical, FiCalendar, FiCheck } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { formatDate, formatDateTime } from '@/lib/utils';
import { Schedule } from '@/types';

export default function AdminSchedulesPage() {
  const { schedules, fetchSchedules, updateSchedule } = useAdminStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const filteredSchedules = schedules.filter(schedule =>
    filterStatus === 'all' || schedule.status === filterStatus
  );

  const handleStatusUpdate = async (scheduleId: string, status: string) => {
    try {
      await updateSchedule(scheduleId, { status });
      toast({
        title: 'Schedule updated',
        description: `Status changed to ${status}`,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error updating schedule',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleScheduleDate = async () => {
    if (!selectedSchedule || !scheduledDate) return;

    try {
      await updateSchedule(selectedSchedule.id, {
        status: 'scheduled',
        scheduled_date: new Date(scheduledDate).toISOString(),
      });
      toast({
        title: 'Consultation scheduled',
        description: 'Date and time set successfully',
        status: 'success',
        duration: 3000,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error scheduling consultation',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'scheduled':
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
        <Heading>Consultation Schedules</Heading>
        <Select
          maxW="200px"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
        </Select>
      </HStack>

      <Box overflowX="auto" bg="white" rounded="lg" shadow="md">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th>Requested</Th>
              <Th>Scheduled For</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredSchedules.map((schedule) => (
              <Tr key={schedule.id}>
                <Td>{schedule.first_name} {schedule.last_name}</Td>
                <Td>{schedule.email}</Td>
                <Td>{schedule.phone}</Td>
                <Td>
                  <Badge>{schedule.student_type}</Badge>
                </Td>
                <Td>
                  <Badge colorScheme={getStatusColor(schedule.status)}>
                    {schedule.status}
                  </Badge>
                </Td>
                <Td>{formatDate(schedule.created_at)}</Td>
                <Td>
                  {schedule.scheduled_date
                    ? formatDateTime(schedule.scheduled_date)
                    : '-'}
                </Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      {schedule.status === 'pending' && (
                        <MenuItem
                          icon={<FiCalendar />}
                          onClick={() => {
                            setSelectedSchedule(schedule);
                            onOpen();
                          }}
                        >
                          Schedule Consultation
                        </MenuItem>
                      )}
                      {schedule.status !== 'completed' && (
                        <MenuItem
                          icon={<FiCheck />}
                          onClick={() => handleStatusUpdate(schedule.id, 'completed')}
                        >
                          Mark as Completed
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Schedule Consultation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Select Date and Time</FormLabel>
              <Input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={handleScheduleDate}>
              Schedule
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}