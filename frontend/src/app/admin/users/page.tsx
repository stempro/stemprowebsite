// frontend/src/app/admin/users/page.tsx (FIXED VERSION)
'use client';

import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { FiMoreVertical, FiUserCheck, FiUserX, FiTrash2 } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Import our custom components and hooks
import { DataTable } from '@/components/UI/DataTable';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { EmptyState } from '@/components/UI/EmptyState';
import { SearchInput } from '@/components/UI/SearchInput';
import { ConfirmDialog } from '@/components/UI/ConfirmDialog';
import { PageHeader } from '@/components/Layout/PageHeader';
import { StatusBadge } from '@/components/UI/StatusBadge';

import { useApi } from '@/hooks/useApi';
import { useDebounce } from '@/hooks/useDebounce';
import { useToastNotification } from '@/hooks/useToastNotification';
import { useAuth } from '@/hooks/useAuth';
import { useConfirm } from '@/hooks/useConfirm';

import { usersApi } from '@/services/users';
import { formatDate } from '@/lib/utils';
import { User } from '@/types';

export default function AdminUsersPageFixed() {
  const router = useRouter();
  const { showSuccess, showError } = useToastNotification();

  // Use our auth hook to ensure admin access
  useAuth({ requireAdmin: true, redirectTo: '/' });

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { isOpen, confirm, onClose } = useConfirm();

  // API hooks
  const { data: users, isLoading, execute: fetchUsers } = useApi(usersApi.getAll);
  const { execute: deleteUser } = useApi(usersApi.delete);
  const { execute: toggleUserActive } = useApi(usersApi.toggleActive);
  const { execute: makeUserAdmin } = useApi(usersApi.makeAdmin);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users based on search
  const filteredUsers = users?.filter(
    user =>
      user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  ) || [];

  // Handlers
  const handleDelete = async () => {
    if (!selectedUser) return;

    const confirmed = await confirm();
    if (!confirmed) return;

    try {
      await deleteUser(selectedUser.id);
      showSuccess({
        title: 'User deleted',
        description: `${selectedUser.name} has been removed`,
      });
      fetchUsers(); // Refresh the list
    } catch (error) {
      showError({
        title: 'Error',
        description: 'Failed to delete user',
      });
    }
    onClose();
  };

  const handleToggleActive = async (userId: string) => {
    try {
      const result = await toggleUserActive(userId);
      if (result) {
        showSuccess({
          title: 'User status updated',
        });
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      showError({
        title: 'Error',
        description: 'Failed to update user status',
      });
    }
  };

  const handleMakeAdmin = async (userId: string) => {
    try {
      const result = await makeUserAdmin(userId);
      if (result) {
        showSuccess({
          title: 'User is now an admin',
        });
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      showError({
        title: 'Error',
        description: 'Failed to make user admin',
      });
    }
  };

  // Table columns configuration
  const columns = [
    {
      header: 'Name',
      accessor: (user: User) => (
        <HStack>
          <span>{user.name}</span>
          {user.is_admin && (
            <Badge colorScheme="purple" size="sm">
              Admin
            </Badge>
          )}
        </HStack>
      ),
    },
    {
      header: 'Email',
      accessor: 'email' as keyof User,
    },
    {
      header: 'Role',
      accessor: (user: User) => (
        <Badge colorScheme="blue">{user.role}</Badge>
      ),
    },
    {
      header: 'Status',
      accessor: (user: User) => (
        <StatusBadge status={user.is_active ? 'active' : 'inactive'} />
      ),
    },
    {
      header: 'Joined',
      accessor: (user: User) => formatDate(user.created_at),
    },
    {
      header: 'Actions',
      accessor: (user: User) => (
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FiMoreVertical />}
            variant="ghost"
            size="sm"
            onClick={(e) => e.stopPropagation()}
          />
          <MenuList>
            <MenuItem
              icon={user.is_active ? <FiUserX /> : <FiUserCheck />}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleActive(user.id);
              }}
            >
              {user.is_active ? 'Deactivate' : 'Activate'}
            </MenuItem>
            {!user.is_admin && (
              <MenuItem
                icon={<FiUserCheck />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMakeAdmin(user.id);
                }}
              >
                Make Admin
              </MenuItem>
            )}
            <MenuItem
              icon={<FiTrash2 />}
              color="red.500"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUser(user);
                confirm();
              }}
            >
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Users Management"
        description="Manage user accounts and permissions"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Users' },
        ]}
      />

      <HStack justify="space-between" mb={6}>
        <Box />
        <SearchInput
          value={searchTerm}
          onSearch={setSearchTerm}
          placeholder="Search users..."
        />
      </HStack>

      {isLoading ? (
        <LoadingSpinner message="Loading users..." />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          title="No users found"
          description={
            searchTerm
              ? 'Try adjusting your search terms'
              : 'No users have registered yet'
          }
        />
      ) : (
        <DataTable
          data={filteredUsers}
          columns={columns}
          onRowClick={(user) => router.push(`/admin/users/${user.id}`)}
        />
      )}

      <ConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        confirmText="Delete"
      />
    </Box>
  );
}