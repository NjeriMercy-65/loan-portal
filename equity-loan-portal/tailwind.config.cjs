/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx,html}'
    ],
    theme: {
        extend: {
            colors: {
                // Provide a minimal shade scale so Tailwind utilities like `bg-equity-red-600` and `ring-equity-red-500` are generated.
                'equity-red': {
                    400: 'var(--equity-red-light)',
                    500: 'var(--equity-red)',
                    600: 'var(--equity-red-dark)'
                },
                'equity-blue': {
                    400: 'var(--equity-blue-light)',
                    500: 'var(--equity-blue)',
                    600: 'var(--equity-blue-dark)'
                },
                'equity-green': {
                    500: 'var(--equity-green)'
                }
            },
            fontFamily: {
                // Modern bank defaults: Inter for body, Poppins for display/headings
                sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
                display: ['Poppins', 'Inter', 'system-ui'],
                mono: ['SFMono-Regular', 'Menlo', 'monospace']
            }
        }
    },
    plugins: []
}
