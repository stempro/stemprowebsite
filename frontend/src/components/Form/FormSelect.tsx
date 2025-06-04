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