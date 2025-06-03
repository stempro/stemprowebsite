// frontend/src/app/admin/users/page.tsx (REFACTORED VERSION)
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

import { usersApi } from '@/services/api';
import { formatDate } from '@/lib/utils';
import { User } from '@/types';

export default function AdminUsersPageRefactored() {
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

    const result = await deleteUser(selectedUser.id);
    if (result) {
      showSuccess({
        title: 'User deleted',
        description: `${selectedUser.name} has been removed`,
      });
      fetchUsers(); // Refresh the list
    } else {
      showError({
        title: 'Error',
        description: 'Failed to delete user',
      });
    }
    onClose();
  };

  const handleToggleActive = async (userId: string) => {
    const result = await toggleUserActive(userId);
    if (result) {
      showSuccess({
        title: 'User status updated',
      });
      fetchUsers(); // Refresh the list
    } else {
      showError({
        title: 'Error',
        description: 'Failed to update user status',
      });
    }
  };

  const handleMakeAdmin = async (userId: string) => {
    const result = await makeUserAdmin(userId);
    if (result) {
      showSuccess({
        title: 'User is now an admin',
      });
      fetchUsers(); // Refresh the list
    } else {
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

// Example of using FormInput component in a form
// frontend/src/app/admin/users/[id]/edit.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Stack, Button, HStack } from '@chakra-ui/react';
import { FormInput, FormSelect, FormTextarea } from '@/components/Form';
import { Card } from '@/components/Layout/Card';
import { useFormPersist } from '@/hooks/useFormPersist';

const userEditSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  role: z.enum(['student', 'parent', 'teacher', 'visitor']),
  country: z.string(),
  postal_code: z.string(),
  comments: z.string().optional(),
});

type UserEditForm = z.infer<typeof userEditSchema>;

export function UserEditForm({ user }: { user: User }) {
  const form = useForm<UserEditForm>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      name: user.name,
      role: user.role,
      country: user.country,
      postal_code: user.postal_code,
      comments: user.comments || '',
    },
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;

  // Persist form data in case user navigates away
  const { clearPersistedData } = useFormPersist({
    form,
    storageKey: `user-edit-${user.id}`,
    exclude: [], // Don't exclude any fields
  });

  const onSubmit = async (data: UserEditForm) => {
    // Submit logic here
    clearPersistedData(); // Clear on successful submit
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <FormInput
            label="Full Name"
            error={errors.name?.message}
            {...register('name')}
          />

          <FormSelect
            label="Role"
            error={errors.role?.message}
            options={[
              { value: 'student', label: 'Student' },
              { value: 'parent', label: 'Parent' },
              { value: 'teacher', label: 'Teacher' },
              { value: 'visitor', label: 'Visitor' },
            ]}
            {...register('role')}
          />

          <FormSelect
            label="Country"
            error={errors.country?.message}
            options={[
              { value: 'USA', label: 'USA' },
              { value: 'Canada', label: 'Canada' },
              { value: 'Other', label: 'Other' },
            ]}
            {...register('country')}
          />

          <FormInput
            label="Postal Code"
            error={errors.postal_code?.message}
            {...register('postal_code')}
          />

          <FormTextarea
            label="Comments"
            error={errors.comments?.message}
            {...register('comments')}
          />

          <HStack spacing={4} pt={4}>
            <Button
              type="submit"
              colorScheme="brand"
              isLoading={isSubmitting}
            >
              Save Changes
            </Button>
            <Button variant="outline">
              Cancel
            </Button>
          </HStack>
        </Stack>
      </form>
    </Card>
  );
}