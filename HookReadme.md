# Frontend Components & Hooks Documentation

## 📦 Reusable Components

### Form Components

#### FormInput
A wrapped Chakra UI Input with built-in error handling and labels.

```tsx
import { FormInput } from '@/components/Form';

<FormInput
  label="Email Address"
  type="email"
  placeholder="Enter email"
  error={errors.email?.message}
  helperText="We'll never share your email"
  isRequired
  {...register('email')}
/>
```

#### FormSelect
A wrapped Chakra UI Select with options array support.

```tsx
import { FormSelect } from '@/components/Form';

<FormSelect
  label="Country"
  placeholder="Select country"
  error={errors.country?.message}
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
  ]}
  {...register('country')}
/>
```

#### FormTextarea
A wrapped Chakra UI Textarea with consistent styling.

```tsx
import { FormTextarea } from '@/components/Form';

<FormTextarea
  label="Comments"
  placeholder="Tell us more..."
  rows={4}
  error={errors.comments?.message}
  {...register('comments')}
/>
```

### UI Components

#### LoadingSpinner
Centered loading spinner with optional message.

```tsx
import { LoadingSpinner } from '@/components/UI';

<LoadingSpinner message="Loading users..." size="lg" />
```

#### EmptyState
Display when no data is available with optional action button.

```tsx
import { EmptyState } from '@/components/UI';

<EmptyState
  title="No courses found"
  description="You haven't enrolled in any courses yet"
  actionLabel="Browse Courses"
  onAction={() => router.push('/courses')}
/>
```

#### StatusBadge
Consistent status badge coloring across the app.

```tsx
import { StatusBadge } from '@/components/UI';

<StatusBadge status="pending" /> // yellow
<StatusBadge status="confirmed" /> // blue
<StatusBadge status="completed" /> // green
```

#### ConfirmDialog
Reusable confirmation dialog for destructive actions.

```tsx
import { ConfirmDialog } from '@/components/UI';
import { useDisclosure } from '@chakra-ui/react';

const { isOpen, onOpen, onClose } = useDisclosure();

<ConfirmDialog
  isOpen={isOpen}
  onClose={onClose}
  onConfirm={handleDelete}
  title="Delete User"
  message="Are you sure? This cannot be undone."
  confirmText="Delete"
  isLoading={isDeleting}
/>
```

#### DataTable
Generic data table with clickable rows.

```tsx
import { DataTable } from '@/components/UI';

const columns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Email', accessor: 'email' },
  {
    header: 'Status',
    accessor: (user) => <StatusBadge status={user.status} />
  },
];

<DataTable
  data={users}
  columns={columns}
  onRowClick={(user) => router.push(`/users/${user.id}`)}
/>
```

#### SearchInput
Pre-styled search input with icon.

```tsx
import { SearchInput } from '@/components/UI';

<SearchInput
  value={searchTerm}
  onSearch={setSearchTerm}
  placeholder="Search users..."
/>
```

### Layout Components

#### PageHeader
Consistent page header with breadcrumbs.

```tsx
import { PageHeader } from '@/components/Layout';

<PageHeader
  title="User Management"
  description="Manage user accounts and permissions"
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Admin', href: '/admin' },
    { label: 'Users' },
  ]}
/>
```

#### Card
Flexible card component with variants.

```tsx
import { Card } from '@/components/Layout';

<Card variant="elevated"> {/* default - with shadow */}
  <Heading>Card Title</Heading>
  <Text>Card content</Text>
</Card>

<Card variant="outline"> {/* bordered */}
  Content
</Card>

<Card variant="filled"> {/* gray background */}
  Content
</Card>
```

## 🪝 Custom Hooks

### useApi
Wrapper for API calls with loading and error states.

```tsx
import { useApi } from '@/hooks/useApi';
import { usersApi } from '@/services/users';

function UserList() {
  const { data: users, isLoading, error, execute } = useApi(usersApi.getAll);

  useEffect(() => {
    execute();
  }, [execute]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <Text>Error: {error}</Text>;

  return <div>{/* render users */}</div>;
}
```

### useDebounce
Debounce values for search inputs.

```tsx
import { useDebounce } from '@/hooks/useDebounce';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    // API call with debounced value
    searchUsers(debouncedSearchTerm);
  }, [debouncedSearchTerm]);
}
```

### usePagination
Handle pagination logic.

```tsx
import { usePagination } from '@/hooks/usePagination';

function PaginatedList({ items }) {
  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    isFirstPage,
    isLastPage,
  } = usePagination({
    totalItems: items.length,
    itemsPerPage: 10,
  });

  const currentItems = items.slice(startIndex, endIndex);

  return (
    <>
      {/* Render current items */}
      <HStack>
        <Button onClick={prevPage} disabled={isFirstPage}>Previous</Button>
        <Text>Page {currentPage} of {totalPages}</Text>
        <Button onClick={nextPage} disabled={isLastPage}>Next</Button>
      </HStack>
    </>
  );
}
```

### useToastNotification
Consistent toast notifications.

```tsx
import { useToastNotification } from '@/hooks/useToastNotification';

function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useToastNotification();

  const handleSave = async () => {
    try {
      await saveData();
      showSuccess({
        title: 'Saved successfully',
        description: 'Your changes have been saved',
      });
    } catch (error) {
      showError({
        title: 'Save failed',
        description: error.message,
      });
    }
  };
}
```

### useAuth
Authentication state and route protection.

```tsx
import { useAuth } from '@/hooks/useAuth';

function ProtectedPage() {
  // Redirect to login if not authenticated
  const { user, isAuthenticated } = useAuth({ redirectTo: '/login' });

  // Require admin access
  const { user: adminUser } = useAuth({
    requireAdmin: true,
    redirectTo: '/'
  });

  if (!isAuthenticated) return null;

  return <div>Protected content</div>;
}
```

### useFormPersist
Persist form data in sessionStorage.

```tsx
import { useFormPersist } from '@/hooks/useFormPersist';

function MyForm() {
  const form = useForm();

  const { clearPersistedData } = useFormPersist({
    form,
    storageKey: 'my-form-data',
    exclude: ['password'], // Don't persist sensitive fields
  });

  const onSubmit = async (data) => {
    await submitForm(data);
    clearPersistedData(); // Clear on success
  };
}
```

### useConfirm
Promise-based confirmation dialog.

```tsx
import { useConfirm } from '@/hooks/useConfirm';

function DeleteButton({ onDelete }) {
  const { isOpen, confirm, onOpen, onClose } = useConfirm();

  const handleDelete = async () => {
    const confirmed = await confirm();
    if (confirmed) {
      await onDelete();
    }
  };

  return (
    <>
      <Button onClick={handleDelete}>Delete</Button>
      <ConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onOpen}
        title="Confirm Delete"
        message="Are you sure?"
      />
    </>
  );
}
```

## 🎨 Usage Example

Here's a complete example combining multiple components and hooks:

```tsx
import { useState, useEffect } from 'react';
import {
  PageHeader,
  Card,
  DataTable,
  LoadingSpinner,
  EmptyState,
  SearchInput,
  StatusBadge
} from '@/components';
import {
  useApi,
  useDebounce,
  useToastNotification,
  usePagination
} from '@/hooks';

export function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { showSuccess, showError } = useToastNotification();

  const { data: users, isLoading, execute: fetchUsers } = useApi(usersApi.getAll);

  const filteredUsers = users?.filter(user =>
    user.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  ) || [];

  const { currentItems, ...paginationProps } = usePagination({
    totalItems: filteredUsers.length,
    itemsPerPage: 20,
  });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Status',
      accessor: (user) => <StatusBadge status={user.status} />
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Users"
        description="Manage your users"
      />

      <Card mb={6}>
        <SearchInput value={searchTerm} onSearch={setSearchTerm} />
      </Card>

      {isLoading ? (
        <LoadingSpinner />
      ) : filteredUsers.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <DataTable data={currentItems} columns={columns} />
      )}
    </Box>
  );
}
```