import { useState, useEffect } from 'react'
import { useLoanStore } from './store/loanStore'
import { LoanForm } from './components/LoanForm'
import { LoanCalculator } from './components/LoanCalculator'
import { EquityBranding } from './components/EquityBranding'
import { ProgressBar } from './components/ProgressBar'
import { Shield, Smartphone, Clock, CheckCircle } from 'lucide-react'
import Login from './components/Login'

import './styles/globals.css';
import './components/BankingComponents.css';

import './index.css'

function App() {
  const { step, clearStore } = useLoanStore()
  const [isMobile, setIsMobile] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('demo_user'))

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const steps = [
    { number: 1, title: 'Personal Details' },
    { number: 2, title: 'Loan Details' },
    { number: 3, title: 'Employment' },
    { number: 4, title: 'Documents' },
    { number: 5, title: 'Review & Submit' },
  ]

  if (!isAuthenticated) {
    return (
      <Login
        onLogin={(user) => {
          localStorage.setItem('demo_user', JSON.stringify(user))
          setIsAuthenticated(true)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-equity-red-600 to-equity-blue-500 text-white shadow sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center shadow-sm">
                <span className="text-equity-red-600 font-bold text-xl">E</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Equity Bank</h1>
                <p className="text-xs text-equity-red-100">Loan Application Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>Quick Apply • 5 min</span>
              </div>
              <button
                onClick={() => clearStore()}
                className="px-4 py-2 text-sm bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                Start New
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="pb-2">
            <ProgressBar steps={steps} currentStep={step} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-8">
            <EquityBranding />

            {/* Mobile Steps Indicator */}
            {isMobile && (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-800">Step {step} of 5</h3>
                    <p className="text-sm text-gray-600">{steps[step - 1]?.title}</p>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div
                        key={s}
                        className={`w-2 h-2 rounded-full ${s <= step ? 'bg-equity-red-600' : 'bg-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <LoanForm />
            </div>

            {/* Security Assurance */}
            <div className="bg-gradient-to-r from-equity-blue-50 to-white rounded-xl p-6 border border-equity-blue-100">
              <div className="flex items-center gap-4">
                <Shield className="w-8 h-8 text-equity-blue-600" />
                <div>
                  <h3 className="font-bold text-gray-800">Bank-Grade Security</h3>
                  <p className="text-sm text-gray-600">
                    Your data is encrypted with 256-bit SSL and protected by Equity Bank's security infrastructure
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Calculator & Help */}
          <div className="lg:col-span-1 space-y-8">
            <LoanCalculator />

            {/* Help Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Need Help?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-equity-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-equity-red-600">📞</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Call Equity Connect</p>
                    <p className="text-xs text-gray-600">+254 763 000 000</p>
                    <p className="text-xs text-gray-500">24/7 Customer Support</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-equity-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-equity-red-600">🏦</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Visit Branch</p>
                    <p className="text-xs text-gray-600">Find nearest Equity branch</p>
                    <button className="text-xs text-equity-red-600 font-medium hover:text-equity-red-800 mt-1">
                      Locate Branch →
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-equity-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-equity-red-600">💬</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Live Chat</p>
                    <p className="text-xs text-gray-600">Chat with a loan officer</p>
                    <button className="text-xs text-equity-red-600 font-medium hover:text-equity-red-800 mt-1">
                      Start Chat →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="font-bold text-gray-800">Tips for Faster Approval</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span>Ensure all documents are clear and readable</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span>Provide accurate employment information</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span>Keep your Equity account active for 3+ months</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span>Maintain a good credit score with CRB</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">Equity Bank</h4>
              <p className="text-gray-400 text-sm">
                Transforming lives, giving dignity, and expanding opportunities for wealth creation.
              </p>
            </div>

            <div>
              <h5 className="font-bold mb-4">Products</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Personal Loans</a></li>
                <li><a href="#" className="hover:text-white">Business Loans</a></li>
                <li><a href="#" className="hover:text-white">Asset Finance</a></li>
                <li><a href="#" className="hover:text-white">Mortgages</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-4">Resources</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Loan Calculator</a></li>
                <li><a href="#" className="hover:text-white">Interest Rates</a></li>
                <li><a href="#" className="hover:text-white">FAQs</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
                <li><a href="#" className="hover:text-white">Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} Equity Bank Limited. All rights reserved.
              </p>

              <div className="flex items-center gap-6">
                <span className="text-xs text-gray-500">Licensed by Central Bank of Kenya</span>
                <div className="flex gap-4">
                  <span className="text-xs">VISA</span>
                  <span className="text-xs">Mastercard</span>
                  <span className="text-xs">KBA</span>
                </div>
              </div>
            </div>

            <p className="text-center text-gray-500 text-xs mt-6">
              This is a demonstration application for recruitment purposes. Not an official Equity Bank product.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
