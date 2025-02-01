"use client";

import Frame from "@/components/core/Sidebar";
import { motion } from "framer-motion";
import { NeptuneStatus } from "@/components/ui/neptuneStatus";

export default function News() {
  return (
    <div className="flex h-screen">
      <Frame page={{ page: "Home" }} />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex-grow p-4 text-white"
      >
        <NeptuneStatus />
        <h1 className="text-2xl font-bold mt-6 ml-1 mb-4">News</h1>
        <div className="space-y-4">
          <div className="bg-[#1F2025] rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Coming Soon!</h2>
            <p className="text-sm text-gray-300 mb-3">
              This Page is under development, Make sure to join our Discord Server for
              important news for now!
            </p>
          </div>


          <div className="absolute bottom-6 left-3 right-0 text-center">
          <p className="text-xs text-gray-400 bold">
              Launcher made with ❤️ by Itztiva
            </p>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
