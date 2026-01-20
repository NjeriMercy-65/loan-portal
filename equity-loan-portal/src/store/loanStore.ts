import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { LoanApplication } from '../validation/schemas'

interface LoanStore {
    // Application state
    step: number
    personalDetails: LoanApplication['personalDetails']
    loanDetails: LoanApplication['loanDetails']
    employmentDetails: LoanApplication['employmentDetails']
    documents: {
        idFront: File | null
        idBack: File | null
        payslip: File | null
        residence: File | null
        statement: File | null
    }

    // Actions
    setStep: (step: number) => void
    updatePersonalDetails: (details: Partial<LoanApplication['personalDetails']>) => void
    updateLoanDetails: (details: Partial<LoanApplication['loanDetails']>) => void
    updateEmploymentDetails: (details: Partial<LoanApplication['employmentDetails']>) => void
    updateDocuments: (documents: Partial<LoanStore['documents']>) => void
    clearStore: () => void

    // Metadata
    applicationId: string
    createdAt: Date
    lastModified: Date
    sessionId: string
}

const initialDocuments = {
    idFront: null,
    idBack: null,
    payslip: null,
    residence: null,
    statement: null,
}

export const useLoanStore = create<LoanStore>()(
    persist(
        (set) => ({
            // Initial state
            step: 1,
            personalDetails: {
                fullName: '',
                idNumber: '',
                dateOfBirth: '',
                phoneNumber: '',
                email: '',
                existingCustomer: false,
            },
            loanDetails: {
                amount: 50000,
                tenure: 12,
                purpose: '',
                additionalInfo: '',
            },
            employmentDetails: {
                employmentType: '',
                employer: '',
                jobTitle: '',
                monthlyIncome: 0,
                durationYears: 0,
                durationMonths: 0,
                payrollAccount: '',
            },
            documents: initialDocuments,

            // Metadata
            applicationId: crypto.randomUUID(),
            createdAt: new Date(),
            lastModified: new Date(),
            sessionId: crypto.randomUUID(),

            // Actions
            setStep: (step) => set({
                step,
                lastModified: new Date()
            }),

            updatePersonalDetails: (details) => set((state) => ({
                personalDetails: { ...state.personalDetails, ...details },
                lastModified: new Date()
            })),

            updateLoanDetails: (details) => set((state) => ({
                loanDetails: { ...state.loanDetails, ...details },
                lastModified: new Date()
            })),

            updateEmploymentDetails: (details) => set((state) => ({
                employmentDetails: { ...state.employmentDetails, ...details },
                lastModified: new Date()
            })),

            updateDocuments: (documents) => set((state) => ({
                documents: { ...state.documents, ...documents },
                lastModified: new Date()
            })),

            clearStore: () => set({
                step: 1,
                personalDetails: {
                    fullName: '',
                    idNumber: '',
                    dateOfBirth: '',
                    phoneNumber: '',
                    email: '',
                    existingCustomer: false,
                },
                loanDetails: {
                    amount: 50000,
                    tenure: 12,
                    purpose: '',
                    additionalInfo: '',
                },
                employmentDetails: {
                    employmentType: '',
                    employer: '',
                    jobTitle: '',
                    monthlyIncome: 0,
                    durationYears: 0,
                    durationMonths: 0,
                    payrollAccount: '',
                },
                documents: initialDocuments,
                applicationId: crypto.randomUUID(),
                lastModified: new Date(),
            }),
        }),
        {
            name: 'equity-loan-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                step: state.step,
                personalDetails: state.personalDetails,
                loanDetails: state.loanDetails,
                employmentDetails: state.employmentDetails,
                applicationId: state.applicationId,
                createdAt: state.createdAt,
                lastModified: state.lastModified,
                sessionId: state.sessionId,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Re-hydrate any complex objects
                    state.lastModified = new Date(state.lastModified)
                    state.createdAt = new Date(state.createdAt)
                }
            }
        }
    )
)

// Helper functions
export const getApplicationSummary = () => {
    const state = useLoanStore.getState()

    return {
        totalSteps: 5,
        currentStep: state.step,
        completionPercentage: (state.step / 5) * 100,
        personalDetailsComplete: Object.values(state.personalDetails).every(val =>
            val !== '' && val !== false
        ),
        loanDetailsComplete: state.loanDetails.amount > 0 &&
            state.loanDetails.tenure > 0 &&
            state.loanDetails.purpose !== '',
        employmentDetailsComplete: state.employmentDetails.monthlyIncome > 15000 &&
            state.employmentDetails.employer !== '' &&
            state.employmentDetails.jobTitle !== '',
        documentsUploaded: Object.values(state.documents).filter(Boolean).length,
        timeSpent: Math.floor((new Date().getTime() - state.createdAt.getTime()) / 60000), // minutes
    }
}