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