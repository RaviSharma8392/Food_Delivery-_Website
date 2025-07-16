import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const initialState = {
  cart: [],
  total_item: 0,
  total_amount: 0,
  delivery_fees: 50,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { id, amount, portion, item } = action.payload;

      const existingItemIndex = state.cart.findIndex(
        (cartItem) => cartItem.id === id && cartItem.portion === portion
      );

      let updatedCart;
      if (existingItemIndex !== -1) {
        updatedCart = state.cart.map((cartItem, index) => {
          if (index === existingItemIndex) {
            return { ...cartItem, quantity: cartItem.quantity + amount };
          }
          return cartItem;
        });
      } else {
        updatedCart = [
          ...state.cart,
          {
            id,
            portion,
            item, // Make sure item includes .price
            quantity: amount,
          },
        ];
      }

      return { ...state, cart: updatedCart };
    }

    case "REMOVE_FROM_CART": {
      const { id, portion } = action.payload;
      const updatedCart = state.cart
        .map((cartItem) => {
          if (cartItem.id === id && cartItem.portion === portion) {
            return { ...cartItem, quantity: cartItem.quantity - 1 };
          }
          return cartItem;
        })
        .filter((cartItem) => cartItem.quantity > 0);

      return { ...state, cart: updatedCart };
    }

    case "UPDATE_QUANTITY": {
      const { id, portion, newQuantity } = action.payload;
      const updatedCart = state.cart
        .map((cartItem) => {
          if (cartItem.id === id && cartItem.portion === portion) {
            return { ...cartItem, quantity: newQuantity };
          }
          return cartItem;
        })
        .filter((cartItem) => cartItem.quantity > 0);

      return { ...state, cart: updatedCart };
    }

    case "CALCULATE_TOTAL": {
      const { totalAmount, totalItems } = state.cart.reduce(
        (acc, item) => {
          acc.totalAmount += item.quantity * item.item.price;
          acc.totalItems += item.quantity;
          return acc;
        },
        { totalAmount: 0, totalItems: 0 }
      );

      return {
        ...state,
        total_amount: totalAmount,
        total_item: totalItems,
      };
    }

    case "CLEAR_CART":
      return { ...state, cart: [], total_amount: 0, total_item: 0 };

    case "SET_CART":
      return { ...state, cart: action.payload };

    default:
      return state;
  }
};

const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const storedCart = localStorage.getItem("cartData");
    if (storedCart) {
      dispatch({ type: "SET_CART", payload: JSON.parse(storedCart) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartData", JSON.stringify(state.cart));
    dispatch({ type: "CALCULATE_TOTAL" });
  }, [state.cart]);

  const addToCart = (id, amount, portion, item) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { id, amount, portion, item },
    });
  };

  const removeFromCart = (id, portion) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { id, portion } });
  };

  const updateQuantity = (id, portion, newQuantity) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id, portion, newQuantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    localStorage.removeItem("cartData");
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    grand_total: state.total_amount + state.delivery_fees,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const useCartContext = () => useContext(CartContext);

export { DataProvider, useCartContext };
