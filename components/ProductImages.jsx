'use client';

import { useState } from 'react';

export default function ProductImages({ images }) {
  const getFullUrl = (path) => `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  const [selectedImage, setSelectedImage] = useState(getFullUrl(images[0]));
  const thumbnails = images.slice(0, 5);

  return (
    <div>
     <img
  src={selectedImage}
  alt="Selected Product"
  className="w-full h-[400px] object-contain  rounded-lg  mb-4 transition duration-300 bg-white"
/>

      <div className="flex gap-4 py-4 justify-center overflow-x-auto">
        {thumbnails.map((src, index) => {
          const fullUrl = getFullUrl(src);
          return (
            <img
              key={index}
              src={fullUrl}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => setSelectedImage(fullUrl)}
              className={`size-16 sm:size-20 object-cover rounded-md cursor-pointer transition-opacity duration-300 ${
                selectedImage === fullUrl
                  ? 'opacity-100 border-2 border-teal-500'
                  : 'opacity-60 hover:opacity-100'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
