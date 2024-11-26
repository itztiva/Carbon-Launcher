'use client'

import { useState, useEffect } from 'react'

export function NeptuneStatus() {
  const [status, setStatus] = useState<'up' | 'down' | 'loading'>('loading')

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('https://neptune.cbn.lol/status/ping')
        const data = await response.json()
        if (data.status === 200 && data.message === "pong") {
          setStatus('up')
        } else {
          const fallback = await fetch("https://neptune_reroute.crbon.xyz/status/ping")
          const data = await fallback.json()
          if (data.status === 200 && data.message === "pong") {
            setStatus('up')
          } else {
            setStatus('down')
          }
        }
      } catch (error) {
        console.error('Failed to fetch status:', error)
        setStatus('down')
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 600000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-11 right-4 flex items-center space-x-2 bg-black bg-opacity-40 backdrop-filter backdrop-blur-md rounded-full px-3 py-1.5 shadow-xl border border-white/10">
      <div
        className={`w-2.5 h-2.5 rounded-full ${status === 'up' ? 'bg-green-500 shadow-green-500/50' :
            status === 'down' ? 'bg-red-500 shadow-red-500/50' :
              'bg-yellow-500 shadow-yellow-500/50'
          } shadow-glow`}
      />
      <span className="text-xs text-white/90 font-medium">
        {status === 'up' ? 'Online' :
          status === 'down' ? 'Offline' :
            'Checking...'}
      </span>
    </div>
  )
}

