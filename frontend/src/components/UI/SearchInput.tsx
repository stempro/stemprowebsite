// frontend/src/components/UI/SearchInput.tsx
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';

interface SearchInputProps {
  value: string;
  onSearch: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onSearch, placeholder = 'Search...' }: SearchInputProps) {
  return (
    <InputGroup maxW="300px">
      <InputLeftElement pointerEvents="none">
        <FiSearch color="gray.300" />
      </InputLeftElement>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onSearch(e.target.value)}
      />
    </InputGroup>
  );
}
