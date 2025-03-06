import React from 'react';
import './Reviews.css'; // Ensure you have the right path to your CSS file

const reviews = [
  { user: 'User1', comment: 'Great experience renting land!', profileImg: 'profile.jpg' },
  { user: 'User2', comment: 'Easy process and excellent service.', profileImg: 'profile.jpg' },
  { user: 'User3', comment: 'Highly recommend this platform!', profileImg: 'profile.jpg' },
  { user: 'User4', comment: 'Quick response and helpful staff.', profileImg: 'profile.jpg' },
  { user: 'User5', comment: 'Very satisfied with my rental experience.', profileImg: 'profile.jpg' },
  { user: 'User6', comment: 'Support was fantastic, thank you!', profileImg: 'profile.jpg' },
];

const Reviews = () => {
  return (
    <div className="reviews-container">
      <h2 className="reviews-header">User Reviews</h2>
      <div className="review-items">
        {reviews.map((review, index) => (
          <div className="review-card" key={index}>
            <div className="review-header">
              <img src={review.profileImg} alt={review.user} className="profile-image" />
              <strong>{review.user}</strong>
            </div>
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
