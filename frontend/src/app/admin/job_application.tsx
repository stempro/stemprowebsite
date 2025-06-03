'use client';

import { Box, Container, Heading, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, HStack, useToast, Select, useColorModeValue } from '@chakra-ui/react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiEye, FiTrash2 } from 'react-icons/fi';

interface JobApplication {
  id: string;
  name: string;
  email: string;
  position: string;
  created_at: string;
  status: string;
}

export default function AdminJobApplicationsPage() {
  const router = useRouter();
  const toast = useToast();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const tableBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/job-applications/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else if (response.status === 403) {
        toast({
          title: 'Access Denied',
          description: 'Admin access required',
          status: 'error',
          duration: 3000,
        });
        router.push('/dashboard');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch applications',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/job-applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast({
          title: 'Status Updated',
          status: 'success',
          duration: 3000,
        });
        fetchApplications();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'blue';
      case 'reviewing': return 'yellow';
      case 'interviewed': return 'purple';
      case 'accepted': return 'green';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />

      <Box flex="1" py={8} bg="gray.50">
        <Container maxW="container.xl">
          <Heading mb={8}>Job Applications</Heading>

          <Box bg={tableBg} shadow="md" borderRadius="lg" overflow="hidden">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Position</Th>
                  <Th>Email</Th>
                  <Th>Date</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {applications.map((app) => (
                  <Tr key={app.id}>
                    <Td>{app.name}</Td>
                    <Td>{app.position}</Td>
                    <Td>{app.email}</Td>
                    <Td>{new Date(app.created_at).toLocaleDateString()}</Td>
                    <Td>
                      <Select
                        size="sm"
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        w="auto"
                      >
                        <option value="new">New</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="interviewed">Interviewed</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </Select>
                    </Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(app.status)}>
                        {app.status}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}