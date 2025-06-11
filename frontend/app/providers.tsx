'use client';

     import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
     import { Provider } from 'react-redux';
     import { store } from '@/lib/redux/store';
     import { ReactNode, useState } from 'react';

     export function Providers({ children }: { children: ReactNode }) {
       const [queryClient] = useState(
         () =>
           new QueryClient({
             defaultOptions: {
               queries: {
                 staleTime: 5 * 60 * 1000, // 5 دقائق
                 gcTime: 10 * 60 * 1000, // 10 دقائق
                 retry: 2,
               },
             },
           }),
       );

       return (
         <Provider store={store}>
           <QueryClientProvider client={queryClient}>
             {children}
           </QueryClientProvider>
         </Provider>
       );
     }