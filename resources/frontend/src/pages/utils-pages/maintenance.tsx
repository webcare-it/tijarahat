import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export const MaintenancePage = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 bg-blue-500/20 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-32 right-20 w-16 h-16 bg-purple-500/20 rounded-full"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-32 w-24 h-24 bg-pink-500/20 rounded-full"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-32 right-10 w-12 h-12 bg-yellow-500/20 rounded-full"
          animate={{ y: [0, -15, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />

        <motion.div
          className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-8 max-w-2xl mx-auto mt-6">
          <motion.div className="relative">
            <motion.div
              className="text-8xl mb-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}>
              🔧
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}>
            Maintenance Mode
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}>
            We're working hard to improve your experience
          </motion.p>

          <motion.p
            className="text-lg text-gray-400 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}>
            Our team is performing essential updates and improvements. We'll be
            back online shortly with amazing new features!
          </motion.p>

          <motion.div
            className="w-full max-w-md mx-auto mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}>
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}>
                Almost there...
              </motion.span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: ["0%", "70%", "85%"] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </motion.div>

          <motion.div
            className="flex justify-center space-x-2 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}>
            <motion.div
              className="w-3 h-3 bg-blue-400 rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
            <motion.div
              className="w-3 h-3 bg-purple-400 rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
            />
            <motion.div
              className="w-3 h-3 bg-pink-400 rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
          </motion.div>

          <motion.div
            className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}>
            <div className="flex items-center justify-center space-x-3">
              <motion.div
                className="w-3 h-3 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-green-400 font-medium">System Status</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}>
                <div className="text-2xl">🚀</div>
                <div className="text-sm text-gray-300">Performance</div>
                <div className="text-green-400 font-bold">Optimizing</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}>
                <div className="text-2xl">🔒</div>
                <div className="text-sm text-gray-300">Security</div>
                <div className="text-green-400 font-bold">Secured</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}>
                <div className="text-2xl">⚡</div>
                <div className="text-sm text-gray-300">Speed</div>
                <div className="text-green-400 font-bold">Enhancing</div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}>
              <Button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mr-2">
                  <RefreshCw className="h-5 w-5" />
                </motion.div>
                Refresh Page
              </Button>
            </motion.div>
            <motion.p
              className="text-sm text-gray-400 mt-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}>
              Click to check if we're back online! 🚀
            </motion.p>
          </motion.div>

          <motion.div
            className="mt-2 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}>
            <p className="text-gray-400 mb-2">Estimated completion time</p>
            <motion.div
              className="text-2xl font-bold text-white mb-6"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}>
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                15-30 minutes
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
