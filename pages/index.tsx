// pages/index.tsx
import { useEffect, useState } from 'react';
import ImageGallery from '../components/ImageGallery';

export default function Home() {
  const [items, setItems] = useState<{ date: string; media: string[] }[]>([]);

  useEffect(() => {
    fetch('/api/notion')
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a: any, b: any) => {
          const [da, ma, ya] = a.date.split('/').map(Number);
          const [db, mb, yb] = b.date.split('/').map(Number);
          return new Date(yb, mb - 1, db).getTime() - new Date(ya, ma - 1, da).getTime();
        });
        setItems(sorted);
      })
      .catch(console.error);
  }, []);

  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Feed Notiongram ✨</h1>
      <ImageGallery items={items} />
    </main>
  );
}
