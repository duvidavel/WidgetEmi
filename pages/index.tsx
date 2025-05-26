import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import PostMediaViewer from '../components/ImageGallery'; // Importando o componente refatorado

// Definindo o tipo para os itens que vêm da API
type ProcessedItem = {
  id: string;
  name: string | null;
  date: string | null;
  description: string | null;
  media: string[];
};

const Home: React.FC = () => {
  const [items, setItems] = useState<ProcessedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/notion');
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `Falha ao buscar dados: ${res.statusText}`);
        }
        const data: ProcessedItem[] = await res.json();

        const sortedData = data.sort((a, b) => {
          if (!a.date && !b.date) return 0;
          if (!a.date) return 1;
          if (!b.date) return -1;

          const datePartsA = a.date.split('/');
          const dateObjectA = new Date(
            parseInt(datePartsA[2], 10),
            parseInt(datePartsA[1], 10) - 1,
            parseInt(datePartsA[0], 10)
          );

          const datePartsB = b.date.split('/');
          const dateObjectB = new Date(
            parseInt(datePartsB[2], 10),
            parseInt(datePartsB[1], 10) - 1,
            parseInt(datePartsB[0], 10)
          );

          return dateObjectB.getTime() - dateObjectA.getTime();
        });

        setItems(sortedData);
        setError(null);
      } catch (e: any) {
        console.error("Erro ao buscar ou processar dados:", e);
        setError(e.message || 'Ocorreu um erro ao carregar os itens.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando posts...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">Erro: {error}</div>;
  }

  if (items.length === 0) {
    return <div className="flex justify-center items-center min-h-screen">Nenhum post para exibir.</div>;
  }

  return (
    <>
      <Head>
        <title>Meu Feed</title>
        <meta name="description" content="Feed de posts do Notion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Container principal da página com Tailwind */}
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">Feed</h1> */}
          
          {/* Container do Feed */}
          <div className="max-w-xl mx-auto space-y-8"> {/* Ajustado para um feed de coluna única */}
            {items.map((item) => (
              // Card do Post
              <article key={item.id} className="bg-white border border-gray-300 rounded-lg shadow-sm">
                {/* Cabeçalho do Post (Nome do item/usuário) */}
                <header className="p-4 border-b border-gray-200">
                  {item.name && <h2 className="text-sm font-semibold text-gray-800">{item.name}</h2>}
                  {/* Poderia adicionar avatar e timestamp aqui se tivesse esses dados */}
                </header>

                {/* Mídia do Post */}
                {item.media && item.media.length > 0 && (
                  <div className="media-container"> {/* Sem classes de aspect ratio por padrão, a imagem ditará */}
                    <PostMediaViewer media={item.media} />
                  </div>
                )}

                {/* Corpo do Post (Interações, Legenda, Data) */}
                <section className="p-4 space-y-2">
                  {/* Ícones de Interação (Placeholder) */}
                  {/* <div className="flex space-x-4 mb-2">
                    <button aria-label="Curtir" className="text-gray-700 hover:text-red-500">...</button>
                    <button aria-label="Comentar" className="text-gray-700 hover:text-blue-500">...</button>
                    <button aria-label="Compartilhar" className="text-gray-700 hover:text-green-500">...</button>
                  </div>
                  */}
                  
                  {/* Legenda/Descrição */}
                  {item.description && (
                    <p className="text-sm text-gray-800">
                      {/* Se o nome for o "autor" da legenda:
                      {item.name && <span className="font-semibold">{item.name}</span>}{' '}
                      */}
                      {item.description}
                    </p>
                  )}

                  {/* Data do Post */}
                  {item.date && <p className="text-xs text-gray-500 uppercase tracking-wide">{item.date}</p>}
                </section>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;