"use client"

import { useState, type ReactNode } from "react"

interface DesktopIconProps {
  id: string
  label: string
  icon: ReactNode
  position: { x: number; y: number }
  onDoubleClick: () => void
  isSelected: boolean
  onSelect: () => void
}

export function DesktopIcon({
  id,
  label,
  icon,
  position,
  onDoubleClick,
  isSelected,
  onSelect,
}: DesktopIconProps) {
  return (
    <div
      className={`xp-desktop-icon absolute flex flex-col items-center w-[75px] p-1 cursor-pointer select-none ${isSelected ? "selected" : ""}`}
      style={{ left: position.x, top: position.y }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onDoubleClick()
      }}
    >
      <div className="w-12 h-12 flex items-center justify-center mb-1">
        {icon}
      </div>
      <span className={`text-xs text-center leading-tight px-1 ${isSelected ? "bg-[#316ac5] text-white" : "text-white xp-icon-text"}`}>
        {label}
      </span>
    </div>
  )
}
