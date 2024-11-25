
"use client";

import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { convertFileSrc } from "@tauri-apps/api/core";
import useBuilds from "@/modules/builds/state";
import { sendNotification } from "@tauri-apps/plugin-notification";
import { KNOWN_FILE_HASHES_256 } from "@/config/builds";

export const handleAddBuild = async () => {
    const buildState = useBuilds.getState()
    try {
        const selectedPath = await open({ directory: true, multiple: false })

        if (!selectedPath) {
            return null
        }

        const splash = `${selectedPath}\\FortniteGame\\Content\\Splash\\Splash.bmp`
        const exe = `${selectedPath}\\FortniteGame\\Binaries\\Win64\\FortniteClient-Win64-Shipping.exe`

        const hash = (await invoke("calculate_sha256_of_file", { filePath: exe })
            .catch(() => undefined)) as string | undefined

        if (hash === undefined || typeof KNOWN_FILE_HASHES_256 !== 'object') {
            sendNotification({ title: "Error", body: "Invalid Build!" })
            return null
        }

        const splashExists = await invoke("check_file_exists", { path: splash, size: null })

        const verified = KNOWN_FILE_HASHES_256[hash]
        if (!verified) {
            sendNotification({ title: "Error", body: "Invalid Build!" })
            return null
        }

        const data = {
            splash: splashExists ? convertFileSrc(splash) : "no splash",
            path: selectedPath.toString(),
            version: verified.version || "?",
            real: verified.release || "Unknown Version",
            verified: true,
            open: false,
            loading: false,
        }

        buildState.add(selectedPath.toString(), data)
        return true;
    } catch (error) {
        console.error("Error adding build:", error)
        sendNotification({ title: "Error", body: "Error adding build!" })
    } finally {

    }
}