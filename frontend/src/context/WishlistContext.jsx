import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { userApi } from '../api/userApi';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const WishlistContext = createContext();

const WISHLIST_KEY = 'ess_wishlist';

const loadLocalWishlist = () => {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState(loadLocalWishlist);
  const [loading, setLoading] = useState(false);

  const fetchServerWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await userApi.getWishlist();
      setItems(data.wishlist);
    } catch (err) {
      // fail silently
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchServerWishlist();
    } else {
      setItems(loadLocalWishlist());
    }
  }, [isAuthenticated, fetchServerWishlist]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  const isInWishlist = (productId) => items.some((p) => p._id === productId);

  const toggleWishlist = async (product) => {
    const exists = isInWishlist(product._id);
    if (isAuthenticated) {
      try {
        if (exists) {
          await userApi.removeFromWishlist(product._id);
          setItems((prev) => prev.filter((p) => p._id !== product._id));
          toast.info('Removed from wishlist');
        } else {
          await userApi.addToWishlist(product._id);
          setItems((prev) => [...prev, product]);
          toast.success('Added to wishlist');
        }
      } catch (err) {
        toast.error('Could not update wishlist');
      }
    } else {
      if (exists) {
        setItems((prev) => prev.filter((p) => p._id !== product._id));
        toast.info('Removed from wishlist');
      } else {
        setItems((prev) => [...prev, product]);
        toast.success('Added to wishlist');
      }
    }
  };

  return (
    <WishlistContext.Provider value={{ items, loading, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
