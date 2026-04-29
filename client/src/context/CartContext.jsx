import { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext(null);

const STORAGE_KEY = 'swiggy_cart';

const loadCart = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { items: [], restaurantId: null, restaurantName: '' };
  } catch {
    return { items: [], restaurantId: null, restaurantName: '' };
  }
};

const saveCart = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item, restaurantId, restaurantName } = action.payload;

      // Different restaurant — ask to clear
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        return state; // Handled by the action dispatcher
      }

      const existing = state.items.find((i) => i.id === item.id);
      const items = existing
        ? state.items.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
        : [...state.items, { ...item, qty: 1 }];

      return { ...state, items, restaurantId, restaurantName };
    }

    case 'REMOVE_ITEM': {
      const existing = state.items.find((i) => i.id === action.payload);
      if (!existing) return state;
      const items = existing.qty === 1
        ? state.items.filter((i) => i.id !== action.payload)
        : state.items.map((i) => i.id === action.payload ? { ...i, qty: i.qty - 1 } : i);
      const restaurantId = items.length === 0 ? null : state.restaurantId;
      const restaurantName = items.length === 0 ? '' : state.restaurantName;
      return { ...state, items, restaurantId, restaurantName };
    }

    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
        restaurantId: state.items.length === 1 ? null : state.restaurantId,
        restaurantName: state.items.length === 1 ? '' : state.restaurantName,
      };

    case 'CLEAR_CART':
      return { items: [], restaurantId: null, restaurantName: '' };

    case 'SET_CART':
      return action.payload;

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, null, loadCart);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const addItem = useCallback((item, restaurantId, restaurantName) => {
    if (cart.restaurantId && cart.restaurantId !== restaurantId) {
      const confirmed = window.confirm(
        `Your cart has items from ${cart.restaurantName}. Start a new cart from ${restaurantName}?`
      );
      if (confirmed) {
        dispatch({ type: 'CLEAR_CART' });
        setTimeout(() => {
          dispatch({ type: 'ADD_ITEM', payload: { item, restaurantId, restaurantName } });
          toast.success(`${item.name} added to cart`, { icon: '🛒' });
        }, 0);
      }
      return;
    }
    dispatch({ type: 'ADD_ITEM', payload: { item, restaurantId, restaurantName } });
    toast.success(`${item.name} added to cart`, { icon: '🛒', autoClose: 1500 });
  }, [cart.restaurantId, cart.restaurantName]);

  const removeItem = useCallback((itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  }, []);

  const deleteItem = useCallback((itemId) => {
    dispatch({ type: 'DELETE_ITEM', payload: itemId });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const getItemQty = useCallback((itemId) => {
    return cart.items.find((i) => i.id === itemId)?.qty ?? 0;
  }, [cart.items]);

  const totalItems = cart.items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const deliveryFee = subtotal > 0 ? (subtotal >= 299 ? 0 : 39) : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  return (
    <CartContext.Provider value={{
      cart,
      totalItems,
      subtotal,
      deliveryFee,
      tax,
      total,
      addItem,
      removeItem,
      deleteItem,
      clearCart,
      getItemQty,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
