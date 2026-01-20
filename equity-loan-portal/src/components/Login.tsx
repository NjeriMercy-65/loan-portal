import React, { useState } from 'react'

interface LoginProps {
    onLogin: (user: { email: string }) => void
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Simulate auth call
        await new Promise((r) => setTimeout(r, 700))
        setLoading(false)
        // very small demo auth: accept any non-empty email/password
        if (email && password) {
            onLogin({ email })
        } else {
            alert('Please enter email and password')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold">Sign in to Equity Loan Portal</h2>
                    <p className="text-sm text-gray-600 mt-2">Securely access your loan application</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            aria-label="Email address"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-equity-red-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            aria-label="Password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-equity-red-500 outline-none"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="inline-flex items-center text-sm text-gray-600">
                            <input type="checkbox" className="mr-2" /> Remember me
                        </label>
                        <a href="#" className="text-sm text-equity-red-600 hover:text-equity-red-800">Forgot?</a>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-gradient-to-r from-equity-red-500 to-equity-red-600 text-white rounded-md hover:from-equity-red-600 hover:to-equity-red-700 transition-colors font-medium"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>

                <p className="text-center text-xs text-gray-500 mt-4">
                    This is a demo login. Any credentials will work.
                </p>
            </div>
        </div>
    )
}

export default Login
