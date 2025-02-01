"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Plus, Pause, Play, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Frame from "@/components/core/Sidebar";
import useBuilds from "@/modules/builds/state";
import Image from "next/image";
import { NeptuneStatus } from "@/components/ui/neptuneStatus";

export default function Library() {
  const buildState = useBuilds();
  const [activeBuild, setActiveBuild] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredBuild, setHoveredBuild] = useState<string | null>(null);
  const [handlers, setHandlers] = useState<any>(null);
  const [isUsernameDialogOpen, setIsUsernameDialogOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadHandlers = async () => {
      const { handleLaunchBuild, handleAddBuild, handleCloseBuild } =
        await import("../../modules/builds/handlers");
      setHandlers({ handleLaunchBuild, handleAddBuild, handleCloseBuild });
    };

    loadHandlers();
  }, []);

  useEffect(() => {
    if (handlers?.checkifopen) {
      handlers.checkifopen(setActiveBuild);
    }
  }, [handlers]);

  const handlelaunchBuild = async (path: string, version: string) => {
    const username = localStorage.getItem("settings.username");

    if (!username || username === "") {
      setIsUsernameDialogOpen(true);
      return;
    }

    if (handlers?.handleLaunchBuild) {
      await handlers.handleLaunchBuild(
        path,
        version,
        activeBuild,
        setActiveBuild,
        setIsDialogOpen
      );
    }
  };

  const handleAddBuild = async () => {
    if (handlers?.handleAddBuild) {
      await handlers.handleAddBuild(setIsLoading);
    }
  };

  const handleCloseBuild = async () => {
    if (handlers?.handleCloseBuild) {
      await handlers.handleCloseBuild(setActiveBuild, setIsDialogOpen);
      setActiveBuild(null);
      setIsDialogOpen(false);
    }
  };

  const builds = Array.from(buildState?.builds?.values() || []);

  return (
    <div className="flex min-h-screen text-white">
      <Frame page={{ page: "Library" }} />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex-1 p-4"
      >
        <div className="mx-auto max-w-[1800px]">
          <h1 className="text-2xl font-bold mt-6 ml-1 mb-4">Library</h1>
          <NeptuneStatus />
          <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              <AnimatePresence>
                {builds.map((build, index) => {
                  if (!build) return null;
                  const versionNumber = Number(build.version);
                  const isActive = activeBuild === build.path;
                  const chapter =
                    versionNumber >= 32.11
                      ? "Chapter 6"
                      : versionNumber >= 27.11
                        ? "Chapter 5"
                        : versionNumber >= 23.0
                          ? "Chapter 4"
                          : versionNumber >= 18.40
                            ? "Chapter 3"
                            : versionNumber >= 10.40
                              ? "Chapter 2"
                              : "Chapter 1";

                  return (
                    <motion.div
                      key={build.path}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className={`group relative overflow-hidden rounded-lg bg-white/10 hover:bg-white/20 transition-all ${isActive ? "" : ""
                        }`}
                      onMouseEnter={() => setHoveredBuild(build.path)}
                      onMouseLeave={() => setHoveredBuild(null)}
                    >
                      <button
                        className="w-full text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                        onClick={() =>
                          handlelaunchBuild(build.path, build.version)
                        }
                        disabled={activeBuild !== null && !isActive}
                      >
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={build.splash}
                            alt={`Version ${build.version}`}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          {isActive && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                              <Pause className="h-8 w-8 text-white" />
                            </div>
                          )}
                          {hoveredBuild === build.path && !isActive && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                              <Play className="h-8 w-8 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-[#1F2025]">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-white">
                              v{build.version}
                            </span>
                            <span className="text-xs text-white/70">
                              {chapter}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white/70 truncate max-w-[70%]">
                              {build.real}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                buildState?.remove?.(build.path);
                              }}
                            >
                              <Trash2 className="h-3 w-3 text-white" />
                            </Button>
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>

        <button
          className="fixed bottom-4 right-4 shadow-lg bg-[#1F2025] text-white border border-white/20 rounded-md px-3 py-2 text-sm font-medium flex items-center justify-center hover:bg-[#2F3035] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1F2025] focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={() => handleAddBuild()}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1.5" />
              Add
            </>
          )}
        </button>
        <div className="flex justify-center">
          <p className="text-xs text-gray-400 bold">
            Launcher made with ❤️ by Itztiva
          </p>
        </div>
      </motion.main>

      <Dialog open={isUsernameDialogOpen} onOpenChange={setIsUsernameDialogOpen}>
        <DialogContent className="sm:max-w-[325px] bg-[#1F2025] text-white">
          <DialogHeader>
            <DialogTitle>Set Your Username</DialogTitle>
            <DialogDescription className="text-white/70">
              Please go to the settings and set your username before launching the game.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsUsernameDialogOpen(false)
                window.location.href = "/settings";
              }}
              className="bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[325px] bg-[#1F2025] text-white">
          <DialogHeader>
            <DialogTitle>Close Game</DialogTitle>
            <DialogDescription className="text-white/70">
              Are you sure you want to close your game?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(false)}
              className="bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleCloseBuild}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Close Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
