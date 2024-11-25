'use client'

import Frame from "@/components/core/Sidebar";
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { Toggle } from "@/components/ui/toggle";

export default function Settings() {
    const [settings, setSettings] = useState({
        username: '',
        autoNeonite: true,
        discordRPC: true,
        backendPort: '5595',
        alwaysOnTop: false,
    });

    useEffect(() => {
        const savedSettings = {
            username: localStorage.getItem('settings.username') || '',
            autoNeonite: localStorage.getItem('settings.autoNeonite') === 'true',
            discordRPC: localStorage.getItem('settings.discordRPC') === 'true',
            backendPort: localStorage.getItem('settings.backendPort') || '5595',
            alwaysOnTop: localStorage.getItem('settings.alwaysOnTop') === 'true',
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
                className="flex-grow p-4 text-white overflow-hidden relative">
                <div className="absolute inset-0 overflow-y-auto">
                    <div className="w-full ml-10 mt-4 max-w-2xl p-5 space-y-6 rounded-lg text-zinc-300">
                        <div className="bg-amber-950/50 border border-amber-600/50 p-4 rounded-md flex items-start space-x-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p className="text-sm">
                                If you don&apos;t know what a setting does, don&apos;t modify it. Default settings will always be more optimal
                                for the standard user. If you have a question about a setting, please feel free to ask in our Discord!
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex-grow">
                                    <h3 className="font-medium bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">In-Game Username</h3>
                                    <p className="text-sm text-zinc-400">Set your in-game display name.</p>
                                </div>
                                <input
                                    type="text"
                                    value={settings.username}
                                    onChange={(e) => updateSetting('username', e.target.value)}
                                    placeholder="ex: Itztiva"
                                    className="w-48 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-right"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex-grow">
                                    <h3 className="font-medium bg-gradient-to-r from-pink-400 via-pink-500 to-purple-600 text-transparent bg-clip-text">AutoNeonite</h3>
                                    <p className="text-sm text-zinc-400">Turn on/off automatically launching our backend.</p>
                                </div>
                                <Toggle checked={settings.autoNeonite} onChange={(value: boolean) => updateSetting('autoNeonite', value)} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex-grow">
                                    <h3 className="font-medium bg-gradient-to-r from-blue-400 to-indigo-600 text-transparent bg-clip-text">DiscordRPC</h3>
                                    <p className="text-sm text-zinc-400">Turn on and off Discord Rich Presence of the Carbon Launcher</p>
                                </div>
                                <Toggle checked={settings.discordRPC} onChange={(value: boolean) => updateSetting('discordRPC', value)} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex-grow mr-4">
                                    <h3 className="font-medium bg-gradient-to-r from-red-400 to-pink-500 text-transparent bg-clip-text">Backend Port</h3>
                                    <p className="text-sm text-zinc-400">Modify the port Cranium listens for on launch.</p>
                                </div>
                                <div className="relative flex-shrink-0">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={settings.backendPort}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^0-9]/g, '');
                                            updateSetting('backendPort', value);
                                        }}
                                        className="w-24 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-right appearance-none"
                                        style={{
                                            WebkitAppearance: 'none',
                                            MozAppearance: 'textfield',
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex-grow">
                                    <h3 className="font-medium bg-gradient-to-r from-orange-400 to-amber-500 text-transparent bg-clip-text">Always on Top</h3>
                                    <p className="text-sm text-zinc-400">Launcher will always display on top.</p>
                                </div>
                                <Toggle checked={settings.alwaysOnTop} onChange={(value: boolean) => updateSetting('alwaysOnTop', value)} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-6 left-0 right-0 text-center">
                    <p className="text-xs text-gray-400 bold">
                        Launcher made with ❤️ by Itztiva, UI made by t8do
                    </p>
                </div>
            </motion.main>
        </div>
    );
}

