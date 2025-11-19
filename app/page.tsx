"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DiscordPresence } from "@/components/discord-presence";
import { Terminal } from "@/components/terminal";
import { SocialLinks } from "@/components/social-links";
import { cn } from "@/lib/utils";

// Artwork metadata
interface Artwork {
  id: number
  title: string
  filename?: string
  url?: string
  description: string
}

const initialArtworkData: Artwork[] = [
  {
    id: 1,
    title: "Yuuri",
    filename: "Yuuri.jpeg",
    description: "From 'Girls last tour' my fav character, yuuri. :)",
  },
  {
    id: 2,
    title: "Eve shopping O-o",
    filename: "offscript.jpg",
    description: "Submission for off-script (F.A)",
  },
  {
    id: 3,
    title: "Ryo",
    filename: "sip.png",
    description: "ryo yamada sips the coffee ☕",
  },
  {
    id: 4,
    title: "More Kiyosumi",
    filename: "just-as-you-are.jpg",
    description:
      "only because kiyo herself said that there might be a reward :>",
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

function UploadArtworkModal({
  onSubmit,
  onClose,
}: {
  onSubmit: (data: Artwork) => void;
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
  const [showArtwork, setShowArtwork] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [hoverEmoji, setHoverEmoji] = useState(false);
  const [scrollArrows, setScrollArrows] = useState({ down: true, up: false });
  const [modal, setModal] = useState<{ src: string; alt: string } | null>(null);
  const [artworkData, setArtworkData] = useState<Artwork[]>(initialArtworkData);
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
      const artSection = document.getElementById("artwork-section");
      const artTop = artSection?.offsetTop || Infinity;
      setScrollArrows({
        down: y < 100 && showArtwork,
        up: y > artTop - 100 && showArtwork,
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [showArtwork]);

  const scrollToArtwork = () =>
    window.scrollTo({
      top: document.getElementById("artwork-section")?.offsetTop || 0,
      behavior: "smooth",
    });
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const openImage = (src: string, alt: string) => setModal({ src, alt });
  const handleAddArtwork = (art: Artwork) => {
    setArtworkData((prev) => [...prev, art]);
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
          <Terminal showArtwork={showArtwork} setShowArtwork={setShowArtwork} />
        </section>

        <section className="mb-12">
          <h2 className="font-mono text-green-400 text-lg mb-4">
            $ ls ~/social
          </h2>
          <SocialLinks />
        </section>

        <section className="flex flex-col items-center mb-12 space-y-4">
          <button
            onClick={() => setShowArtwork((v) => !v)}
            className="px-5 py-2 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black rounded transition"
          >
            {showArtwork ? "Hide Artwork" : "Show Artwork"}
          </button>
          {/* Scroll down arrow */}
          <div
            className={cn(
              "mt-4 text-green-500 text-5xl transition-opacity duration-500 animate-bounce glow cursor-pointer select-none",
              scrollArrows.down
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none",
            )}
            onClick={scrollToArtwork}
          >
            ↓
          </div>
        </section>

        {showArtwork && (
          <section id="artwork-section" className="mb-12">
            <h2 className="font-mono text-green-400 text-lg mb-4">
              $ ls ~/artwork - Hope you enjoy my art, Dear visitor! - If you
              have any questions regarding my work, feel free to drop a dm on
              discord~! ^-^
            </h2>
            <div className="masonry">
              {artworkData.map((a) => (
                <div
                  key={a.id}
                  className="masonry-item border border-gray-800 p-4 hover:border-green-500 transition-colors rounded bg-black"
                >
                  <img
                    src={a.url ?? `/${a.filename}`}
                    alt={a.title}
                    className="w-full h-auto object-cover rounded shadow-lg mb-2 cursor-zoom-in"
                    onClick={() => openImage(a.url ?? `/${a.filename}`, a.title)}
                  />
                  <h3 className="terminal-white font-bold">{a.title}</h3>
                  <p className="terminal-white text-sm opacity-80">
                    {a.description}
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
        <UploadArtworkModal
          onSubmit={handleAddArtwork}
          onClose={() => setShowUploadForm(false)}
        />
      )}
    </div>
  );
}
