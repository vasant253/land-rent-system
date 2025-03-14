import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import "./Categories.css"; // Ensure correct path

const categories = [
  { type: "Residential", img: "residential.jpg" },
  { type: "Agricultural", img: "agricultural.jpg" },
  { type: "Commercial", img: "construction.jpg" },
];

const Categories = () => {
  const navigate = useNavigate(); // ✅ Use navigate for redirection

  const handleCategoryClick = (category) => {
    navigate(`/lands/${category}`); // ✅ Redirect to separate page
  };

  return (
    <div className="categories-container">
      <h2 className="categories-header">Categories</h2>
      <div className="category-items">
        {categories.map((category, index) => (
          <div
            className="category-item"
            key={index}
            onClick={() => handleCategoryClick(category.type)} // ✅ Redirect on click
          >
            <img src={category.img} alt={category.type} className="category-image" />
            <h6 className="category-type">{category.type}</h6>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
