import React from 'react'
import { useForm, type FieldPath, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLoanStore } from '../store/loanStore'
import { loanSchema } from '../validation/schemas'
import type { LoanApplication } from '../validation/schemas'
import { ArrowRight, ArrowLeft, Save } from 'lucide-react'
import { DocumentUpload } from './DocumentUpload'
import './BankingComponents.css'

export const LoanForm: React.FC = () => {
    const {
        step,
        setStep,
        personalDetails,
        loanDetails,
        employmentDetails,
        updatePersonalDetails,
        updateLoanDetails,
        updateEmploymentDetails
    } = useLoanStore()

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    watch,
    trigger,
    setValue
    } = useForm<LoanApplication>({
        resolver: zodResolver(loanSchema) as unknown as Resolver<LoanApplication>,
        mode: 'onChange',
        defaultValues: {
            personalDetails,
            loanDetails,
            employmentDetails
        }
    })

    const loanAmount = watch('loanDetails.amount')
    const tenure = watch('loanDetails.tenure')

    const handleNext = async () => {
        const fields = getStepFields(step)
        const isValidStep = await trigger(fields as FieldPath<LoanApplication>[])

        if (isValidStep) {
            setStep(step + 1)
        }
    }

    const handlePrevious = () => {
        setStep(step - 1)
    }

    const onSubmit = (data: LoanApplication) => {
        updatePersonalDetails(data.personalDetails)
        updateLoanDetails(data.loanDetails)
        updateEmploymentDetails(data.employmentDetails)

        // In real app, submit to API
        console.log('Submitting application:', data)
        alert('Application submitted successfully!')
        setStep(5)
    }

    const getStepFields = (stepNumber: number): string[] => {
        switch (stepNumber) {
            case 1: return ['personalDetails']
            case 2: return ['loanDetails']
            case 3: return ['employmentDetails']
            default: return []
        }
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6 animate-slide-up">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Personal Information</h3>
                            <p className="text-gray-600">Tell us about yourself</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    {...register('personalDetails.fullName')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-equity-red-500 focus:border-transparent outline-none transition"
                                    placeholder="John Kamau"
                                />
                                {errors.personalDetails?.fullName && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.personalDetails.fullName.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kenyan ID Number *
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    {...register('personalDetails.idNumber')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-equity-red-500 focus:border-transparent outline-none"
                                    placeholder="12345678"
                                    maxLength={8}
                                />
                                {errors.personalDetails?.idNumber && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.personalDetails.idNumber.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date of Birth *
                                </label>
                                <input
                                    type="date"
                                    {...register('personalDetails.dateOfBirth')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-equity-red-500 focus:border-transparent outline-none"
                                    max={new Date().toISOString().split('T')[0]}
                                />
                                {errors.personalDetails?.dateOfBirth && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.personalDetails.dateOfBirth.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    {...register('personalDetails.phoneNumber')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-equity-red-500 focus:border-transparent outline-none"
                                    placeholder="+254712345678"
                                />
                                {errors.personalDetails?.phoneNumber && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.personalDetails.phoneNumber.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    {...register('personalDetails.email')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-equity-red-500 focus:border-transparent outline-none"
                                    placeholder="john@example.com"
                                />
                                {errors.personalDetails?.email && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.personalDetails.email.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Are you an existing Equity customer?
                                </label>
                                <select
                                    {...register('personalDetails.existingCustomer', { setValueAs: (v) => v === 'yes' })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-equity-red-500 focus:border-transparent outline-none bg-white"
                                >
                                    <option value="">Select option</option>
                                    <option value="yes">Yes, I have an Equity account</option>
                                    <option value="no">No, I'm a new customer</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-6 animate-slide-up">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Loan Details</h3>
                            <p className="text-gray-600">Tell us about the loan you need</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Loan Amount (KES) *
                                    <span className="ml-2 text-equity-red-600 font-bold">
                                        {loanAmount?.toLocaleString('en-KE')}
                                    </span>
                                </label>
                                <input
                                    type="range"
                                    min="5000"
                                    max="5000000"
                                    step="1000"
                                    {...register('loanDetails.amount', { valueAsNumber: true })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>5,000</span>
                                    <span>2.5M</span>
                                    <span>5M</span>
                                </div>
                                {errors.loanDetails?.amount && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.loanDetails.amount.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Repayment Period (Months) *
                                    <span className="ml-2 text-equity-red-600 font-bold">
                                        {tenure} months
                                    </span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {[3, 6, 12, 24, 36, 48, 60].map((months) => (
                                        <button
                                            key={months}
                                            type="button"
                                            onClick={() => {
                                                // Keep react-hook-form state in sync and update store
                                                setValue('loanDetails.tenure', months, { shouldValidate: true, shouldDirty: true })
                                                updateLoanDetails({ tenure: months })
                                            }}
                                            className={`px-4 py-2 rounded-lg transition-colors ${tenure === months
                                                ? 'bg-gradient-to-r from-equity-red-500 to-equity-red-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {months} months
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Loan Purpose *
                                </label>
                                <select
                                    {...register('loanDetails.purpose')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-equity-red-500 focus:border-transparent outline-none bg-white"
                                >
                                    <option value="">Select purpose</option>
                                    <option value="business">Business Expansion</option>
                                    <option value="education">Education</option>
                                    <option value="medical">Medical Expenses</option>
                                    <option value="home">Home Improvement</option>
                                    <option value="vehicle">Vehicle Purchase</option>
                                    <option value="personal">Personal Use</option>
                                    <option value="debt">Debt Consolidation</option>
                                </select>
                                {errors.loanDetails?.purpose && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.loanDetails.purpose.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Information
                                </label>
                                <textarea
                                    {...register('loanDetails.additionalInfo')}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-equity-red-500 focus:border-transparent outline-none"
                                    placeholder="Tell us more about how you plan to use the loan..."
                                />
                            </div>
                        </div>
                    </div>
                )

            case 3:
                return (
                    <div className="space-y-6 animate-slide-up">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Employment & Income</h3>
                            <p className="text-gray-600">Tell us about your employment and income</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Employment Type *
                                </label>
                                <select
                                    {...register('employmentDetails.employmentType')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-equity-red-500 focus:border-transparent outline-none bg-white"
                                >
                                    <option value="">Select type</option>
                                    <option value="permanent">Permanent Employment</option>
                                    <option value="contract">Contract</option>
                                    <option value="self">Self-Employed</option>
                                    <option value="business">Business Owner</option>
                                </select>
                                {errors.employmentDetails?.employmentType && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.employmentDetails.employmentType.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Employer/Business Name *
                                </label>
                                <input
                                    type="text"
                                    {...register('employmentDetails.employer')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-equity-red-500 focus:border-transparent outline-none"
                                    placeholder="Company Name"
                                />
                                {errors.employmentDetails?.employer && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.employmentDetails.employer.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Job Title/Position *
                                </label>
                                <input
                                    type="text"
                                    {...register('employmentDetails.jobTitle')}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-equity-red-500 focus:border-transparent outline-none"
                                    placeholder="e.g., Software Engineer"
                                />
                                {errors.employmentDetails?.jobTitle && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.employmentDetails.jobTitle.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Monthly Income (KES) *
                                </label>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    {...register('employmentDetails.monthlyIncome', { valueAsNumber: true })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-equity-red-500 focus:border-transparent outline-none"
                                    placeholder="150000"
                                    min="15000"
                                />
                                {errors.employmentDetails?.monthlyIncome && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.employmentDetails.monthlyIncome.message}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Minimum income: 15,000 KES
                                </p>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Employment Duration
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Years</label>
                                        <input
                                            type="number"
                                            {...register('employmentDetails.durationYears', { valueAsNumber: true })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-equity-red-500 focus:border-transparent outline-none"
                                            placeholder="0"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Months</label>
                                        <input
                                            type="number"
                                            {...register('employmentDetails.durationMonths', { valueAsNumber: true })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-equity-red-500 focus:border-transparent outline-none"
                                            placeholder="0"
                                            min="0"
                                            max="11"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Payroll Account
                                        </label>
                                        <select
                                            {...register('employmentDetails.payrollAccount')}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-equity-red-500 focus:border-transparent outline-none bg-white"
                                        >
                                            <option value="">Select account type</option>
                                            <option value="equity">Equity Bank Account</option>
                                            <option value="other">Other Bank</option>
                                            <option value="cash">Cash Payment</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 4:
                return (
                    <div className="space-y-6 animate-slide-up">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Document Upload</h3>
                            <p className="text-gray-600">Upload required documents for verification</p>
                        </div>

                        <DocumentUpload />

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-medium text-blue-800 mb-2">Required Documents:</h4>
                            <ul className="space-y-2 text-sm text-blue-700">
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                    <span>National ID (Front & Back)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                    <span>Recent Payslip (last 3 months)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                    <span>Proof of Residence (Utility Bill)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                    <span>Bank Statement (3 months)</span>
                                </li>
                            </ul>
                        </div>

                        <div className="text-sm text-gray-600">
                            <p className="font-medium mb-1">Document Requirements:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>All documents must be clear and readable</li>
                                <li>Maximum file size: 5MB per document</li>
                                <li>Accepted formats: PDF, JPG, PNG</li>
                                <li>Documents will be securely encrypted</li>
                            </ul>
                        </div>
                    </div>
                )

            case 5:
                return (
                    <div className="space-y-6 animate-slide-up">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Review & Submit</h3>
                            <p className="text-gray-600">Review your application before submitting</p>
                        </div>

                        <div className="space-y-6">
                            {/* Personal Details Review */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-equity-red-600 rounded-full" />
                                    Personal Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Full Name</p>
                                        <p className="font-medium">{personalDetails.fullName || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">ID Number</p>
                                        <p className="font-medium">{personalDetails.idNumber || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Phone Number</p>
                                        <p className="font-medium">{personalDetails.phoneNumber || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium">{personalDetails.email || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Loan Details Review */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-equity-red-600 rounded-full" />
                                    Loan Details
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Loan Amount</p>
                                        <p className="font-medium">
                                            {loanDetails.amount ? `KES ${loanDetails.amount.toLocaleString('en-KE')}` : 'Not provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Repayment Period</p>
                                        <p className="font-medium">{loanDetails.tenure || 'Not provided'} months</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Loan Purpose</p>
                                        <p className="font-medium">{loanDetails.purpose || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Estimated Monthly Payment</p>
                                        <p className="font-medium text-equity-red-600">
                                            KES {calculateEMI(loanDetails.amount || 0, loanDetails.tenure || 12).toLocaleString('en-KE')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Employment Review */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-equity-red-600 rounded-full" />
                                    Employment Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Employment Type</p>
                                        <p className="font-medium">{employmentDetails.employmentType || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Employer</p>
                                        <p className="font-medium">{employmentDetails.employer || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Monthly Income</p>
                                        <p className="font-medium">
                                            {employmentDetails.monthlyIncome ? `KES ${employmentDetails.monthlyIncome.toLocaleString('en-KE')}` : 'Not provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Job Title</p>
                                        <p className="font-medium">{employmentDetails.jobTitle || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Terms & Conditions */}
                            <div className="border border-gray-200 rounded-lg p-6">
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        className="mt-1"
                                        required
                                    />
                                    <div>
                                        <label htmlFor="terms" className="font-medium text-gray-800">
                                            I agree to the terms and conditions
                                        </label>
                                        <p className="text-sm text-gray-600 mt-1">
                                            By submitting this application, I confirm that all information provided is accurate and complete.
                                            I authorize Equity Bank to verify the information and conduct credit reference checks with CRB.
                                            I understand that providing false information may lead to application rejection or legal action.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    const calculateEMI = (principal: number, months: number): number => {
        const monthlyRate = 0.125 / 12 // 12.5% annual rate
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) /
            (Math.pow(1 + monthlyRate, months) - 1)
        return Math.round(emi)
    }

    return (
        <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)}>
                {renderStep()}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-8 mt-8 border-t border-gray-200">
                    <div>
                        {step > 1 && step < 5 && (
                            <button
                                type="button"
                                onClick={handlePrevious}
                                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Previous
                            </button>
                        )}
                    </div>

                    <div className="flex gap-4">
                        {step < 4 && (
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={!isValid}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-equity-red-500 to-equity-red-600 text-white rounded-lg hover:from-equity-red-600 hover:to-equity-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next Step
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        )}

                        {step === 4 && (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="flex items-center gap-2 px-6 py-3 bg-equity-red-600 text-white rounded-lg hover:bg-equity-red-700 transition-colors"
                            >
                                Review Application
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        )}

                        {step === 5 && (
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Save className="w-4 h-4" />
                                Submit Application
                            </button>
                        )}

                        {/* Save Progress Button */}
                        {step < 5 && (
                            <button
                                type="button"
                                onClick={() => handleSubmit((data) => {
                                    updatePersonalDetails(data.personalDetails)
                                    updateLoanDetails(data.loanDetails)
                                    updateEmploymentDetails(data.employmentDetails)
                                    alert('Progress saved successfully!')
                                })()}
                                className="flex items-center gap-2 px-6 py-3 border border-equity-red-600 text-equity-red-600 rounded-lg hover:bg-equity-red-50 transition-colors"
                            >
                                <Save className="w-4 h-4" />
                                Save Progress
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    )
}