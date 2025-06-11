     'use client';

     import { useQuery } from '@tanstack/react-query';
     import { getFeaturedMovies } from '@/lib/api/movies';

     export function useFeaturedMovies() {
       return useQuery({
         queryKey: ['movies'],
         queryFn: getFeaturedMovies,
         select: (data) => data.data,
       });
     }