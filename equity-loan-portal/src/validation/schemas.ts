// validation/schemas.ts
import { z } from 'zod';

// Kenyan National ID validation
const kenyanIdSchema = z.string()
    .min(7, 'ID must be at least 7 digits')
    .max(8, 'ID must be at most 8 digits')
    .regex(/^\d+$/, 'ID must contain only numbers')
    .refine((id) => {
        // Luhn algorithm for ID validation (Kenyan IDs have checksum)
        const digits = id.split('').map(Number);
        let sum = 0;
        let isSecond = false;

        for (let i = digits.length - 1; i >= 0; i--) {
            let digit = digits[i];
            if (isSecond) digit = digit * 2;
            sum += Math.floor(digit / 10) + (digit % 10);
            isSecond = !isSecond;
        }
        return sum % 10 === 0;
    }, 'Invalid Kenyan ID number');

// Kenyan phone number validation
const kenyanPhoneSchema = z.string()
    .regex(/^(?:254|\+254|0)?(7[0-9]{8})$/, 'Invalid Kenyan phone number')
    .transform((phone) => {
        // Normalize to +254 format
        if (phone.startsWith('0')) return `+254${phone.slice(1)}`;
        if (phone.startsWith('254')) return `+${phone}`;
        if (!phone.startsWith('+')) return `+${phone}`;
        return phone;
    });

// Equity-specific loan validation
export const loanSchema = z.object({
    personalDetails: z.object({
        fullName: z.string().min(3).regex(/^[a-zA-Z\s]+$/, 'Only letters allowed'),
        idNumber: kenyanIdSchema,
        // Date of birth comes from an <input type="date"> which returns a string.
        // Accept strings here and validate/normalize them.
        dateOfBirth: z.string().refine((val) => {
            const d = new Date(val);
            if (Number.isNaN(d.getTime())) return false;
            const age = new Date().getFullYear() - d.getFullYear();
            return age >= 18 && age <= 65;
        }, 'You must be 18-65 years old'),
        phoneNumber: kenyanPhoneSchema,
        email: z.string().email(),
        existingCustomer: z.boolean().default(false),
    }),
    loanDetails: z.object({
        amount: z.number()
            .min(5000, 'Minimum loan is 5,000 KES')
            .max(5000000, 'Maximum loan is 5,000,000 KES')
            .multipleOf(100, 'Amount must be in multiples of 100'),
        tenure: z.number()
            .min(3, 'Minimum 3 months')
            .max(60, 'Maximum 60 months'),
        purpose: z.enum([
            'BUSINESS',
            'EDUCATION',
            'HOME_IMPROVEMENT',
            'MEDICAL',
            'VEHICLE',
            'OTHER'
        ]).or(z.string()),
        additionalInfo: z.string().optional().default(''),
    }),
    employmentDetails: z.object({
        employer: z.string().min(0).optional().default(''),
        employerCode: z.string().optional(), // For Equity payroll customers
        monthlyIncome: z.number().min(0).optional().default(0),
        // Older schema used employmentDuration; UI uses durationYears/durationMonths
        durationYears: z.number().optional().default(0),
        durationMonths: z.number().optional().default(0),
        jobTitle: z.string().optional().default(''),
        employmentType: z.string().optional().default(''),
        payrollAccount: z.string().optional().default(''),
    }),
});

// Export a TypeScript type for use across the app
export type LoanApplication = z.infer<typeof loanSchema>;