import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { allReviews } from "../../store/reviews";
import { useParams } from "react-router-dom";
import ReviewCard from "../ReviewCard.js";
import './ReviewList.css';

function ReviewList({spot}) {
    const dispatch = useDispatch();

    const {spotId} = useParams();
    const thisSpot = useSelector(state => state.spots[spotId])
    const [isLoaded, setIsLoaded] = useState(false);

    const spotReviewObj = useSelector(state => state.reviews);
    const reviews = Object.values(spotReviewObj);
    const spotReviews = reviews.filter(review =>  {
        if (parseInt(review.spotId) === thisSpot.id) {
            return review
        }
    })



    console.log(spotReviewObj);

    useEffect(() => {
        dispatch(allReviews(spotId)).then(() => setIsLoaded(true));
    }, [dispatch]);


    return (
      <div className="review-list">
        <h1 className="reviews-header">Reviews</h1>
        {
            spotReviews.map(review => {
                return <div className="one-review" key={review.id}>
                    <ReviewCard review={review} />
                </div>
            })
        }
      </div>
    )
}

export default ReviewList;