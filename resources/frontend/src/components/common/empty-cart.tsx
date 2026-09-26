import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export const EmptyCart = () => {
  return (
    <div className="text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20">
        <div className="text-6xl md:text-8xl mb-4">🛍️</div>

        <h2 className="text-2xl font-bold text-foreground mb-2">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Button asChild>
          <Link to="/products">Continue Shopping</Link>
        </Button>
      </motion.div>
    </div>
  );
};
