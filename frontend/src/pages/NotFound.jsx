import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
    <h1 style={{ fontSize: 80, fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>404</h1>
    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24, fontSize: 16 }}>Page not found</p>
    <Link to="/" className="btn btn-primary">
      Back to Home
    </Link>
  </div>
);

export default NotFound;
