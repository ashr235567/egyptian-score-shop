import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const RatingStars = ({ rating = 0, size = 14, showCount, count }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} size={size} color="#f0a500" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} size={size} color="#f0a500" />);
    } else {
      stars.push(<FaRegStar key={i} size={size} color="#f0a500" />);
    }
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <div style={{ display: 'flex', gap: 2 }}>{stars}</div>
      {showCount && (
        <span style={{ fontSize: 12.5, color: 'var(--color-text-secondary)' }}>({count ?? 0})</span>
      )}
    </div>
  );
};

export default RatingStars;
