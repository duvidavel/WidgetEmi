import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import PostMediaViewer from '../components/ImageGallery'; // Mantendo o nome do componente de mídia

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
        <title>Meu Feed em Grade</title>
        <meta name="description" content="Feed de posts do Notion em grade" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">Galeria de Itens</h1>
          
          {/* Container do Feed em Grade */}
          {/*
            Tailwind CSS Grid:
            - `grid`: Ativa o layout de grade.
            - `grid-cols-1`: Padrão para uma coluna em telas pequenas (mobile-first).
            - `sm:grid-cols-2`: Em telas pequenas (sm) e acima, usa 2 colunas.
            - `md:grid-cols-3`: Em telas médias (md) e acima, usa 3 colunas (máximo de 3 itens por linha visual).
            - `gap-6` ou `gap-8`: Espaçamento entre os itens da grade.
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => (
              // Card do Post na Grade
              <article key={item.id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col">
                {/* Mídia do Post (geralmente no topo para cards de grade) */}
                {item.media && item.media.length > 0 && (
                  <div className="media-container w-full aspect-square"> {/* aspect-square para manter proporção quadrada, ajuste conforme necessário */}
                    <PostMediaViewer media={item.media} />
                  </div>
                )}

                {/* Conteúdo do Card (Nome, Data, Descrição) */}
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    {item.name && <h2 className="text-lg font-semibold text-gray-800 mb-1 truncate">{item.name}</h2>}
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-3">{item.description}</p> // line-clamp para limitar linhas de descrição
                    )}
                  </div>
                  {item.date && <p className="text-xs text-gray-500 mt-2 self-start">{item.date}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;