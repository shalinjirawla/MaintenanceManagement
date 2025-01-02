import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Whitespace Validator
export function noWhitespaceValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (control.value && control.value.trim().length === 0) {
    return { whitespace: true }; // Validation fails if only spaces
  }
  return null; // Validation passes if not only spaces
}

// Password Strength Validator
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) return null; // Don't validate if the input is empty

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasDigits = /\d/.test(value);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const valid = hasUpperCase && hasLowerCase && hasDigits && hasSpecialChars;

    return !valid ? { passwordStrength: true } : null;
  };
}

//Remove start and end whitespace
export function cleanWhitespace(input: string): string {
  if (!input) return input; // If input is null or empty, return as is
  // Trim leading/trailing spaces and replace multiple spaces with a single space
  return input.trim().replace(/\s+/g, ' ');
}

// Custom Validator to Clean Contact Number and Ensure Valid Pattern
export function contactNumberValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;
  if (value) {
    // Remove non-numeric characters
    const cleanedValue = value.replace(/[^0-9]/g, '');

    // Update the control value after cleaning
    control.setValue(cleanedValue);

    // Validate if the cleaned value is exactly 10 digits
    if (cleanedValue.length !== 10) {
      return { invalidContactNumber: true };
    }
  }
  return null;
}

//Validation for Disabled past date
export function futureDateValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (control.value) {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for comparison
    if (selectedDate < today) {
      return { pastDate: true }; // Error if the date is in the past
    }
  }
  return null; // No error
}

export class FormValidationService {
  // Method to restrict input to numbers only
  restrictToNumbers(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
  }
}