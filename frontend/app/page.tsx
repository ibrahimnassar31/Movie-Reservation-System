'use client';

     import MovieCard from '@/components/common/MovieCard';
     import { useFeaturedMovies } from '@/lib/hooks/useMovies';
     import { cn } from '@/lib/utils/cn';
     import   { Movie } from '@/types/movie';

     export default function HomePage() {
       const { data: movies = [], isLoading, error } = useFeaturedMovies();

       return (
         <div className={cn('py-8')}>
           <h1 className="text-3xl font-bold mb-6 text-center text-accent">
             الأفلام المميزة
           </h1>
           {isLoading ? (
             <p className="text-center text-accent">جاري التحميل...</p>
           ) : error ? (
             <div className="text-center">
               <p className="text-red-400 mb-2">
                 تعذر جلب الأفلام من الخادم، عرض أفلام مميزة بديلة:
               </p>
             </div>
           ) : null}
           {movies.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {movies.map((movie: Movie, index: number) => (
                 <MovieCard key={movie.id} movie={movie} index={index} />
               ))}
             </div>
           ) : !isLoading && !error ? (
             <p className="text-center text-accent">لا توجد أفلام متاحة حالياً.</p>
           ) : null}
         </div>
       );
     }