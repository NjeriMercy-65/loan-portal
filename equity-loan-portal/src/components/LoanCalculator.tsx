// components/LoanCalculator.tsx
import { useState, useEffect, useMemo } from 'react';
import { Calculator, TrendingUp, Clock } from 'lucide-react';
import { debounce } from 'lodash';
import './BankingComponents.css'

export function LoanCalculator() {
    const [amount, setAmount] = useState(50000);
    const [tenure, setTenure] = useState(12);
    const [interestRate, setInterestRate] = useState(12.5); // Equity's base rate
    const [monthlyPayment, setMonthlyPayment] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);

    // Fetch current Equity rates (simulated API)
    useEffect(() => {
        const fetchRates = async () => {
            // Simulate API call
            const rates = await Promise.resolve({
                baseRate: 12.5,
                processingFee: 0.03, // 3%
                insuranceRate: 0.001, // 0.1% per month
            });
            setInterestRate(rates.baseRate);
        };
        fetchRates();
    }, []);

    const calculateLoan = useMemo(() => debounce((principal: number, months: number, annualRate: number) => {
        const monthlyRate = annualRate / 100 / 12;
        const processingFee = principal * 0.03;
        const insurance = principal * 0.001 * months;

        const totalPrincipal = principal + processingFee + insurance;

        // EMI formula
        const emi = totalPrincipal *
            (monthlyRate * Math.pow(1 + monthlyRate, months)) /
            (Math.pow(1 + monthlyRate, months) - 1);

        setMonthlyPayment(Math.round(emi));
        setTotalInterest(Math.round((emi * months) - totalPrincipal));
    }, 300), []) as unknown as ((p: number, m: number, a: number) => void) & { cancel?: () => void };

    useEffect(() => {
        calculateLoan(amount, tenure, interestRate);
    }, [amount, tenure, interestRate, calculateLoan]);

    // cleanup debounce on unmount
    useEffect(() => {
        return () => {
            calculateLoan.cancel?.()
        }
    }, [calculateLoan])

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-6 h-6 text-red-700" />
                <h3 className="text-lg font-bold text-gray-900">Loan Calculator</h3>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loan Amount (KES)
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">KES</span>
                        <input
                            type="range"
                            min="5000"
                            max="5000000"
                            step="1000"
                            value={amount}
                            aria-label="Loan amount"
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>5,000</span>
                            <span className="font-bold text-red-700 text-lg">
                                {amount.toLocaleString('en-KE')}
                            </span>
                            <span>5M</span>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tenure (Months)
                    </label>
                    <div className="flex gap-4">
                        {[3, 6, 12, 24, 36, 48, 60].map((month) => (
                            <button
                                key={month}
                                onClick={() => setTenure(month)}
                                className={`px-4 py-2 rounded-lg transition-colors ${tenure === month
                                    ? 'bg-red-700 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {month}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                <div className="space-y-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">Monthly Payment:</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900">
                            KES {monthlyPayment.toLocaleString('en-KE')}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">Total Interest:</span>
                        </div>
                        <span className="text-lg font-semibold text-gray-700">
                            KES {totalInterest.toLocaleString('en-KE')}
                        </span>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                        <p>• Interest Rate: {interestRate}% p.a.</p>
                        <p>• Processing Fee: 3% of loan amount</p>
                        <p>• Credit Life Insurance: 0.1% per month</p>
                        <p className="text-green-600 font-medium">
                            ✓ No hidden charges
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}