import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-6">
      <div className="glass-effect p-8 rounded-lg shadow-glass hover-effect max-w-lg w-full text-center">
        <h1 className="text-6xl font-extrabold text-yellow-accent mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-light-text mb-6">Page Not Found</h2>
        <p className="text-light-text/80 mb-8">
          Oops! It looks like we couldn’t find the page you’re looking for. Let’s get you back on track.
        </p>
        <Link
          to="/"
          className="inline-block bg-yellow-accent text-dark-bg px-8 py-3 rounded-lg hover:bg-light-yellow transition-colors hover-effect font-semibold"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}