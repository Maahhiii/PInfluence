import React from 'react';

const ImageGrid = ({ images }) => {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-4">
      {images.map((image, index) => (
        <div key={index} className="mb-4 break-inside-avoid">
          <img
            src={image.src}
            alt={image.alt}
            className="w-full rounded-lg shadow-md hover:opacity-90 transition duration-300"
          />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
