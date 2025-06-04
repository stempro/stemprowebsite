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