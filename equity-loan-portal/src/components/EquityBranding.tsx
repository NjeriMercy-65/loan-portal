import React from 'react'
import { Building2, Shield, Smartphone, Zap, Clock, Users, Award, Globe } from 'lucide-react'
import './BankingComponents.css'

export const EquityBranding: React.FC = () => {
    const stats = [
        { value: '4.8M+', label: 'Happy Customers' },
        { value: 'KES 1.2T+', label: 'Loans Disbursed' },
        { value: '200+', label: 'Branches' },
        { value: '99.7%', label: 'Digital Uptime' },
    ]

    const features = [
        {
            icon: Clock,
            title: 'Quick Approval',
            description: 'Get pre-approved in minutes, not days'
        },
        {
            icon: Shield,
            title: 'Bank-Grade Security',
            description: '256-bit encryption & secure document handling'
        },
        {
            icon: Smartphone,
            title: 'Mobile-First',
            description: 'Optimized for Equity Mobile Banking users'
        },
        {
            icon: Zap,
            title: 'Instant Disbursement',
            description: 'Funds transferred to your account instantly'
        },
        {
            icon: Users,
            title: 'Dedicated Support',
            description: '24/7 customer service & loan officers'
        },
        {
            icon: Award,
            title: 'Award Winning',
            description: 'Best Digital Bank in Kenya 2024'
        },
    ]

    return (
        <div className="bg-equity-red-600 text-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                        <Building2 className="w-10 h-10 text-equity-red-700" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold">Equity Bank Loan Portal</h2>
                        <p className="text-equity-red-100">Digital-First Banking Experience</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <p className="text-2xl font-bold mb-1">{stat.value}</p>
                            <p className="text-sm text-equity-red-200">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">{feature.title}</h4>
                                    <p className="text-sm text-equity-red-100">{feature.description}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Trust Badges */}
                <div className="pt-6 border-t border-white/20">
                    <p className="text-sm text-equity-red-200 mb-4 flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Trusted by Equity Partners Worldwide:
                    </p>
                    <div className="flex flex-wrap gap-6 opacity-90">
                        <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
                            <span className="font-medium">VISA</span>
                        </div>
                        <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
                            <span className="font-medium">Mastercard</span>
                        </div>
                        <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
                            <span className="font-medium">SWIFT</span>
                        </div>
                        <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
                            <span className="font-medium">KBA</span>
                        </div>
                        <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
                            <span className="font-medium">CBK Licensed</span>
                        </div>
                        <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
                            <span className="font-medium">ISO 27001</span>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-6 p-4 bg-white/5 rounded-lg">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <p className="font-bold">Ready to Transform Your Life?</p>
                            <p className="text-sm text-equity-red-100">Apply now and get up to KES 5,000,000</p>
                        </div>
                        <button
                            className="px-5 py-2 bg-gradient-to-r from-equity-red-500 to-equity-red-600 text-white font-bold rounded-md hover:from-equity-red-600 hover:to-equity-red-700 transition-colors shadow"
                            onClick={() => {
                                // Demo flow: set a demo user and reload so App shows the portal
                                try {
                                    localStorage.setItem('demo_user', JSON.stringify({ email: 'demo@equity.test' }))
                                    window.location.reload()
                                } catch (e) {
                                    console.error(e)
                                }
                            }}
                        >
                            Start Application
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}