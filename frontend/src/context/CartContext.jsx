import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('mie-ayam-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('mie-ayam-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity, selectedToppings) => {
    const cartItemId = `${product.id}-${selectedToppings.map(t => t.id).sort().join(',')}`;
    
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.cartItemId === cartItemId);
      
      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          quantity: newCart[existingItemIndex].quantity + quantity
        };
        return newCart;
      } else {
        return [...prevCart, { 
          cartItemId, 
          productId: product.id, 
          name: product.name,
          basePrice: product.basePrice,
          imageUrl: product.imageUrl,
          quantity, 
          selectedToppings 
        }];
      }
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((total, item) => {
    const itemToppingsTotal = item.selectedToppings.reduce((t, topping) => t + topping.price, 0);
    return total + (item.basePrice + itemToppingsTotal) * item.quantity;
  }, 0);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      subtotal,
      totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};
