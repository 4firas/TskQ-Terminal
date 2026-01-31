"use client"

import { Camera, User, FolderOpen, Globe, Info, Power } from "lucide-react"

interface StartMenuProps {
  onClose: () => void
  onOpenWindow: (windowId: string) => void
  userName: string
  avatarUrl?: string
}

export function XPStartMenu({ onClose, onOpenWindow, userName, avatarUrl }: StartMenuProps) {
  const menuItems = [
    { id: "photos", label: "My Pictures", icon: <Camera className="w-6 h-6" /> },
    { id: "socials", label: "Internet Explorer", icon: <Globe className="w-6 h-6" /> },
    { id: "about", label: "About Me", icon: <Info className="w-6 h-6" /> },
  ]

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9998]" onClick={onClose} />
      
      {/* Start Menu */}
      <div className="xp-start-menu fixed bottom-[30px] left-0 w-[380px] z-[9999]">
        {/* Header with User */}
        <div className="xp-start-header flex items-center gap-3 px-3 py-2">
          <div className="w-12 h-12 rounded-md overflow-hidden border-2 border-white/50">
            {avatarUrl ? (
              <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#5a8ac9] flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          <span className="text-white font-bold text-sm">{userName}</span>
        </div>

        {/* Menu Body */}
        <div className="xp-start-body flex">
          {/* Left Column - Programs */}
          <div className="flex-1 bg-white py-2">
            <div className="px-2 mb-2">
              <div className="text-xs text-gray-500 border-b border-gray-300 pb-1 mb-2">Programs</div>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className="w-full flex items-center gap-3 px-2 py-1 hover:bg-[#316ac5] hover:text-white rounded text-left text-sm"
                  onClick={() => {
                    onOpenWindow(item.id)
                    onClose()
                  }}
                >
                  <span className="text-[#316ac5]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            
            <div className="border-t border-gray-300 mx-2 pt-2">
              <div className="text-xs text-gray-500 mb-2">All Programs →</div>
            </div>
          </div>

          {/* Right Column - Places */}
          <div className="w-[160px] bg-[#d3e5fa] py-2">
            <button
              className="w-full flex items-center gap-2 px-3 py-1 hover:bg-[#316ac5] hover:text-white text-left text-sm"
              onClick={() => {
                onOpenWindow("photos")
                onClose()
              }}
            >
              <FolderOpen className="w-4 h-4" />
              <span>My Documents</span>
            </button>
            <button
              className="w-full flex items-center gap-2 px-3 py-1 hover:bg-[#316ac5] hover:text-white text-left text-sm"
              onClick={() => {
                onOpenWindow("photos")
                onClose()
              }}
            >
              <Camera className="w-4 h-4" />
              <span>My Pictures</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="xp-start-footer flex items-center justify-end gap-2 px-3 py-2">
          <button 
            className="flex items-center gap-2 text-white text-sm hover:underline"
            onClick={() => window.location.reload()}
          >
            <Power className="w-4 h-4" />
            <span>Turn Off Computer</span>
          </button>
        </div>
      </div>
    </>
  )
}
