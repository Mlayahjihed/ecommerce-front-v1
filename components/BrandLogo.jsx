// components/BrandLogo.jsx
export default function BrandLogo({ logoUrl, brandName }) {
  if (!logoUrl) return null;

  return (
    <div className="flex items-center gap-1 p-2">
      <div className="text-sm text-gray-500"></div>
      <div className="relative w-16 h-16">
        <img
          src={logoUrl}
          alt={`Logo  'de la marque'}`}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}