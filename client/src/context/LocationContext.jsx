import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [city, setCity] = useState(() => localStorage.getItem('userCity') || 'Bangalore');
  const [address, setAddress] = useState(() => localStorage.getItem('userAddress') || 'Koramangala, Bangalore');

  useEffect(() => {
    localStorage.setItem('userCity', city);
    localStorage.setItem('userAddress', address);
  }, [city, address]);

  const updateLocation = (newCity, newAddress) => {
    setCity(newCity);
    setAddress(newAddress || newCity);
  };

  return (
    <LocationContext.Provider value={{ city, address, updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
};
