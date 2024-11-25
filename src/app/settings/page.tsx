import Frame from "@/components/core/Sidebar";

export default function Settings() {
  return (
    <div className="flex h-screen">
      <Frame page={{ page: "Settings" }} />
      <main className="flex-grow p-4 text-white"></main>
    </div>
  );
}
