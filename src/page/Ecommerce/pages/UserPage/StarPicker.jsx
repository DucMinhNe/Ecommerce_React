import React, { useState } from 'react';
import './StarPicker.css'; // Import file CSS cho StarPicker

const StarPicker = ({ onChange }) => {
    const [rating, setRating] = useState(0);

    const handleStarClick = (selectedRating) => {
        setRating(selectedRating);
        onChange(selectedRating);
    };

    return (
        <div className="star-picker">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`star ${star <= rating ? 'selected' : ''}`}
                    onClick={() => handleStarClick(star)}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

export default StarPicker;
