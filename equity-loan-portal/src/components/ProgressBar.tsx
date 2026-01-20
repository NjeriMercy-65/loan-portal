import React from 'react'
import { CheckCircle } from 'lucide-react'
import './BankingComponents.css'

interface Step {
    number: number
    title: string
}

interface ProgressBarProps {
    steps: Step[]
    currentStep: number
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
    return (
        <div className="w-full">
            {/* Desktop Progress Bar */}
            <div className="hidden md:block">
                <div className="flex justify-between relative">
                    {/* Progress Line */}
                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
                    <div
                        className="absolute top-4 left-0 h-0.5 bg-equity-red-600 -z-10 transition-all duration-500"
                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    />

                    {/* Steps */}
                    {steps.map((step) => {
                        const isCompleted = step.number < currentStep
                        const isCurrent = step.number === currentStep
                        const isUpcoming = step.number > currentStep

                        return (
                            <div key={step.number} className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                  ${isCompleted ? 'bg-equity-red-600' : ''}
                  ${isCurrent ? 'bg-equity-red-600 ring-4 ring-equity-red-200' : ''}
                  ${isUpcoming ? 'bg-gray-200' : ''}
                `}>
                                    {isCompleted ? (
                                        <CheckCircle className="w-5 h-5 text-white" />
                                    ) : (
                                        <span className={`font-semibold ${isCurrent ? 'text-white' : 'text-gray-600'}`}>
                                            {step.number}
                                        </span>
                                    )}
                                </div>
                                <span className={`text-xs font-medium whitespace-nowrap
                  ${isCompleted || isCurrent ? 'text-equity-red-700' : 'text-gray-500'}
                `}>
                                    {step.title}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Mobile Progress Bar */}
            <div className="md:hidden">
                <div className="flex items-center justify-between">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-equity-red-600 transition-all duration-500"
                            style={{ width: `${(currentStep / steps.length) * 100}%` }}
                        />
                    </div>
                    <div className="ml-4 text-sm font-medium text-equity-red-700">
                        Step {currentStep} of {steps.length}
                    </div>
                </div>
            </div>
        </div>
    )
}