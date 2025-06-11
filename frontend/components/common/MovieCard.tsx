'use client';

     import { Movie } from '@/types/movie';
     import Image from 'next/image';
     import Link from 'next/link';
     import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
     import { Button } from '@/components/ui/button';
     import { cn } from '@/lib/utils/cn';
     import { motion } from 'framer-motion';

     interface MovieCardProps {
       movie: Movie;
       index: number;
     }

     export default function MovieCard({ movie, index }: MovieCardProps) {
       return (
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: index * 0.1 }}
         >
           <Card className={cn('h-full flex flex-col')}>
             <CardHeader>
               <CardTitle className="text-lg font-semibold">{movie.title}</CardTitle>
             </CardHeader>
             <CardContent className="flex-grow">
               <Image
                 src={movie.poster_url || '/images/placeholder.png'}
                 alt={movie.title}
                 width={300}
                 height={450}
                 className="w-full h-auto rounded-md object-cover"
                 loading="lazy"
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               />
               <p className="mt-2 text-sm text-gray-400 line-clamp-3">{movie.description}</p>
             </CardContent>
             <CardFooter>
               <Link href={`/movies/${movie.id}`} className="w-full">
                 <Button className="w-full bg-secondary hover:bg-red-700">
                   عرض التفاصيل
                 </Button>
               </Link>
             </CardFooter>
           </Card>
         </motion.div>
       );
     }