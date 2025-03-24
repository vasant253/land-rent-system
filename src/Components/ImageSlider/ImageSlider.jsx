import React, { useState, useEffect } from "react";
import "react-slideshow-image/dist/styles.css";
import { Slide } from "react-slideshow-image";
import axios from "axios";
import "./ImageSlider.css";
import { Link } from "react-router-dom";

const SliderComponent = () => {
  const [slideImages, setSlideImages] = useState([]);

  useEffect(() => {
    fetchApprovedLands();
  }, []);

  const fetchApprovedLands = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/landapi/approved-lands/");
      const lands = response.data;
      console.log(lands);

      // ✅ Extract images from approved lands
      const formattedImages = lands
        .map((land) =>
          land.images.map((img) => ({
            img: `http://127.0.0.1:8000${img.image}`, // Full image URL
            id: land.land_id,
            title: land.location, // Use location as title
            caption: land.land_type, // Show land type as caption
          }))
        )
        .flat();

      setSlideImages(formattedImages);
    } catch (error) {
      console.error("Error fetching approved lands:", error);
    }
  };

  return (
    <div className="slider-container">
      <Slide easing="ease" duration={3000} indicators>
        {slideImages.length > 0 ? (
          slideImages.map((slideImage, index) => (
            <div className="slide-image-div" key={index}>
              <Link to={`/land/${slideImage.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div
                  className="slide-background"
                  style={{ backgroundImage: `url(${slideImage.img})` }}
                >
                  <div className="caption">
                    <h3 className="title">{slideImage.title}</h3>
                    <p className="small-caption">{slideImage.caption}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="text-center">No approved lands available.</div>
        )}
      </Slide>
    </div>
  );
};

export default SliderComponent;
