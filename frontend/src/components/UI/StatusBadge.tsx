// frontend/src/components/UI/StatusBadge.tsx
import { Badge } from '@chakra-ui/react';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'confirmed' | 'completed';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colorScheme = {
    active: 'green',
    inactive: 'red',
    pending: 'yellow',
    confirmed: 'blue',
    completed: 'green',
  }[status] || 'gray';

  return (
    <Badge colorScheme={colorScheme}>
      {status}
    </Badge>
  );
}