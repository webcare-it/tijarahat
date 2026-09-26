import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw, Server, Database, Cpu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ServerError = () => {
  const navigate = useNavigate();
  const handleRefresh = () => {
    if (window.location.pathname === "/500") {
      navigate("/");
    }
    window.location.reload();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-900 via-slate-900 to-red-800 relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-16 h-16 bg-red-500/20 rounded-lg"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity }}>
          <Server className="w-full h-full text-red-400" />
        </motion.div>

        <motion.div
          className="absolute top-32 right-32 w-12 h-12 bg-orange-500/20 rounded-lg"
          animate={{
            y: [0, -15, 0],
            rotate: [0, -3, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}>
          <Database className="w-full h-full text-orange-400" />
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-40 w-14 h-14 bg-yellow-500/20 rounded-lg"
          animate={{
            y: [0, -25, 0],
            rotate: [0, 8, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}>
          <Cpu className="w-full h-full text-yellow-400" />
        </motion.div>

        <motion.div
          className="absolute top-1/4 left-1/4 text-red-400/30 text-6xl font-bold"
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 2, repeat: Infinity }}>
          5
        </motion.div>
        <motion.div
          className="absolute top-1/3 right-1/3 text-red-400/30 text-6xl font-bold"
          animate={{
            x: [0, -15, 0],
            y: [0, 15, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}>
          0
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 left-1/3 text-red-400/30 text-6xl font-bold"
          animate={{
            x: [0, 10, 0],
            y: [0, -20, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}>
          0
        </motion.div>

        <motion.div
          className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-400/40 to-transparent"
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-400/40 to-transparent"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div className="relative">
            <motion.div
              className="text-8xl mt-6 md:mt-0"
              animate={{
                y: [0, -15, 0],
                rotate: [0, 5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}>
              🔥
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}>
            500
          </motion.h1>

          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}>
            Server Error
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-red-200 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}>
            Oops! Something went wrong on our servers
          </motion.p>

          <motion.p
            className="text-base text-red-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}>
            Our technical team has been notified and is working to fix this
            issue. This usually takes just a few minutes.
          </motion.p>

          <motion.div
            className="bg-red-900/30 backdrop-blur-sm rounded-2xl mt-4 p-4 border border-red-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}>
            <div className="flex items-center justify-center space-x-3">
              <motion.div
                className="w-3 h-3 bg-red-400 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-red-400 font-medium">Server Status</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}>
                <div className="text-3xl">🔥</div>
                <div className="text-sm text-red-300">Database</div>
                <div className="text-red-400 font-bold">Error</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}>
                <div className="text-3xl">⚡</div>
                <div className="text-sm text-red-300">API</div>
                <div className="text-red-400 font-bold">Down</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}>
                <div className="text-3xl">🚨</div>
                <div className="text-sm text-red-300">Services</div>
                <div className="text-red-400 font-bold">Failing</div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}>
            <Button
              onClick={handleRefresh}
              className="bg-gradient-to-r mb-6 from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 mt-4"
              size="lg">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mr-2">
                <RefreshCw className="h-5 w-5" />
              </motion.div>
              Try Again
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
