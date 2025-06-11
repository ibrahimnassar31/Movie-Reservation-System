import { cn } from '@/lib/utils/cn';

     export default function Footer() {
       return (
         <footer className={cn('bg-primary text-accent py-4 mt-auto')}>
           <div className="container mx-auto px-4 text-center">
             <p>© {new Date().getFullYear()} MovieSystem. جميع الحقوق محفوظة.</p>
           </div>
         </footer>
       );
     }