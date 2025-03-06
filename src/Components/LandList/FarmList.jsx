import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FarmList.css';

const FarmList = () => {
  const farms = [
    { id: 1, name: 'Sunflower Farm', location: 'Kerla', area: "10 acre", price: '15,000 INR/month', img: 'farm1.jpg' },
    { id: 2, name: 'Coconut Farm', location: 'Kudal', area: "20 acre", price: '8,000 INR/month', img: 'farm2.jpg' },
    { id: 3, name: 'Bamboo Orchard', location: 'Wados', area: "15 acre", price: '5,000 INR/month', img: 'farm3.jpg' },
    { id: 4, name: 'Vegetable Farm', location: 'Kaleli', area: "50 acre", price: '12,000 INR/month', img: 'farm4.jpg' },
    { id: 5, name: 'Wheat Farm', location: 'Mangaon', area: "5 acre", price: '10,000 INR/month', img: 'farm5.jpg' },
    { id: 6, name: 'Cashew Farm', location: 'Goa', area: "12 acre", price: '18,000 INR/month', img: 'farm6.jpg' },
  ];

  return (
    <div className="container">
      <h2 className="text-center my-4 list-header">Farm Listings</h2>
      <div className="row">
        {farms.map(farm => (
          <FarmCard key={farm.id} farm={farm} />
        ))}
      </div>
      <div className="text-center mt-4">
        <button className="btn btn-primary show-more-btn">Show More Farms</button>
      </div>
    </div>
  );
};

const FarmCard = ({ farm }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card farm-card">
        <img src={farm.img} alt={farm.name} className="card-img-top farm-image" />
        <div className="card-body">
          <h3 className="card-title">{farm.name}</h3>
          <p className="card-text">Location: {farm.location}</p>
          <p className="card-text">Price: {farm.price}</p>
          <p className="card-text">Area: {farm.area}</p>
          <button className="btn btn-info view-details-btn">View Details</button>
        </div>
      </div>
    </div>
  );
};

export default FarmList;
