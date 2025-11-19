"use client"

import {
  Instagram,
  Youtube,
  Music2,
  Twitter,
  Camera,
  createIcons,
  icons
} from "lucide-react"

export function SocialLinks() {
  const socialLinks = [
    {
      name: "Bsky",
      url: "https://bsky.app/profile/tskq.bsky.social",
      icon: <Camera size={20} />,
    },
    {
      name: "Instagram",
      url: "https://instagram.com/firas.log",
      icon: <Instagram size={20} />,
    },
    {
      name: "Guns.lol",
      url: "https://guns.lol/tskq",
      icon: <square-square size={20} />,
    },
    {
      name: "YouTube",
      url: "https://youtube.com/@tskku",
      icon: <Youtube size={20} />,
    },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="flex items-center gap-2 bg-black border border-green-500 text-green-500 px-4 py-2 rounded hover:bg-green-500 hover:text-black transition-colors">
            <span className="text-green-500 hover:text-black transition-colors">
              {link.icon}
            </span>
            <span className="font-bold">{link.name}</span>
          </button>
        </a>
      ))}
    </div>
  )
}
