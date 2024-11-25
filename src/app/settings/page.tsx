import Frame from "@/components/core/Sidebar";

export default function Settings() {
    return (
        <div className="flex h-screen">
            <Frame page={{ page: "Settings" }} />
            <main className="flex-grow p-4 text-white">
                <div className="absolute bottom-5 left-8 w-full flex justify-center">
                    <p className="text-xs text-gray-400 bold">
                        Launcher made with ❤️ by Itztiva, UI made by t8do
                    </p>
                </div>
            </main>
        </div>
    );
}
