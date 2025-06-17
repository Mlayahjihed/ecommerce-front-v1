import React from 'react';
import Panner from '@/images/banner.png';


import Image from 'next/image';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
function Banner() {
    // Tableau de 5 images différentes (remplacez par vos propres images)
    const images = [
        Panner,
        Panner,
        Panner,
        Panner,
       Panner
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        appendDots: dots => (
            <div style={{ 
                position: 'absolute',
                top: '1px', // Décale légèrement vers le haut
                width: '100%',
                textAlign: 'center'
            }}>
                <ul style={{ 
                    margin: 0,
                    padding: 0,
                    display: 'inline-block'
                }}>{dots}</ul>
            </div>
        )
    };

    return (
        <div className="px-6 relative"> {/* Ajout de relative pour positionner les dots */}
            <div className="w-full border p-4 rounded-lg mt-6">
                <Slider {...settings}>
                    {images.map((image, index) => (
                        <div key={index} className="relative h-64 md:h-96"> {/* Taille ajustable */}
                            <Image
                                src={image}
                                alt={`Banner ${index + 1}`}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg"
                                priority={index === 0} // Priorité pour la première image
                            />
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}

export default Banner;
