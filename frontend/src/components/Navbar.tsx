import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 shadow-sm backdrop-blur-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Car className="h-8 w-8 text-green-600" />
          <span className="text-xl font-bold">EcoEmissions</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-10">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-green-600 ${
              location.pathname === '/' ? 'text-green-600' : 'text-gray-700'
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors hover:text-green-600 ${
              location.pathname === '/about' ? 'text-green-600' : 'text-gray-700'
            }`}
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className={`text-sm font-medium transition-colors hover:text-green-600 ${
              location.pathname === '/contact' ? 'text-green-600' : 'text-gray-700'
            }`}
          >
            Contact Us
          </Link>
          <Link
            to="/news"
            className={`text-sm font-medium transition-colors hover:text-green-600 ${
              location.pathname === '/news' ? 'text-green-600' : 'text-gray-700'
            }`}
          >
            News
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          {!user ? (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <Link
                  to="/admin-dashboard"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Admin Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-outline">
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="rounded-md p-2 text-gray-700 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              to="/"
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-50 hover:text-green-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-50 hover:text-green-600"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-50 hover:text-green-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
            <Link
              to="/news"
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-50 hover:text-green-600"
              onClick={() => setIsMenuOpen(false)}
            >
              News
            </Link>
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-50 hover:text-green-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-50 hover:text-green-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {isAdmin && (
                  <Link
                    to="/admin-dashboard"
                    className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full rounded-md px-3 py-2 text-left text-base font-medium hover:bg-gray-50 hover:text-green-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;