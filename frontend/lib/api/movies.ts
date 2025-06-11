import axios from 'axios';
export async function getFeaturedMovies() {
       const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/movies`, {
       });
       if (res.status !== 200) throw new Error('فشل جلب الأفلام');
       return res.data;
     }