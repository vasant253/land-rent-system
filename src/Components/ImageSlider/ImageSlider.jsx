import React from 'react';
import 'react-slideshow-image/dist/styles.css';
import { Slide } from 'react-slideshow-image';
import './ImageSlider.css';

const slideImages = [
  { img: 'slide1.jpg', title: 'Mangaon, Kudal', caption: 'Agricultural Land' },
  { img: 'slide2.jpg', title: 'Kaleli, Kudal', caption: 'Wheat Farm' },
  { img: 'slide3.jpg', title: 'Shiroda, Vengurla', caption: 'Residential Land' },
];

const SliderComponent = () => {
  return (
    <div className="slider-container">
      <Slide easing="ease" duration={3000} indicators>
        {slideImages.map((slideImage, index) => (
          <div className="slide-image-div" key={index}>
            <div
              className="slide-background"
              style={{ backgroundImage: `url(${slideImage.img})` }}
            >
              <div className="caption">
                <h3 className="title">{slideImage.title}</h3>
                <p className="small-caption">{slideImage.caption}</p>
              </div>
            </div>
          </div>
        ))}
      </Slide>
    </div>
  );
};

export default SliderComponent;
