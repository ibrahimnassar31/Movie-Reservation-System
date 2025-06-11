import type { Metadata } from 'next';
     import './globals.css';
     import Navbar from '@/components/layout/Navbar';
     import Footer from '@/components/layout/Footer';
     import {Providers} from './providers';
     import { cn } from '@/lib/utils/cn';

     export const metadata: Metadata = {
       title: 'MovieSystem',
       description: 'احجز تذكرة فيلمك بسهولة عبر الإنترنت',
     };

     export default function RootLayout({ children }: { children: React.ReactNode }) {
       return (
         <html lang="ar" dir="rtl">
           <head>
             <link rel="preconnect" href="/fonts" />
           </head>
           <body className={cn('flex flex-col min-h-screen')}>
             <Providers>
               <Navbar />
               <main className="flex-grow container mx-auto p-4">{children}</main>
               <Footer />
             </Providers>
           </body>
         </html>
       );
     }
