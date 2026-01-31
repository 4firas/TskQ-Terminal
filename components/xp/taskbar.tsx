"use client"

import { useState, useEffect } from "react"
import type { ReactNode } from "react"

interface TaskbarItem {
  id: string
  title: string
  icon?: ReactNode
  isMinimized: boolean
}

interface TaskbarProps {
  items: TaskbarItem[]
  onStartClick: () => void
  onItemClick: (id: string) => void
  startMenuOpen: boolean
}

export function XPTaskbar({ items, onStartClick, onItemClick, startMenuOpen }: TaskbarProps) {
  const [time, setTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="xp-taskbar fixed bottom-0 left-0 right-0 h-[30px] flex items-center z-[9999]">
      {/* Start Button */}
      <button
        className={`xp-start-button h-full px-3 flex items-center gap-1 font-bold text-white text-sm ${startMenuOpen ? "active" : ""}`}
        onClick={onStartClick}
      >
        <img src="/xp-start-icon.png" alt="" className="w-5 h-5" onError={(e) => { e.currentTarget.style.display = 'none' }} />
        <span>start</span>
      </button>

      {/* Quick Launch Separator */}
      <div className="xp-separator mx-1" />

      {/* Taskbar Items */}
      <div className="flex-1 flex items-center gap-1 px-1 overflow-hidden">
        {items.map((item) => (
          <button
            key={item.id}
            className={`xp-taskbar-item h-[22px] px-2 flex items-center gap-1 text-xs text-white truncate max-w-[150px] ${item.isMinimized ? "" : "active"}`}
            onClick={() => onItemClick(item.id)}
          >
            {item.icon && <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>}
            <span className="truncate">{item.title}</span>
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="xp-system-tray h-full flex items-center px-2 gap-2">
        <div className="xp-tray-icons flex items-center gap-1">
          <span className="text-white text-xs">🔊</span>
        </div>
        <div className="xp-clock text-white text-xs font-tahoma">
          {time}
        </div>
      </div>
    </div>
  )
}
