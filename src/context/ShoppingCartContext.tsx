import { createContext, ReactNode, useContext, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

type CartItem = {
  id: number;
  Qte: number;
};

type ShoppingCartContext = {
  openCart: () => void;
  closeCart: () => void;
  getItemQte: (id: number) => number;
  increaseCartQte: (id: number) => void;
  decreaseCartQte: (id: number) => void;
  removeFromCart: (id: number) => void;
  cartQte: number;
  cartItems: CartItem[];
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "shopping-cart",
    []
  );
  const [isOpen, setIsOpen] = useState(false);

  const cartQte = cartItems.reduce((Qte, item) => item.Qte + Qte, 0);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  function getItemQte(id: number) {
    return cartItems.find((item) => item.id === id)?.Qte || 0;
  }

  function increaseCartQte(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, Qte: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, Qte: item.Qte + 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function decreaseCartQte(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id)?.Qte === 1) {
        return currItems.filter((item) => item.id !== id);
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, Qte: item.Qte - 1 };
          } else {
            return item;
          }
        });
      }
    });
  }
  function removeFromCart(id: number) {
    setCartItems((currItems) => {
      return currItems.filter((item) => item.id !== id);
    });
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQte,
        increaseCartQte,
        decreaseCartQte,
        removeFromCart,
        cartItems,
        cartQte,
        openCart,
        closeCart,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
  );
}
