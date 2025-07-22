import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const initialState = {
  cart: [],
  total_item: 0,
  total_amount: 0,
  delivery_fees: 50,
  restaurantId: "",
  restaurantName: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { id, amount, portion, item, price, restaurantId, restaurantName } =
        action.payload;

      // Only allow one restaurant
      if (state.cart.length > 0 && state.restaurantId !== restaurantId) {
        alert("You can only order from one restaurant at a time.");
        return state;
      }

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
            item,
            price, // ✅ Store price directly here
            quantity: amount,
          },
        ];
      }

      return {
        ...state,
        cart: updatedCart,
        restaurantId,
        restaurantName,
      };
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
          const price = Number(item.price); // ✅ Use directly stored price
          acc.totalAmount += item.quantity * (isNaN(price) ? 0 : price);
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
      return {
        ...state,
        cart: [],
        total_amount: 0,
        total_item: 0,
        restaurantId: "",
        restaurantName: "",
      };

    case "SET_CART":
      return {
        ...state,
        cart: action.payload.cart || [],
        restaurantId: action.payload.restaurantId || "",
        restaurantName: action.payload.restaurantName || "",
      };

    default:
      return state;
  }
};

const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cartData");
    const storedRestaurantId = localStorage.getItem("cartRestaurantId");
    const storedRestaurantName = localStorage.getItem("cartRestaurantName");

    if (storedCart) {
      dispatch({
        type: "SET_CART",
        payload: {
          cart: JSON.parse(storedCart),
          restaurantId: storedRestaurantId,
          restaurantName: storedRestaurantName,
        },
      });
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cartData", JSON.stringify(state.cart));
    localStorage.setItem("cartRestaurantId", state.restaurantId);
    localStorage.setItem("cartRestaurantName", state.restaurantName);
    dispatch({ type: "CALCULATE_TOTAL" });
  }, [state.cart]);

  const addToCart = (
    item,
    portion,
    price,
    quantity,
    restaurantId,
    restaurantName
  ) => {
    if (!item || !item._id) {
      console.error("Item is undefined or missing _id");
      return;
    }

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: item._id,
        amount: quantity,
        portion,
        item,
        price, // ✅ pass price here
        restaurantId,
        restaurantName,
      },
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
    localStorage.removeItem("cartRestaurantId");
    localStorage.removeItem("cartRestaurantName");
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    grand_total: state.total_amount + state.delivery_fees,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const useCartContext = () => useContext(CartContext);

export { DataProvider, useCartContext };
