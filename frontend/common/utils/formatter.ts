// Define proper types for validation errors
interface ValidationError {
  [key: string]: string | string[];
}

export interface ErrorMessages {
  [field: string]: ValidationError;
}

export interface BackendErrorMessages {
  [field: string]: string[];
}

export function formatValidationMessage(errorMessages: ErrorMessages): string[] {
    const messages: string[] = [];
    for (const key in errorMessages) {
        const validationErrs = errorMessages[key];

        for (const errs in validationErrs) {
            const ErrMsg = validationErrs[errs];
            if(ErrMsg instanceof Array){
                for(let i = 0; i < ErrMsg.length; i++){ // Fixed: use < instead of <=
                    if(ErrMsg[i] && ErrMsg[i] !== undefined){
                        messages.push(ErrMsg[i]);
                    }
                }
            }
            else{
                messages.push(ErrMsg);
            }
        }
    }
    // console.log('errorMessages',errorMessages)
    return messages;
}

export function formatClassValidatorErrors(errorMessages: BackendErrorMessages): string[] {
    const messages: string[] = [];
    
    for (const field in errorMessages) {
        if (Array.isArray(errorMessages[field])) {
            // Add all error messages from this field
            messages.push(...errorMessages[field]);
        } else if (typeof errorMessages[field] === 'string') {
            // Handle case where it's a single string (fallback)
            messages.push(errorMessages[field] as string);
        }
    }
    
    return messages;
}

export function formatBackendErrors(errorMessages: ErrorMessages | BackendErrorMessages | string): string[] {
    // Handle string errors
    if (typeof errorMessages === 'string') {
        return [errorMessages];
    }
    
    // Handle null/undefined
    if (!errorMessages || typeof errorMessages !== 'object') {
        return ['An error occurred'];
    }
    
    // Check if it's backend format (field: string[])
    const firstKey = Object.keys(errorMessages)[0];
    if (firstKey && Array.isArray(errorMessages[firstKey])) {
        return formatClassValidatorErrors(errorMessages as BackendErrorMessages);
    }
    
    // Assume it's the original nested format
    return formatValidationMessage(errorMessages as ErrorMessages);
}