"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DiscordPresence } from "@/components/discord-presence";
import { Terminal } from "@/components/terminal";
import { SocialLinks } from "@/components/social-links";
import { cn } from "@/lib/utils";

// Photo metadata
interface Photo {
  id: number
  title: string
  filename?: string
  url?: string
  description: string
}

const initialPhotoData: Photo[] = [
  {
    id: 1,
    title: "Urban Colors",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-11-14T10%CB%9036%CB%9041.058Z%5D%203m5licgdmls2s%2001-k0YlTbnbKGVEUpevZlbGX71glZSp7a.jpg",
    description: "Colorful apartment building against a clear blue sky",
  },
  {
    id: 2,
    title: "Yellow & Teal",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tskq.bsky.social%20%5B2025-11-14T10%CB%9036%CB%9041.058Z%5D%203m5licgdmls2s%2002-IKzJ6vLHR1GbcXaNPRTTzX1yVoIbyA.jpg",
    description: "Building facade with contrasting yellow and teal panels",
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
];

// Modal component for zoom + pan
function ZoomableModal({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Lock background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setZoom((z) => Math.max(z + delta, 0.1));
  }, []);

  const startDrag = (e: React.MouseEvent) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onDrag = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const endDrag = () => {
    dragging.current = false;
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
      onMouseUp={endDrag}
    >
      <div
        className="relative cursor-grab w-[80vw] h-[80vh]"
        onWheel={handleWheel}
        onMouseDown={startDrag}
        onMouseMove={onDrag}
      >
        {/* Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-2 left-2 z-10 text-white bg-black bg-opacity-60 hover:bg-opacity-80 rounded p-1 font-bold"
        >
          ✕
        </button>
        <img
          src={src}
          alt={alt}
          draggable={false}
          onClick={(e) => e.stopPropagation()}
          className="w-full h-full object-contain select-none transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          }}
        />
        <div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-green-400 font-mono text-sm px-3 py-1 rounded shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          Scroll to zoom in/out
        </div>
      </div>
    </div>
  );
}

function UploadPhotoModal({
  onSubmit,
  onClose,
}: {
  onSubmit: (data: Photo) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    const url = URL.createObjectURL(file);
    onSubmit({ id: Date.now(), title, description, url });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-4 rounded shadow-md flex flex-col gap-2"
      >
        <input
          className="px-2 py-1 bg-black border border-gray-700 text-white"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="px-2 py-1 bg-black border border-gray-700 text-white"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-white"
        />
        <div className="flex gap-2 justify-end mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 border border-gray-700 text-white rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-500 text-black px-3 py-1 rounded hover:bg-green-400"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  );
}

// Main page
export default function Home() {
  const [showPhotos, setShowPhotos] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [hoverEmoji, setHoverEmoji] = useState(false);
  const [scrollArrows, setScrollArrows] = useState({ down: true, up: false });
  const [modal, setModal] = useState<{ src: string; alt: string } | null>(null);
  const [photoData, setPhotoData] = useState<Photo[]>(initialPhotoData);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Always show vertical scrollbar to prevent layout shift
  useEffect(() => {
    document.body.style.overflowY = "scroll";
    return () => {
      document.body.style.overflowY = "";
    };
  }, []);

  // Clock
  useEffect(() => {
    const tick = () => setCurrentTime(new Date().toLocaleTimeString());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Scroll arrow visibility
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const photoSection = document.getElementById("photos-section");
      const photoTop = photoSection?.offsetTop || Infinity;
      setScrollArrows({
        down: y < 100 && showPhotos,
        up: y > photoTop - 100 && showPhotos,
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [showPhotos]);

  const scrollToPhotos = () =>
    window.scrollTo({
      top: document.getElementById("photos-section")?.offsetTop || 0,
      behavior: "smooth",
    });
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const openImage = (src: string, alt: string) => setModal({ src, alt });
  const handleAddPhoto = (photo: Photo) => {
    setPhotoData((prev) => [...prev, photo]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Navbar / Presence */}
      <div className="absolute top-6 left-6 z-50">
        <span
          className="font-mono text-green-400 text-5xl hover:text-green-200 transition-colors"
          onMouseEnter={() => setHoverEmoji(true)}
          onMouseLeave={() => setHoverEmoji(false)}
        >
          {hoverEmoji ? "(づ￣ 3￣)づ" : "(/≧▽≦)/"}
        </span>
      </div>
      <DiscordPresence
        userId="1002839537644482611"
        onAdminUpload={() => setShowUploadForm(true)}
      />

      {/* Main content */}
      <main className="flex-1 px-6 py-8">
        <section className="mb-12">
          <p className="font-mono text-green-300 mb-2">
            &gt; Interactive Terminal Interface
          </p>
          <Terminal showPhotos={showPhotos} setShowPhotos={setShowPhotos} />
        </section>

        <section className="mb-12">
          <h2 className="font-mono text-green-400 text-lg mb-4">
            $ ls ~/social
          </h2>
          <SocialLinks />
        </section>

        <section className="flex flex-col items-center mb-12 space-y-4">
          <button
            onClick={() => setShowPhotos((v) => !v)}
            className="px-5 py-2 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black rounded transition"
          >
            {showPhotos ? "Hide Photos" : "Show Photos"}
          </button>
          {/* Scroll down arrow */}
          <div
            className={cn(
              "mt-4 text-green-500 text-5xl transition-opacity duration-500 animate-bounce glow cursor-pointer select-none",
              scrollArrows.down
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none",
            )}
            onClick={scrollToPhotos}
          >
            ↓
          </div>
        </section>

        {showPhotos && (
          <section id="photos-section" className="mb-12">
            <h2 className="font-mono text-green-400 text-lg mb-4">
              $ ls ~/photos - Shot with Canon EOS M6 - Hope you enjoy my photography, Dear visitor! ^-^
            </h2>
            <div className="masonry">
              {photoData.map((p) => (
                <div
                  key={p.id}
                  className="masonry-item border border-gray-800 p-4 hover:border-green-500 transition-colors rounded bg-black"
                >
                  <img
                    src={p.url ?? `/${p.filename}`}
                    alt={p.title}
                    className="w-full h-auto object-cover rounded shadow-lg mb-2 cursor-zoom-in"
                    onClick={() => openImage(p.url ?? `/${p.filename}`, p.title)}
                  />
                  <h3 className="terminal-white font-bold">{p.title}</h3>
                  <p className="terminal-white text-sm opacity-80">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Back to top arrow */}
      <div
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 rounded px-4 py-2 text-green-500 text-4xl transition-opacity duration-500 cursor-pointer glow",
          scrollArrows.up
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={scrollToTop}
      >
        ↑
      </div>

      {/* Footer */}
      <footer className="text-center py-4 font-mono text-gray-500">
        © {new Date().getFullYear()} – TskQ
        <div className="mt-1">system time: {currentTime}</div>
      </footer>

      {/* Modal */}
      {modal && (
        <ZoomableModal
          src={modal.src}
          alt={modal.alt}
          onClose={() => setModal(null)}
        />
      )}

      {showUploadForm && (
        <UploadPhotoModal
          onSubmit={handleAddPhoto}
          onClose={() => setShowUploadForm(false)}
        />
      )}
    </div>
  );
}
