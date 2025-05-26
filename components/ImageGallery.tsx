// components/ImageGallery.tsx

import React, { useState } from 'react';

type PostMediaViewerProps = {
  media: string[];
  // A 'date' pode ser opcional se você for exibi-la em outro lugar no card do post
  // date?: string; 
};

const PostMediaViewer: React.FC<PostMediaViewerProps> = ({ media /*, date */ }) => {
  const [current, setCurrent] = useState(0);

  if (!media || media.length === 0) {
    // Você pode retornar null ou um placeholder se preferir não mostrar texto aqui
    // já que a ausência de mídia pode ser tratada em pages/index.tsx
    return null; 
  }

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  return (
    // Container da galeria para um post
    <div className="relative group w-full bg-gray-200"> {/* Adicionado bg-gray-200 para placeholder visual */}
      <img
        src={media[current]}
        alt={`Imagem ${current + 1} de ${media.length}`}
        // Ajuste de classes para uma imagem de post de feed (responsiva, pode ter altura máxima)
        className="w-full h-auto max-h-[70vh] object-contain md:object-cover" // object-contain para ver toda imagem, object-cover para preencher
      />

      {media.length > 1 && (
        <>
          {/* Botão Anterior */}
          {current > 0 && ( // Mostrar apenas se não for a primeira imagem
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 focus:outline-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
              aria-label="Imagem anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Botão Próximo */}
          {current < media.length - 1 && ( // Mostrar apenas se não for a última imagem
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 focus:outline-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
              aria-label="Próxima imagem"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Indicadores de Bolinha (Dots) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {media.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === current ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Ir para imagem ${index + 1}`}
              ></button>
            ))}
          </div>
        </>
      )}
      
      {/* A data (date) foi removida daqui para ser exibida no corpo do post em pages/index.tsx */}
      {/* Se quiser a data sobreposta na imagem, pode adicionar aqui:
      {date && (
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent p-2">
          <p className="text-white text-xs font-semibold">{date}</p>
        </div>
      )}
      */}
    </div>
  );
};

export default PostMediaViewer; // Exportando com um nome que reflete sua função no post