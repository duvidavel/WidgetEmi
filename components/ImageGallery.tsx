import React, { useState } from "react";

type Props = {
  items: {
    date: string;
    media: string[];
  }[];
};

const ImageGallery: React.FC<Props> = ({ items }) => {
  if (!items || items.length === 0) {
    return <p className="text-center text-gray-500">Nenhuma imagem encontrada 😢</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <ImageCard key={index} media={item.media} date={item.date} />
      ))}
    </div>
  );
};

const ImageCard: React.FC<{ media: string[]; date: string }> = ({ media, date }) => {
  const [current, setCurrent] = useState(0);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 group">
      <img
        src={media[current]}
        alt={`Imagem ${current + 1} de ${media.length} - ${date}`}
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
      />
      
      {media.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white text-sm p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            ◀
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white text-sm p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            ▶
          </button>
        </>
      )}

      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 via-black/30 to-transparent text-white text-xs px-2 py-1 text-center">
        {date}
      </div>
    </div>
  );
};

export default ImageGallery;
