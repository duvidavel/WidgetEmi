import React, { useEffect, useState } from 'react';
import ImageGallery from './ImageGallery';
import { getImageUrlsFromDatabase } from './getImages';

const DATABASE_ID = 'SEU_DATABASE_ID_AQUI';

const App = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    getImageUrlsFromDatabase(DATABASE_ID)
      .then(setImages)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Galeria do Notion 📸</h1>
      <ImageGallery images={images} />
    </div>
  );
};

export default App;
