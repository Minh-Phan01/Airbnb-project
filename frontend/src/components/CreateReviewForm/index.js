import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { createReview } from '../../store/reviews';
import { allReviews } from '../../store/reviews';

const CreateReviewForm = () => {
    const { spotId } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    
    const thisSpot = useSelector(state => state.spots[spotId]);
    

    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newReview = {
            spotId,
            review,
            stars
        }

        await dispatch(createReview(newReview)).then(() => setReview('')).then(() => setStars(0));
        // dispatch(allReviews(thisSpot));
        history.push(`/spots/${spotId}`)
       
    }

    return (
        <section>
            <form onSubmit={handleSubmit}>
                <textarea 
                type='text'
                placeholder='Add Review'
                value={review}
                required='yes'
                onChange={e => setReview(e.target.value)}
                />
                <input 
                type='number'
                placeholder='Stars'
                value={stars}
                min='1'
                max='5'
                required='yes'
                onChange={e => setStars(e.target.value)}
                />
                <button type='submit'>Add Review</button>

                
            </form>
        </section>
    )
}

export default CreateReviewForm;