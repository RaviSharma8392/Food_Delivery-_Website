import React, { useState } from "react";
import { GiShoppingCart } from "react-icons/gi";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCartContext } from "../../context/cartContext";

const FloatingCartCTA = () => {
  const { cart } = useCartContext();
  const [isHovered, setIsHovered] = useState(false);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + (item.item?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isHovered && itemCount > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute right-full bottom-0 mb-2 mr-3 w-64 bg-white rounded-xl shadow-xl overflow-hidden border border-orange-100">
            <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50">
              <h3 className="font-bold text-orange-800">Your Order</h3>
              <p className="text-sm text-orange-600">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>
            </div>
            <div className="max-h-60 overflow-y-auto p-2">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.portion}`}
                  className="flex justify-between items-center py-2 border-b border-orange-50">
                  <span className="text-sm font-medium text-orange-800 truncate max-w-[120px]">
                    {item.quantity}x {item.item?.name}
                  </span>
                  <span className="text-sm font-bold text-amber-600">
                    ₹{(item.item?.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-3 bg-orange-50 border-t border-orange-100">
              <div className="flex justify-between items-center">
                <span className="font-bold text-orange-800">Total:</span>
                <span className="font-bold text-lg text-amber-600">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Button */}
      <div className="relative">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/cart"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`flex items-center justify-center rounded-full shadow-lg text-white transition-all duration-300 ${
              itemCount > 0
                ? "bg-gradient-to-br from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                : "bg-gradient-to-br from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500"
            }`}
            style={{
              width: "64px",
              height: "64px",
              boxShadow: "0 4px 20px rgba(237, 137, 54, 0.4)",
            }}>
            <GiShoppingCart className="text-2xl" />
            {itemCount > 0 && (
              <motion.span
                key={itemCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-sm">
                {itemCount}
              </motion.span>
            )}
          </Link>
        </motion.div>

        {/* Subtle pulse animation if empty */}
        {itemCount === 0 && (
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full bg-amber-400 opacity-0 pointer-events-none"
            style={{ zIndex: -1 }}
          />
        )}
      </div>
    </div>
  );
};

export default FloatingCartCTA;
