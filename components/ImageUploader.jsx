import { useState } from "react";
import { Trash } from "lucide-react";

export default function ImageUploader(props) {
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    props.setImages([...props.images, ...files]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = props.images.filter((_, i) => i !== index);
    props.setImages(updatedImages);
  };

  return (
    <div className="space-y-4">
      <label className="block text-gray-700">Images du produit</label>
      <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded-lg focus:border-teal-400 focus:bg-white focus:outline-none" />

      <div className="flex flex-wrap gap-4">
        {props.images.map((image, index) => (
          <div key={index} className="relative w-24 h-24 border rounded-lg overflow-hidden">
            <img src={URL.createObjectURL(image)} alt={`preview-${index}`} className="w-full h-full object-cover" />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-700"
            >
              <Trash className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
