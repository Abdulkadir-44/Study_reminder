import { motion } from "framer-motion";

const AnimatedPage = ({ children }) => {
    const animations = {
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -100 }
    };

    return (
        <motion.div
            variants={animations}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedPage;