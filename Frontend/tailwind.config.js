export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
    ],
    theme: {
        extend: {
            colors: {
                primary: '#99eb73',
                secondary: '#CAE8BD',
                neutral100: '#FFFFFF',
                neutral900: '#111827',
                neutral500: '#6B7280',
                success: '#10B981',
                error: '#EF4444',
                warning: '#FBBF24',
                neutral: '#ECFAE5',
                bg: '#f1f4fb'
            },
        },
    },
    plugins: [
    ],
  }