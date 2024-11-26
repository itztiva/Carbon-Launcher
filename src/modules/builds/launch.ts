import { invoke } from "@tauri-apps/api/core";
import { sendNotification } from "@tauri-apps/plugin-notification";
import * as path from '@tauri-apps/api/path';

const basic = await path.localDataDir();

export const launchBuild = async (selectedPath: string, version: string) => {
    const path = selectedPath.replace("/", "\\");
    const username = localStorage.getItem("settings.username") || null;

    if (username == null) {
        sendNotification({
            title: "Error",
            body: "Please set your username in settings!",
            sound: "ms-winsoundevent:Notification.Default"
        })
        return false;
    }

    sendNotification({ title: `Downloading Required Files`, body: `This may take awhile depending on your internet!`, sound: "ms-winsoundevent:Notification.Default" });

    const files = await fetch("http://neptune.cbn.lol/assets/CarbonLauncher/neededFiles.json").then(res => res.json());

    let fileTaskCompleted = false;

    await Promise.all(files.map(async (file: any) => {
        const downloadPath = basic + "\\com.crbon.xyz\\Resources\\";

        const exists = await invoke("check_file_exists", {
            path: downloadPath + file.name,
            size: file.size
        });

        if (!exists && !file.name.includes(".rar")) {
            await invoke("download_game_file", {
                url: file.url,
                dest: downloadPath + file.name,
            });
        }

        if (file.name.includes(".rar")) {
            console.log("wow")
            const rarexists = await invoke("check_file_exists", {
                path: downloadPath + file.name.replace(".rar", ""),
                size: file.size
            });

            if (!rarexists) {
                const downloaded = await invoke("download_game_file", {
                    url: file.url,
                    dest: downloadPath + file.name,
                });

                if (downloaded) {
                    const rarexists = await invoke("check_file_exists", {
                        path: downloadPath + file.name,
                        size: file.size
                    });
                    if (rarexists) {
                        await invoke("extract_rar", {
                            path: downloadPath + file.name,
                        });
                    }
                }
            }
        }

    }));

    fileTaskCompleted = true;

    if (fileTaskCompleted) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        sendNotification({ title: `Starting ${version}`, body: `This may take awhile so please wait while the game loads!`, sound: "ms-winsoundevent:Notification.Default" });

        console.log("launching", version)

        await invoke("experience", {
            path,
            username,
            version: version,
        });

        return true;
    }

    return true;
}  