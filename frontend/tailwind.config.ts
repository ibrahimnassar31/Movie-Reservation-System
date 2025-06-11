import type { Config } from 'tailwindcss';

     const config: Config = {
       content: [
         './app/**/*.{js,ts,jsx,tsx,mdx}',
         './components/**/*.{js,ts,jsx,tsx,mdx}',
       ],
       theme: {
         extend: {
           colors: {
             primary: '#0f172a', 
             secondary: '#dc2626', 
             accent: '#f1f5f9', 
             background: '#1e293b', 
           },
           fontFamily: {
             sans: ['Inter', 'sans-serif'],
           },
           animation: {
             'fade-in': 'fadeIn 0.5s ease-in-out',
           },
           keyframes: {
             fadeIn: {
               '0%': { opacity: '0' },
               '100%': { opacity: '1' },
             },
           },
         },
       },
       plugins: [],
     };

     export default config;