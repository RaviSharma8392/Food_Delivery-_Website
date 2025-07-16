// import React, { createContext, useEffect, useState } from "react";
// import { fetchFoodList } from "../api/publicApi/foodItem";

// export const StoreContext = createContext();

// const StoreProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState(() => {
//     const storedCart = localStorage.getItem("cartItems");
//     return storedCart ? JSON.parse(storedCart) : {};
//   });
//   const url = "gh";

//   const [items, setItems] = useState([]); // should be fetched elsewhere
//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await fetchFoodList();
//       // setCategories(response.data.foodCategories);
//       // console.log(response.data.foodItems);
//       setItems(response.data.foodItems);
//       console.log(response.data.foodItems);

//       // setFilterItems(response.data.foodItems);
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("cartItems", JSON.stringify(cartItems));
//   }, [cartItems]);

//   const addToCart = (itemId, price, portion, quantity = 1) => {
//     setCartItems((prev) => {
//       const existing = prev[itemId] || { quantity: 0, price, portion };
//       return {
//         ...prev,
//         [itemId]: {
//           price,
//           portion,
//           quantity: existing.quantity + quantity,
//         },
//       };
//     });
//   };

//   const removeFromCart = (itemId) => {
//     setCartItems((prev) => {
//       const existing = prev[itemId];
//       if (!existing) return prev;

//       const updatedQty = existing.quantity - 1;
//       if (updatedQty <= 0) {
//         const newCart = { ...prev };
//         delete newCart[itemId];
//         return newCart;
//       }

//       return {
//         ...prev,
//         [itemId]: {
//           ...existing,
//           quantity: updatedQty,
//         },
//       };
//     });
//   };

//   return (
//     <StoreContext.Provider
//       value={{
//         cartItems,
//         setCartItems,
//         addToCart,
//         removeFromCart,
//         items,
//         url,
//       }}>
//       {children}
//     </StoreContext.Provider>
//   );
// };

// export default StoreProvider;

import React, { createContext, useContext, useReducer } from "react";

const CartStateContext = createContext();
const CartDispatchContext = createContext();

// Reducer function to handle cart actions
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return [...state, action.payload]; // Add item to cart

    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.payload); // ✅ Removes only the selected item

    case "CLEAR_CART":
      return []; // ✅ Clears the entire cart

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, []);

  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
};

// Custom hooks to access cart state and dispatch
export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);
