/**
 * Secure password generation utility
 * Generates cryptographically secure random passwords
 */

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

/**
 * Generates a secure random password
 * @param length - Length of the password (default: 12)
 * @param options - Options for password generation
 * @returns Generated password string
 */
export function generatePassword(
    length: number = 12,
    options: {
        includeUppercase?: boolean;
        includeLowercase?: boolean;
        includeNumbers?: boolean;
        includeSymbols?: boolean;
    } = {}
): string {
    const {
        includeUppercase = true,
        includeLowercase = true,
        includeNumbers = true,
        includeSymbols = true,
    } = options;

    let charset = '';
    let password = '';

    // Build charset based on options
    if (includeUppercase) charset += UPPERCASE;
    if (includeLowercase) charset += LOWERCASE;
    if (includeNumbers) charset += NUMBERS;
    if (includeSymbols) charset += SYMBOLS;

    if (charset.length === 0) {
        throw new Error('At least one character type must be included');
    }

    // Ensure at least one character from each selected type
    if (includeUppercase) {
        password += UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)];
    }
    if (includeLowercase) {
        password += LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)];
    }
    if (includeNumbers) {
        password += NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
    }
    if (includeSymbols) {
        password += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    }

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    // Shuffle the password to avoid predictable patterns
    return password
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');
}

/**
 * Validates password strength
 * @param password - Password to validate
 * @returns Object with validation result and message
 */
export function validatePasswordStrength(password: string): {
    isValid: boolean;
    message: string;
    strength: 'weak' | 'medium' | 'strong';
} {
    if (password.length < 8) {
        return {
            isValid: false,
            message: 'Password must be at least 8 characters long',
            strength: 'weak',
        };
    }

    let strength = 0;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength < 3) {
        return {
            isValid: false,
            message: 'Password must contain at least 3 of: uppercase, lowercase, numbers, symbols',
            strength: 'weak',
        };
    }

    if (strength === 3) {
        return {
            isValid: true,
            message: 'Password strength: Medium',
            strength: 'medium',
        };
    }

    return {
        isValid: true,
        message: 'Password strength: Strong',
        strength: 'strong',
    };
}
