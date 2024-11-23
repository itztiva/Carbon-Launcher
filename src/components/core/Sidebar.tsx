'use client'

import {
    HiOutlineHome,
    HiOutlineFolder,
    HiOutlineCog,
} from "react-icons/hi";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Frame({ page }: { page: { page: string } }) {
    const router = useRouter();

    const frameUpdate = (route: string) => {
        router.push(route);
    };

    const getClassName = (route: string) => {
        return route === page.page
            ? "hover:text-gray-100 text-gray-100 w-7 h-7 transition-colors"
            : "hover:text-gray-100 text-gray-400 w-7 h-7 transition-colors";
    };

    const getClassName2 = (route: string) => {
        return route === page.page
            ? "p-2 bg-opacity-20 bg-[#3e4652] rounded-lg hover:scale-105 transition-transform"
            : "p-2 hover:scale-105 transition-transform";
    }

    return (
        <div>
            <aside className="w-16 md:w-16 sm:w-14 bg-[#16171b] p-4 h-screen flex flex-col border-r border-gray-700">
                    <nav className="flex-grow flex flex-col items-center space-y-4">
                    <div className="w-14 mb-2 mt-2 flex justify-start relative">
                        <div className="absolute inset-0 bg-white opacity-75 blur-md rounded-full animate-pulse"></div>
                        <Image
                            src="/icon.png"
                            alt="Carbon Icon"
                            width={100}
                            height={100}
                            className="relative z-10"
                        />
                    </div>
                    <div className={getClassName2("Home")}>
                        <button className="flex items-center space-x-2" onClick={() => frameUpdate("/")}>
                            <HiOutlineHome className={getClassName("Home")} />
                        </button>
                    </div>
                    <div className={getClassName2("Library")}>
                        <button className="flex items-center space-x-2" onClick={() => frameUpdate("/library")}>
                            <HiOutlineFolder className={getClassName("Library")} />
                        </button>
                    </div>
                    <div className="flex-grow"></div>
                    <div className={getClassName2("Settings")}>
                        <button className="flex items-center space-x-2" onClick={() => frameUpdate("/settings")}>
                            <HiOutlineCog className={getClassName("Settings")} />
                        </button>
                    </div>
                </nav>
            </aside>
        </div>
    );
}

