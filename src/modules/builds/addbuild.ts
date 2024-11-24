
"use client";

import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { convertFileSrc } from "@tauri-apps/api/core";
import useBuilds from "@/modules/builds/state";
import { sendNotification } from "@tauri-apps/plugin-notification";

export const handleAddBuild = async () => {
    const buildState = useBuilds.getState()
    try {
        const selectedPath = await open({ directory: true, multiple: false })

        if (!selectedPath) {
            return null
        }

        const splash = `${selectedPath}\\FortniteGame\\Content\\Splash\\Splash.bmp`
        const exe = `${selectedPath}\\FortniteGame\\Binaries\\Win64\\FortniteClient-Win64-Shipping.exe`

        const splashExists = await invoke("check_file_exists", { path: splash, size: null })

        const data = {
            splash: splashExists ? convertFileSrc(splash) : "no splash",
            path: selectedPath.toString(),
            version: "?",
            real: "Unknown Version",
            verified: true,
            open: false,
            loading: false,
        }

        buildState.add(selectedPath.toString(), data)
        return true;
    } catch (error) {
        console.error("Error adding build:", error)
        sendNotification({ title: "carbon", body: "Error adding build!" })
    } finally {

    }
}