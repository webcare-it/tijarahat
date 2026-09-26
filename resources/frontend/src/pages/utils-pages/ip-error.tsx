// @ts-nocheck
import { motion } from "framer-motion";
import { ShieldAlert, AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: "easeOut",
    },
  }),
};

const pulse = {
  scale: [1, 1.08, 1],
  transition: {
    duration: 2.2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const rotateSlow = {
  rotate: 360,
  transition: {
    duration: 25,
    repeat: Infinity,
    ease: "linear",
  },
};

export function IpErrorPage() {
  const [ip, setIp] = useState<string>("");
  const [isp, setIsp] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNetworkInfo = async () => {
      try {
        const res = await fetch("https://ipinfo.io/json", {
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        setIp(data.ip || "—");
        //eslint-disable-next-line no-useless-escape
        setIsp(data.org?.replace("ASd+ ", "") || "Unknown provider");
      } catch (err) {
        console.error("Primary fetch failed:", err);
        setError("Could not fetch network info");

        try {
          const ipRes = await fetch("https://api.ipify.org?format=json");
          const ipData = await ipRes.json();
          setIp(ipData.ip || "—");
        } catch (fallbackErr) {
          console.error("IP fallback failed:", fallbackErr);
          setIp("—");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-black to-gray-950 text-white flex items-center justify-center p-6 overflow-hidden">
      <div className="max-w-2xl w-full text-center relative">
        <motion.div
          className="absolute inset-0 opacity-10 pointer-events-none"
          animate={rotateSlow}>
          <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,#ef4444_0%,transparent_50%)]" />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          className="relative z-10">
          <motion.div animate={pulse} className="inline-block mb-8">
            <ShieldAlert
              size={96}
              className="text-red-500 drop-shadow-[0_0_40px_rgba(239,68,68,0.7)]"
            />
          </motion.div>

          <motion.h1
            custom={0}
            variants={fadeInUp}
            className="text-5xl md:text-6xl font-black tracking-tight mb-6 text-red-50">
            IP BLOCKED
          </motion.h1>

          <motion.p
            custom={1}
            variants={fadeInUp}
            className="text-xl md:text-2xl text-red-300/90 mb-10 font-medium">
            This network cannot connect to the service right now. Try switching
            to mobile data, Wi-Fi, or a VPN.
          </motion.p>

          <motion.div
            custom={2}
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-300 mb-12 leading-relaxed max-w-lg mx-auto">
            <p className="font-semibold text-red-400/90">
              Please contact your Internet Service Provider{" "}
              <span className="text-white font-bold underline decoration-red-500/40">
                {loading ? "(fetching...)" : isp || "(unknown)"}
              </span>{" "}
              and report this issue.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(239,68,68,0.4)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.location.reload()}
              className="group flex items-center gap-3 bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg cursor-pointer shadow-red-900/50 transition-all duration-300">
              <RefreshCw
                size={20}
                className="group-hover:rotate-180 transition-transform duration-700"
              />
              Try Again
            </motion.button>
          </div>

          <motion.p
            custom={3}
            variants={fadeInUp}
            className="mt-16 text-sm text-gray-400 flex flex-col sm:flex-row items-center justify-center gap-3">
            <span>Error reference: IP_BLOCKED</span> |
            <span>Date: {new Date().toISOString().split("T")[0]}</span>
          </motion.p>
          <motion.p
            custom={3}
            variants={fadeInUp}
            className=" mt-4 text-sm text-gray-400 flex flex-col sm:flex-row items-center justify-center gap-3">
            <span>IP: {loading ? "…" : ip || "—"}</span> |
            <div>
              <span>Provider: {loading ? "…" : isp || "—"}</span>
              {error && <span className="text-red-400/80">({error})</span>}
            </div>
          </motion.p>
        </motion.div>

        <motion.div
          className="absolute -top-32 -right-32 opacity-[0.04] pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}>
          <AlertTriangle size={400} strokeWidth={0.7} />
        </motion.div>
      </div>
    </div>
  );
}
