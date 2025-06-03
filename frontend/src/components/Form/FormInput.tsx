// frontend/src/components/Form/FormInput.tsx
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputProps,
  FormHelperText,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

interface FormInputProps extends InputProps {
  label: string;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, isRequired, ...props }, ref) => {
    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        <FormLabel>{label}</FormLabel>
        <Input ref={ref} {...props} />
        {helperText && !error && (
          <FormHelperText>{helperText}</FormHelperText>
        )}
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);

FormInput.displayName = 'FormInput';

// frontend/src/components/Form/FormSelect.tsx
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  SelectProps,
  FormHelperText,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

interface FormSelectProps extends SelectProps {
  label: string;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  options: Array<{ value: string; label: string }>;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, helperText, isRequired, options, placeholder, ...props }, ref) => {
    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        <FormLabel>{label}</FormLabel>
        <Select ref={ref} placeholder={placeholder} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        {helperText && !error && (
          <FormHelperText>{helperText}</FormHelperText>
        )}
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);

FormSelect.displayName = 'FormSelect';

// frontend/src/components/Form/FormTextarea.tsx
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
  TextareaProps,
  FormHelperText,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

interface FormTextareaProps extends TextareaProps {
  label: string;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, helperText, isRequired, ...props }, ref) => {
    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        <FormLabel>{label}</FormLabel>
        <Textarea ref={ref} {...props} />
        {helperText && !error && (
          <FormHelperText>{helperText}</FormHelperText>
        )}
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

// frontend/src/components/Form/index.ts
export { FormInput } from './FormInput';
export { FormSelect } from './FormSelect';
export { FormTextarea } from './FormTextarea';

// frontend/src/components/UI/LoadingSpinner.tsx
import { Center, Spinner, Text, VStack } from '@chakra-ui/react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function LoadingSpinner({ message = 'Loading...', size = 'lg' }: LoadingSpinnerProps) {
  return (
    <Center minH="200px">
      <VStack spacing={4}>
        <Spinner size={size} color="brand.500" thickness="4px" />
        <Text color="gray.600">{message}</Text>
      </VStack>
    </Center>
  );
}

// frontend/src/components/UI/EmptyState.tsx
import { Box, Heading, Text, Button, VStack, Icon } from '@chakra-ui/react';
import { FiInbox } from 'react-icons/fi';
import { ReactElement } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactElement;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Box textAlign="center" py={10}>
      <VStack spacing={4}>
        {icon || <Icon as={FiInbox} boxSize={12} color="gray.400" />}
        <Heading size="md" color="gray.600">
          {title}
        </Heading>
        {description && (
          <Text color="gray.500" maxW="md">
            {description}
          </Text>
        )}
        {actionLabel && onAction && (
          <Button colorScheme="brand" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </VStack>
    </Box>
  );
}

// frontend/src/components/UI/StatusBadge.tsx
import { Badge, BadgeProps } from '@chakra-ui/react';

interface StatusBadgeProps extends BadgeProps {
  status: 'pending' | 'confirmed' | 'completed' | 'scheduled' | 'active' | 'inactive';
}

const statusColors = {
  pending: 'yellow',
  confirmed: 'blue',
  completed: 'green',
  scheduled: 'blue',
  active: 'green',
  inactive: 'red',
};

export function StatusBadge({ status, ...props }: StatusBadgeProps) {
  return (
    <Badge colorScheme={statusColors[status]} {...props}>
      {status}
    </Badge>
  );
}

// frontend/src/components/UI/ConfirmDialog.tsx
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>{message}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} isDisabled={isLoading}>
              {cancelText}
            </Button>
            <Button
              colorScheme="red"
              onClick={onConfirm}
              ml={3}
              isLoading={isLoading}
            >
              {confirmText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

// frontend/src/components/UI/DataTable.tsx
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
}: DataTableProps<T>) {
  const bg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const getCellValue = (item: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    return item[column.accessor] as ReactNode;
  };

  return (
    <Box bg={bg} rounded="lg" shadow="md" overflow="hidden">
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              {columns.map((column, index) => (
                <Th key={index}>{column.header}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item) => (
              <Tr
                key={item.id}
                _hover={{ bg: hoverBg, cursor: onRowClick ? 'pointer' : 'default' }}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column, index) => (
                  <Td key={index}>{getCellValue(item, column)}</Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// frontend/src/components/UI/SearchInput.tsx
import {
  InputGroup,
  InputLeftElement,
  Input,
  InputProps,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

interface SearchInputProps extends InputProps {
  onSearch: (value: string) => void;
}

export function SearchInput({ onSearch, ...props }: SearchInputProps) {
  return (
    <InputGroup maxW="400px">
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.300" />
      </InputLeftElement>
      <Input
        placeholder="Search..."
        onChange={(e) => onSearch(e.target.value)}
        {...props}
      />
    </InputGroup>
  );
}

// frontend/src/components/UI/index.ts
export { LoadingSpinner } from './LoadingSpinner';
export { EmptyState } from './EmptyState';
export { StatusBadge } from './StatusBadge';
export { ConfirmDialog } from './ConfirmDialog';
export { DataTable } from './DataTable';
export { SearchInput } from './SearchInput';

// frontend/src/components/Layout/PageHeader.tsx
import { Box, Heading, Text, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <Box mb={8}>
      {breadcrumbs && (
        <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />} mb={4}>
          {breadcrumbs.map((item, index) => (
            <BreadcrumbItem key={index}>
              {item.href ? (
                <Link href={item.href} passHref>
                  <BreadcrumbLink>{item.label}</BreadcrumbLink>
                </Link>
              ) : (
                <BreadcrumbLink color="gray.600">{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      )}
      <Heading size="xl" mb={2}>
        {title}
      </Heading>
      {description && (
        <Text color="gray.600" fontSize="lg">
          {description}
        </Text>
      )}
    </Box>
  );
}

// frontend/src/components/Layout/Card.tsx
import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';

interface CardProps extends BoxProps {
  variant?: 'elevated' | 'outline' | 'filled';
}

export function Card({ children, variant = 'elevated', ...props }: CardProps) {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const variants = {
    elevated: {
      bg,
      shadow: 'md',
      _hover: { shadow: 'lg' },
    },
    outline: {
      bg: 'transparent',
      border: '1px',
      borderColor,
    },
    filled: {
      bg: useColorModeValue('gray.50', 'gray.900'),
    },
  };

  return (
    <Box
      rounded="lg"
      p={6}
      transition="all 0.2s"
      {...variants[variant]}
      {...props}
    >
      {children}
    </Box>
  );
}

// frontend/src/components/Layout/index.ts
export { Header } from './Header';
export { Footer } from './Footer';
export { PageHeader } from './PageHeader';
export { Card } from './Card';