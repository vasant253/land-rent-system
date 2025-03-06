import React from 'react';
import './Categories.css'; // Ensure you have the right path to your CSS file

const categories = [
  {type: 'Residential', img: 'residential.jpg' },
  {type: 'Agricultural', img: 'agricultural.jpg' },
  {type: 'Industry', img: 'industry.jpg' },
  {type: 'Construction', img: 'construction.jpg' },
];

const Categories = () => {
  return (
    <div className="categories-container">
      <h2 className="categories-header">Categories</h2>
      <div className="category-items">
        {categories.map((category, index) => (
          <div className="category-item" key={index}>
            <img src={category.img} alt={`Category ${index + 1}`} className="category-image" />
            <h6 className='category-type'>{category.type}</h6>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
