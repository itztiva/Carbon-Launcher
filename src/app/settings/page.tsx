'use client'

import Frame from "@/components/core/Sidebar";
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { Toggle } from "@/components/ui/toggle";

export default function Settings() {
    const [settings, setSettings] = useState({
        autoNeonite: true,
        discordRPC: true,
        backendPort: '5595',
        alwaysOnTop: false,
        developerLog: true
    });

    useEffect(() => {
        const savedSettings = {
            autoNeonite: localStorage.getItem('settings.autoNeonite') === 'true',
            discordRPC: localStorage.getItem('settings.discordRPC') === 'true',
            backendPort: localStorage.getItem('settings.backendPort') || '5595',
            alwaysOnTop: localStorage.getItem('settings.alwaysOnTop') === 'true',
            developerLog: localStorage.getItem('settings.developerLog') === 'true'
        };
        setSettings(savedSettings);
    }, []);

    const updateSetting = (key: string, value: string | boolean) => {
        setSettings(prev => {
            const newSettings = { ...prev, [key]: value };
            localStorage.setItem(`settings.${key}`, value.toString());
            return newSettings;
        });
    };

    return (
        <div className="flex h-screen">
            <Frame page={{ page: "Settings" }} />
            <motion.main
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex-grow p-4 text-white">
                <div className="w-full ml-10 mt-6 max-w-2xl p-5 space-y-6 rounded-lg text-zinc-300">
                    <div className="bg-amber-950/50 border border-amber-600/50 p-4 rounded-md flex items-start space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-sm">
                            If you don&apos;t know what a setting does, don&apos;t modify it. Default settings will always be more optimal
                            for the standard user. If you have a question about a setting, please feel free to ask in our Discord!
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium bg-gradient-to-r from-pink-400 via-pink-500 to-purple-600 text-transparent bg-clip-text">AutoNeonite</h3>
                                <p className="text-sm text-zinc-400">Turn on/off automatically launching our backend.</p>
                            </div>
                            <Toggle checked={settings.autoNeonite} onChange={(value) => updateSetting('autoNeonite', value)} />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium bg-gradient-to-r from-blue-400 to-indigo-600 text-transparent bg-clip-text">DiscordRPC</h3>
                                <p className="text-sm text-zinc-400">Turn on and off Discord Rich Presence of the Carbon Launcher</p>
                            </div>
                            <Toggle checked={settings.discordRPC} onChange={(value) => updateSetting('discordRPC', value)} />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium bg-gradient-to-r from-red-400 to-pink-500 text-transparent bg-clip-text">Backend Port</h3>
                                <p className="text-sm text-zinc-400">Modify the port Cranium listens for on launch.</p>
                            </div>
                            <input
                                type="string"
                                value={settings.backendPort}
                                onChange={(e) => updateSetting('backendPort', e.target.value)}
                                className="w-24 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-right appearance-none"
                                style={{ WebkitAppearance: 'textfield', MozAppearance: 'textfield' }}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium bg-gradient-to-r from-orange-400 to-amber-500 text-transparent bg-clip-text">Always on Top</h3>
                                <p className="text-sm text-zinc-400">Launcher will always display on top.</p>
                            </div>
                            <Toggle checked={settings.alwaysOnTop} onChange={(value) => updateSetting('alwaysOnTop', value)} />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium bg-gradient-to-r from-teal-400 to-cyan-500 text-transparent bg-clip-text">Developer Log</h3>
                                <p className="text-sm text-zinc-400">Enables developer console log.</p>
                            </div>
                            <Toggle checked={settings.developerLog} onChange={(value) => updateSetting('developerLog', value)} />
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-6 left-8 w-full flex justify-center">
                    <p className="text-xs text-gray-400 bold">
                        Launcher made with ❤️ by Itztiva, UI made by t8do
                    </p>
                </div>
            </motion.main>
        </div>
    );
}
