"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Frame from "@/components/core/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { open } from "@tauri-apps/plugin-shell";
import { NeptuneStatus } from "@/components/ui/neptuneStatus";
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

export default function Home() {
  const [updateStatus, setUpdateStatus] = useState('checking');
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    const setRPC = async () => {
      try {
        const { invoke } = await import("@tauri-apps/api/core");
        await invoke("rich_presence");
      } catch (error) {
        console.error("Failed to set rpc:", error);
      }
    };

    if (
      localStorage.getItem("settings.discordRPC") === "true" ||
      localStorage.getItem("settings.discordRPC") == null
    )
      setRPC();

    if (localStorage.getItem("settings.alwaysOnTop") === "true") {
      const { Window } = require("@tauri-apps/api/window");
      const window = new Window("main");
      window.setAlwaysOnTop(true);
    }
  }, []);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const update = await check();

        if (update) {
          setUpdateStatus('downloading');
          console.log(
            `found update ${update.version} from ${update.date} with notes ${update.body}`
          );

          let downloaded = 0;
          let contentLength = 0;

          await update.downloadAndInstall(async (event) => {
            switch (event.event) {
              case 'Started':
                contentLength = event.data.contentLength ?? 0;
                console.log(`started downloading ${event.data.contentLength} bytes`);
                break;
              case 'Progress':
                downloaded += event.data.chunkLength;
                const progress = (downloaded / contentLength) * 100;
                setDownloadProgress(progress);
                console.log(`downloaded ${downloaded} from ${contentLength}`);
                break;
              case 'Finished':
                console.log('download finished');
                setUpdateStatus('restarting');
                await relaunch();
                break;
            }
          });
        } else {
          setUpdateStatus('up-to-date');
        }
      } catch (error) {
        console.error(error);
        setUpdateStatus('error');
      }
    };

    checkForUpdates();
  }, []);

  return (
    <div className="flex h-screen">
      <Frame page={{ page: "Home" }} />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex-grow p-4 text-white relative"
      >
        <NeptuneStatus />
        <h1 className="text-2xl font-bold mt-6 ml-1 mb-4">Home</h1>
        <div className="space-y-4">
          <div className="bg-[#1F2025] rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Welcome to Carbon!</h2>
            <p className="text-sm text-gray-300 mb-3">
              Welcome to Carbon! Make sure to join our Discord Server for
              important news and frequent updates! If you have any requests or
              encounter an issue, please let us know there.
            </p>
            <div className="space-y-2">
              <button
                className="w-full bg-gradient-to-r from-[#454FBF] to-[#3FA9F5] hover:brightness-110 text-white font-bold py-3 px-4 rounded text-sm flex items-center justify-center transition-all duration-200 relative overflow-hidden"
                style={{
                  boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.2)",
                }}
                onClick={() => {
                  window.location.href = "/library";
                }}
              >
                <span className="flex-grow text-center">Launch Fortnite</span>
                <div
                  className="absolute right-0 top-1/2 w-16 h-16 opacity-25"
                  style={{
                    background: "url(/battlebus.PNG) no-repeat center center",
                    backgroundSize: "contain",
                    transform: "translateY(-50%) translateX(25%) rotate(15deg)",
                  }}
                />
              </button>
              <button
                className="w-full bg-gradient-to-r from-[#454FBF] to-[#6B77E5] hover:brightness-110 text-white font-bold py-3 px-4 rounded text-sm flex items-center justify-center transition-all duration-200 relative overflow-hidden"
                style={{
                  boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.2)",
                }}
                onClick={async () => {
                  await open("https://discord.gg/carbon-897532507048796210");
                }}
              >
                <span className="flex-grow text-center relative z-10">
                  Join our Discord
                </span>
                <div
                  className="absolute right-0 top-1/2 w-16 h-16 opacity-25"
                  style={{
                    background: "url(/disc2.png) no-repeat center center",
                    backgroundSize: "contain",
                    transform: "translateY(-50%) translateX(25%) rotate(15deg)",
                  }}
                />
              </button>
            </div>
          </div>

          <div className="bg-[#1F2025] rounded-lg p-4">
            <div className="flex">
              <div className="flex-grow pr-3">
                <h3 className="text-base font-semibold mb-1">
                  Introducing:{" "}
                  <span className="text-[#d580ff]">Carbon Launcher</span>
                </h3>
                <p className="text-sm text-gray-300 mb-1">
                  You spoke, and we listened. Were you one of the thousands
                  tired of the annoying console app? Well lucky enough for you,
                  Cranium is easier than ever to use with the new Carbon
                  Launcher. More updates coming shortly, but until then enjoy!
                </p>
                <p className="text-xs text-gray-400 italic">
                  With love, the Carbon team ❤️
                </p>
              </div>
              <div className="flex-shrink-0">
                <Image
                  src="/fist.jpg"
                  alt="Feature Image"
                  width={130}
                  height={130}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
          <br></br>
          <br></br>
          <br></br>
          <div className="flex justify-center">
            <p className="text-xs text-gray-400 bold">
              Launcher made with ❤️ by Itztiva, UI made by t8do
            </p>
          </div>
        </div>

        <AnimatePresence>
          {(updateStatus === 'downloading' || updateStatus === 'restarting') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-4 right-4 bg-[#1F2025] text-white p-4 rounded-lg shadow-lg"
            >
              <p className="text-sm font-semibold mb-2">
                {updateStatus === 'downloading' ? 'Updating Carbon' : 'Restarting'}
              </p>
              {updateStatus === 'downloading' && (
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${downloadProgress}%` }}
                  ></div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </div>
  );
}
