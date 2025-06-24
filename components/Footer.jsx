'use client'
import { MapPin, Mail, Phone, Facebook, Instagram } from 'lucide-react';
import { useEffect, useState } from 'react';

const Footer = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const companyInfo = {
    name: "C2I_SHOPp",
    address: "Msaken,Sousse",
    email: "C2I_SHOP@gmail.com",
    phone: "+216 53 258 794",
    facebook: "https://facebook.com/C2I_SHOP",
    instagram: "https://instagram.com/C2I_SHOP",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.396239730903!2d10.5886279!3d35.7458556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fdf5de04d0f0b5%3A0xe83f14e17f2a3802!2sC2I!5e0!3m2!1sfr!2stn!4v1714920000000!5m2!1sfr!2stn",
    mapLinkUrl: "https://www.google.com/maps/place/C2I/@35.7458556,10.5886279,17z/data=!3m1!4b1!4m6!3m5!1s0x12fdf5de04d0f0b5:0xe83f14e17f2a3802!8m2!3d35.7458556!4d10.5886279!16s%2Fg%2F11rcrfcy6l?entry=ttu"
  };

  return (
    <footer className="bg-teal-500 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side - Logo and contact info */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{companyInfo.name}</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mt-0.5 mr-3 text-white" />
              <a
                href={companyInfo.mapLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-900 transition-colors"
              >
                {companyInfo.address}
              </a>
            </div>

            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-3 text-white" />
              <a
                href={`mailto:${companyInfo.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-900 transition-colors"
              >
                {companyInfo.email}
              </a>
            </div>

            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-3 text-white" />
              <a
                href={`tel:${companyInfo.phone.replace(/\s/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-900 transition-colors"
              >
                {companyInfo.phone}
              </a>
            </div>

            <div className="flex items-center space-x-4 pt-2">
              <a
                href={companyInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-900 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href={companyInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-900 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Right side - Map */}
        <div className="h-64 md:h-auto rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
          {isClient ? (
            <iframe
              src={companyInfo.mapEmbedUrl}
              width="100%"
              height="100%"
              className="border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localisation de C2I_SHOP sur Google Maps"
            />
          ) : (
            <div className="text-center p-4">
              <MapPin className="h-12 w-12 mx-auto text-blue-400 mb-2" />
              <p className="text-lg font-medium">Carte de localisation</p>
              <p className="text-sm text-gray-300 mt-1">Chargement...</p>
            </div>
          )}
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 pt-6 border-t border-teal-400 text-center text-white text-sm">
        © {new Date().getFullYear()} {companyInfo.name}. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;