import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search, MapPin, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
    const navigate = useNavigate();
    const handleGoBack = () => {
        window.history.back();
    };

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
            <div className="absolute inset-0">
                <motion.div
                    className="absolute top-20 left-20 w-16 h-16 bg-blue-500/20 rounded-lg"
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <Search className="w-full h-full text-blue-400" />
                </motion.div>

                <motion.div
                    className="absolute top-32 right-32 w-12 h-12 bg-purple-500/20 rounded-lg"
                    animate={{
                        y: [0, -15, 0],
                        rotate: [0, -3, 0],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                >
                    <MapPin className="w-full h-full text-purple-400" />
                </motion.div>

                <motion.div
                    className="absolute bottom-32 left-40 w-14 h-14 bg-indigo-500/20 rounded-lg"
                    animate={{
                        y: [0, -25, 0],
                        rotate: [0, 8, 0],
                        opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                >
                    <Compass className="w-full h-full text-indigo-400" />
                </motion.div>

                <motion.div
                    className="absolute top-1/4 left-1/4 text-blue-400/30 text-6xl font-bold"
                    animate={{
                        x: [0, 20, 0],
                        y: [0, -10, 0],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    4
                </motion.div>
                <motion.div
                    className="absolute top-1/3 right-1/3 text-purple-400/30 text-6xl font-bold"
                    animate={{
                        x: [0, -15, 0],
                        y: [0, 15, 0],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                >
                    0
                </motion.div>
                <motion.div
                    className="absolute bottom-1/3 left-1/3 text-indigo-400/30 text-6xl font-bold"
                    animate={{
                        x: [0, 10, 0],
                        y: [0, -20, 0],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
                >
                    4
                </motion.div>
                <motion.div
                    className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"
                    animate={{ opacity: [0.2, 0.8, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
                <div className="text-center space-y-8 max-w-3xl mx-auto">
                    <motion.div className="relative">
                        <motion.div
                            className="text-8xl mb-6 mt-6 md:mt-0"
                            animate={{
                                y: [0, -15, 0],
                                rotate: [0, 5, 0],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            🔍
                        </motion.div>
                    </motion.div>

                    <motion.h1
                        className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            duration: 1,
                            type: "spring",
                            stiffness: 100,
                        }}
                    >
                        404
                    </motion.h1>

                    <motion.h2
                        className="text-4xl md:text-5xl font-bold text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                    >
                        Page Not Found
                    </motion.h2>

                    <motion.p
                        className="text-xl md:text-2xl text-blue-200 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        Oops! The page you're looking for doesn't exist
                    </motion.p>

                    <motion.div
                        className="bg-blue-900/30 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/30"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.9 }}
                    >
                        <div className="flex items-center justify-center space-x-3">
                            <motion.div
                                className="w-3 h-3 bg-blue-400 rounded-full"
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <span className="text-blue-400 font-medium">
                                Navigation Status
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                            <motion.div
                                className="space-y-2"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="text-3xl">🔍</div>
                                <div className="text-blue-400 font-bold">
                                    Failed
                                </div>
                            </motion.div>
                            <motion.div
                                className="space-y-2"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="text-3xl">🗺️</div>
                                <div className="text-blue-400 font-bold">
                                    Not Found
                                </div>
                            </motion.div>
                            <motion.div
                                className="space-y-2"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="text-3xl">🧭</div>
                                <div className="text-blue-400 font-bold">
                                    Lost
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                    <motion.div
                        className="flex items-center gap-4 justify-center mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1.1 }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Button
                                onClick={handleGoBack}
                                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                                size="lg"
                            >
                                <motion.div
                                    animate={{ x: [-2, 2, -2] }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                    }}
                                    className="mr-2"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </motion.div>
                                Go Back
                            </Button>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Button
                                onClick={handleGoHome}
                                variant="outline"
                                className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white font-semibold px-8 py-3 rounded-full transition-all duration-300"
                                size="lg"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                    className="mr-2"
                                >
                                    <Home className="h-5 w-5" />
                                </motion.div>
                                Go Home
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
