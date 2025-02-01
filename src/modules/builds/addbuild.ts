
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
            return true;
        }

        const splash = `${selectedPath}\\FortniteGame\\Content\\Splash\\Splash.bmp`
        const exe = `${selectedPath}\\FortniteGame\\Binaries\\Win64\\FortniteClient-Win64-Shipping.exe`

        const hash = (await invoke("calculate_sha256_of_file", { filePath: exe })
            .catch(() => undefined)) as string | undefined

        if (hash === undefined || typeof KNOWN_FILE_HASHES_256 !== 'object') {
            sendNotification({ title: "Error", body: "Invalid Build!" })
            return true;
        }

        const splashExists = await invoke("check_file_exists", { path: splash, size: null })

        let version = "Unknown Version";
        let release = "Unknown CL";

        const hexCheck = await invoke("search_for_version", { path: exe }) as string[];
        console.log(hexCheck);

        if (hexCheck.length === 0) {
            sendNotification({ title: "Error", body: "Invalid Build!" });
            return true;
        }

        let foundMatch = false;
        for (const str of hexCheck) {
            const match = str.match(/\+\+Fortnite\+Release-(\d+\.\d+)-CL-(\d+)/);
            if (match) {
                version = match[1];
                release = `${version}-CL-${match[2]}`;
                foundMatch = true;
                break;
            } else if (str.includes("Live")) {
                if (match) {
                    switch (match[2]) {
                        case "3870737": { version = "2.4.2"; release = "2.4.2-CL-3870737"; break; }
                        case "3858292": { version = "2.4"; release = "2.4-CL-3858292"; break; }
                        case "3847564": { version = "2.3"; release = "2.3-CL-3847564"; break; }
                        case "3841827": { version = "2.2"; release = "2.2-CL-3841827"; break; }
                        case "3825894": { version = "2.1"; release = "2.1-CL-3825894"; break; }
                        case "3807424": { version = "1.11"; release = "1.11-CL-3807424"; break; }
                        case "3790078": { version = "1.10"; release = "1.10-CL-3790078"; break; }
                        case "3775276": { version = "1.91"; release = "1.91-CL-3775276"; break; }
                        case "3757339": { version = "1.9"; release = "1.9-CL-3757339"; break; }
                        case "3729133": { version = "1.81"; release = "1.81-CL-3729133"; break; }
                        case "3724489": { version = "1.8"; release = "1.8-CL-3724489"; break; }
                        case "3700114": { version = "1.72"; release = "1.72-CL-3700114"; break; }
                        case "3541083": { version = "1.2"; release = "1.2-CL-3541083"; break; }
                        case "3532353": { version = "1.0"; release = "1.0-CL-3532353"; break; }
                    }
                }
            }
        }

        if (!foundMatch) {
            sendNotification({ title: "Error", body: "Invalid Build!" });
            return true;
        }

        const data = {
            splash: splashExists ? convertFileSrc(splash) : "no splash",
            path: selectedPath.toString(),
            version: version || "?",
            real: release || "Unknown Version",
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