"use client"

import React, { useState } from "react"
import { Window } from "../Window"
import { useWindowManager } from "../WindowManagerContext"

// Photo data from the original site
const photoData = [
    {
        id: 1,
        title: "Urban Colors",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-11-14T10%CB%9036%CB%9041.058Z%5D%203m5licgdmls2s%2001-k0YlTbnbKGVEUpevZlbGX71glZSp7a.jpg",
        description: "Colorful apartment building against a clear blue sky",
        type: "photography"
    },
    {
        id: 2,
        title: "Yellow & Teal",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-11-14T10%CB%9036%CB%9041.058Z%5D%203m5licgdmls2s%2002-IKzJ6vLHR1GbcXaNPRTTzX1yVoIbyA.jpg",
        description: "Building facade with contrasting yellow and teal panels",
        type: "photography"
    },
    {
        id: 3,
        title: "Modernist Architecture",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-11-14T10%CB%9036%CB%9041.058Z%5D%203m5licgdmls2s%2003-bc5x6yrs67LNMilcCLo1D9hEW5tCnh.jpg",
        description: "Yellow and white buildings with weathered blue fence",
    },
    {
        id: 4,
        title: "Mirror in the Garden",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-11-14T10%CB%9039%CB%9005.355Z%5D%203m5ligrgo6s2c%2001-88QNFfhUGgGxDIyu1C3szdwN3EFFIo.jpg",
        description: "Convex mirror reflection among lush green vegetation",
    },
    {
        id: 5,
        title: "Palm Trees",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-11-14T10%CB%9039%CB%9005.355Z%5D%203m5ligrgo6s2c%2002-m68tVCwlHQ3vcFaoTX0Mjrci0eMFdT.jpg",
        description: "Palm trees swaying against a clear blue sky",
    },
    {
        id: 6,
        title: "Parking Lot Exit",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-11-14T10%CB%9039%CB%9005.355Z%5D%203m5ligrgo6s2c%2003-sLZ2564WL4SQls45f389TegUqvMKmq.jpg",
        description: "Covered parking area with sunlight at the exit",
    },
    {
        id: 7,
        title: "Walrus Board",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-08-17T10%CB%9057%CB%9009.607Z%5D%203lwlpxgnxas2d%2002-mx4te9CQt4Lu25NKbz0RVpzaCJAibN.jpg",
        description: "Corkboard with walrus photos and handwritten notes",
    },
    {
        id: 8,
        title: "Palm Pathway",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-11-29T19%CB%9011%CB%9050.232Z%5D%203m6s43s6ozk2b%2002-JqjWer4frRidrwQoDKVQTrkNNYmznF.jpg",
        description: "Traditional pathway lined with palm trees and festive flags",
    },
    {
        id: 9,
        title: "Mountain Vista",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-11-29T19%CB%9011%CB%9050.232Z%5D%203m6s43s6ozk2b%2003-6ol5nJM0p0fMsSjmFOm1M6trwdWEtd.jpg",
        description: "Mountains rising above palm tree canopy at golden hour",
    },
    {
        id: 10,
        title: "Traditional Crafts",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-11-29T19%CB%9011%CB%9050.232Z%5D%203m6s43s6ozk2b%2001-OEgh3jYNcOTVm02wv0lVbXXZhr9KGI.jpg",
        description: "Woven baskets and pottery hanging on a tree with flags",
    },
    {
        id: 11,
        title: "Red Room",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-08-17T10%CB%9055%CB%9055.808Z%5D%203lwlpvr3d3k2d%2001-QoGTClRCRkdallxDMVebeZCFVeV4q8.jpg",
        description: "Abstract installation with red light and black shapes",
        type: "artwork"
    },
    {
        id: 12,
        title: "Striped Poles",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-06-13T19%CB%9004%CB%9046.947Z%5D%203lrj4vugxos2a%2001-lJjgHPaalZ4OA5dkPcHwvXUWdAdgGc.jpg",
        description: "Red and white barrier poles at night",
    },
    {
        id: 13,
        title: "Aquarium",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-08-17T10%CB%9055%CB%9040.804Z%5D%203lwlpva6ndc2d%2001-7orp9E8qHEG0oYf7T9XmLKO516nQkD.jpg",
        description: "Silhouette watching through a window",
    },
]

const artworkFiles = [
    { title: "Frieren", file: "Frieren.jpg" },
    { title: "sip", file: "sip.png" },
    { title: "Yuuri", file: "Yuuri.jpeg" },
    { title: "kiyo-fanart", file: "just-as-you-are.jpg" },
]

export function ArtworkWindow({ mode = "pictures" }: { mode?: "pictures" | "artwork" }) {
    const { openWindow } = useWindowManager()

    // Transform artwork files to Photo format
    const artworkData = artworkFiles.map((file, index) => ({
        id: 1000 + index,
        title: file.title,
        url: `/${file.file}`,
        description: "Digital Artwork",
        type: "artwork" as const
    }))

    const displayData = mode === "artwork" ? artworkData : photoData
    const windowIcon = mode === "artwork" ? "/icons/artwork.ico" : "/icons/pictures.ico"
    const windowTitle = mode === "artwork" ? "Artwork" : "My Pictures"
    const addressPath = mode === "artwork" ? "C:\\Users\\tskq\\My Pictures\\Artwork" : "C:\\Users\\tskq\\My Pictures"
    const [selectedId, setSelectedId] = useState<number | null>(null)

    const handleDoubleClick = (photo: typeof photoData[0]) => {
        openWindow(
            `imageviewer-${photo.id}`,
            `${photo.title} - Windows Picture and Fax Viewer`,
            "imageviewer",
            windowIcon,
            { photo }
        )
    }

    return (
        <Window
            id={mode}
            title={windowTitle}
            icon={windowIcon}
            defaultWidth={700}
            defaultHeight={500}
        >
            <div className="explorer-window">
                {/* Explorer Toolbar */}
                <div className="explorer-toolbar">
                    <div className="toolbar-buttons">
                        <button className="toolbar-btn" disabled>Back</button>
                        <button className="toolbar-btn" disabled>Forward</button>
                        <button className="toolbar-btn" disabled>Up</button>
                    </div>
                    <div className="address-bar">
                        <span className="address-label">Address</span>
                        <div className="address-input">
                            <img src={windowIcon} alt="" className="address-icon" />
                            <span>{addressPath}</span>
                        </div>
                    </div>
                </div>

                {/* Thumbnail View */}
                <div className="explorer-content thumbnails-view">
                    <div className="thumbnail-grid">
                        {displayData.map(photo => (
                            <div
                                key={photo.id}
                                className={`thumbnail-item ${selectedId === photo.id ? "selected" : ""}`}
                                onClick={() => setSelectedId(photo.id)}
                                onDoubleClick={() => handleDoubleClick(photo)}
                                title={photo.description}
                            >
                                <div className="thumbnail-image">
                                    <img src={photo.url} alt={photo.title} loading="lazy" />
                                </div>
                                <span className="thumbnail-name">{photo.title}.jpg</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Bar */}
                <div className="explorer-statusbar">
                    <span>{photoData.length} objects</span>
                    {selectedId && (
                        <span className="status-selected">
                            {photoData.find(p => p.id === selectedId)?.title}
                        </span>
                    )}
                </div>
            </div>
        </Window>
    )
}
