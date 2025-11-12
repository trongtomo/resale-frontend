'use client'

import { useState, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs, FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'

export default function ProductImageGallery({ images, productName }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [mainSwiper, setMainSwiper] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const imageRefs = useRef({})

  const handleImageClick = (index) => {
    if (activeIndex === index) {
      setIsZoomed(!isZoomed)
    } else {
      setIsZoomed(false)
    }
  }

  const handleThumbnailClick = (index) => {
    if (mainSwiper) {
      mainSwiper.slideTo(index)
      setActiveIndex(index)
      setIsZoomed(false)
    }
  }

  return (
    <div className="product-image-gallery">
      {/* Main Image Carousel */}
      <div className="mb-3">
        <Swiper
          modules={[Navigation, Thumbs]}
          spaceBetween={10}
          navigation={images.length > 1}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          onSwiper={setMainSwiper}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.activeIndex)
            setIsZoomed(false)
          }}
          className="main-swiper rounded-lg overflow-hidden"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="aspect-square bg-gray-100 overflow-hidden">
              <div 
                className={`relative w-full h-full transition-transform duration-300 origin-center ${
                  isZoomed && activeIndex === index ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                }`}
                onClick={() => handleImageClick(index)}
                style={{ overflow: isZoomed && activeIndex === index ? 'visible' : 'hidden' }}
              >
                <img
                  src={image}
                  alt={`${productName} - Image ${index + 1}`}
                  className="w-full h-full object-cover select-none"
                  ref={(el) => (imageRefs.current[index] = el)}
                  draggable={false}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[FreeMode, Thumbs]}
          spaceBetween={8}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          className="thumbnail-swiper"
        >
          {images.map((image, index) => (
            <SwiperSlide
              key={index}
              className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                activeIndex === index
                  ? 'border-blue-500 opacity-100'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <div className="aspect-square bg-gray-100">
                <img
                  src={image}
                  alt={`${productName} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <style jsx global>{`
        .product-image-gallery .main-swiper {
          width: 100%;
        }
        
        .product-image-gallery .main-swiper .swiper-wrapper {
          overflow: visible;
        }
        
        .product-image-gallery .main-swiper .swiper-slide {
          overflow: visible;
        }
        
        .product-image-gallery .main-swiper .swiper-button-next,
        .product-image-gallery .main-swiper .swiper-button-prev {
          color: rgba(26, 24, 24, 0.8);
          background: transparent;
          width: 40px;
          height: 40px;
          transition: all 0.2s;
        }
        
        .product-image-gallery .main-swiper .swiper-button-next:after,
        .product-image-gallery .main-swiper .swiper-button-prev:after {
          font-size: 20px;
          font-weight: 700;
        }
        
        .product-image-gallery .main-swiper .swiper-button-next:hover,
        .product-image-gallery .main-swiper .swiper-button-prev:hover {
          color: white;
          transform: scale(1.2);
        }
        
        .product-image-gallery .main-swiper .swiper-button-disabled {
          opacity: 0.35;
        }
        
        .product-image-gallery .thumbnail-swiper {
          width: 100%;
        }
        
        .product-image-gallery .thumbnail-swiper .swiper-slide {
          width: auto;
        }
      `}</style>
    </div>
  )
}
