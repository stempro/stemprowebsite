// frontend/src/components/UI/DataTable.tsx
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
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

  const renderCell = (item: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    return String(item[column.accessor] || '');
  };

  return (
    <Box overflowX="auto" bg={bg} rounded="lg" shadow="md">
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
              cursor={onRowClick ? 'pointer' : 'default'}
              _hover={{ bg: onRowClick ? hoverBg : undefined }}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column, index) => (
                <Td key={index}>{renderCell(item, column)}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}