'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Frame from '@/components/core/Sidebar'

export default function Home() {
  useEffect(() => {
    const setRPC = async () => {
      try {
        const { invoke } = await import("@tauri-apps/api/core")
        await invoke('rich_presence')
      } catch (error) {
        console.error('Failed to set rpc:', error)
      }
    }

    setRPC()
  }, [])

  return (
    <div className="flex h-screen">
      <Frame page={{ page: 'Home' }} />
      <main className="flex-grow p-4 text-white">
        <h1 className="text-2xl font-bold mt-6 ml-1 mb-4">Home</h1>
        <div className="space-y-4">
          <div className="bg-[#2b2b2b] rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Welcome to Carbon!</h2>
            <p className="text-sm text-gray-300 mb-3">
              Welcome to Carbon! Make sure to join our Discord Server for important news
              and frequent updates! If you have any requests or encounter an issue, please let us know there.
            </p>
            <div className="space-y-2">
              <button
                className="w-full bg-gradient-to-r from-[#454FBF] to-[#3FA9F5] hover:brightness-110 text-white font-bold py-3 px-4 rounded text-sm flex items-center justify-center transition-all duration-200 relative overflow-hidden"
                style={{
                  boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.2)'
                }}
              >
                <span className="flex-grow text-center">Launch Fortnite</span>
                <div
                  className="absolute right-0 top-1/2 w-16 h-16 opacity-25"
                  style={{
                    background: 'url(/battlebus.PNG) no-repeat center center',
                    backgroundSize: 'contain',
                    transform: 'translateY(-50%) translateX(25%) rotate(15deg)'
                  }}
                />
              </button>
              <button
                className="w-full bg-gradient-to-r from-[#454FBF] to-[#6B77E5] hover:brightness-110 text-white font-bold py-3 px-4 rounded text-sm flex items-center justify-center transition-all duration-200 relative overflow-hidden"
                style={{
                  boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.2)'
                }}
              >
                <span className="flex-grow text-center relative z-10">Join our Discord</span>
                <div
                  className="absolute right-0 top-1/2 w-16 h-16 opacity-25"
                  style={{
                    background: 'url(/disc2.png) no-repeat center center',
                    backgroundSize: 'contain',
                    transform: 'translateY(-50%) translateX(25%) rotate(15deg)'
                  }}
                />
              </button>
            </div>
          </div>

          <div className="bg-[#2b2b2b] rounded-lg p-4">
            <div className="flex">
              <div className="flex-grow pr-3">
                <h3 className="text-base font-semibold mb-1">
                  Introducing: <span className="text-[#d580ff]">Carbon Launcher</span>
                </h3>
                <p className="text-sm text-gray-300 mb-1">
                  You spoke, and we listened. Were you one of the thousands tired of the annoying
                  console app? Well lucky enough for you, Cranium is easier than ever to use with
                  the new Carbon Launcher. More updates coming shortly, but until then enjoy!
                </p>
                <p className="text-xs text-gray-400 italic">
                  With love, the Carbon team ❤️
                </p>
              </div>
              <div className="flex-shrink-0">
                <Image src="/fist.jpg" alt="Feature Image" width={130} height={130} className="rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

