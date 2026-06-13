import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import {
  Search,
  Heart,
  DownloadCloud,
  ExternalLink,
  Check,
  BookOpen,
  Layers,
  Image as ImageIcon,
  User,
  RefreshCw,
  ChevronDown
} from "lucide-react";
import titleImg from "../images/modstack-title.png";
import iconImg from "../images/placeholder.png";
import AuthButton from "../components/AuthButton";

// Type definitions based on Modpacks.net API spec
interface Modpack {
  id: number | string;
  name: string;
  description: string;
  summary: string;
  minecraft_version: string;
  mod_loader: string;
  icon_url: string | null;
  likes_count: number;
  downloads_count: number;
  author: string;
  platform?: string; // "local", "modrinth", "curseforge", "feedthebeast"
  updated_at?: string;
  mods_count?: number;
}

interface Mod {
  id: number;
  platform: string;
  platform_project_id: string;
  platform_version_id: string | null;
  mod_name: string;
  mod_slug: string | null;
  mod_icon_url: string | null;
  mod_description: string | null;
  file_name: string;
  file_url: string;
  file_size: number;
  added_at?: string;
}

interface Screenshot {
  id: number;
  image_url: string;
  caption: string;
  sort_order: number;
}

interface ModpackDetail extends Modpack {
  mods: Mod[];
  screenshots: Screenshot[];
}

interface CustomSelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: CustomSelectOption[];
  className?: string;
  id?: string;
  direction?: "up" | "down";
}

function CustomSelect({ value, onChange, options, className = "", id, direction = "down" }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value) || options[0];

  return (
    <div className={`relative ${className}`} ref={dropdownRef} id={id}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950/85 hover:bg-zinc-900 text-xs text-zinc-300 hover:text-white transition-all focus:outline-none focus:border-[#2596be] min-w-[130px] font-medium h-full min-h-[32px] text-left"
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className={`absolute left-0 ${direction === "up" ? "bottom-full mb-1.5" : "mt-1.5"} w-full min-w-[160px] max-h-[220px] overflow-y-auto rounded-xl border border-zinc-800 bg-[#111a24] p-1.5 shadow-2xl z-50 animate-in fade-in ${direction === "up" ? "slide-in-from-bottom-1" : "slide-in-from-top-1"} duration-150 scrollbar-thin`}>
          <div className="flex flex-col gap-0.5">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-[#2596be]/15 text-[#2596be]"
                      : "text-zinc-400 hover:bg-zinc-900/60 hover:text-white"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#2596be] flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function WorkshopPage() {
  // Search & Filter State
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // actual search performed
  const [source, setSource] = useState("all");
  const [gameVersion, setGameVersion] = useState("all");
  const [modLoader, setModLoader] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Data State
  const [modpacks, setModpacks] = useState<Modpack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detail Modal State
  const [activeId, setActiveId] = useState<number | string | null>(null);
  const [activeModpack, setActiveModpack] = useState<ModpackDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailTab, setDetailTab] = useState<"overview" | "mods" | "screenshots">("overview");

  // Common versions and loaders list for filters (state loaded dynamically from Modrinth API)
  const [minecraftVersions, setMinecraftVersions] = useState<string[]>([
    "1.21.1", "1.21", "1.20.1", "1.20", "1.19.4", "1.19.2", "1.18.2", "1.16.5"
  ]);
  const modLoaders = ["Fabric", "Forge", "NeoForge", "Quilt"];

  const sourceOptions = [
    { label: "All Sources", value: "all" },
    { label: "Modstack Local", value: "local" },
    { label: "Modrinth", value: "modrinth" },
    { label: "CurseForge", value: "curseforge" },
    { label: "Feed The Beast", value: "feedthebeast" },
  ];

  const versionOptions = [
    { label: "All Versions", value: "all" },
    ...minecraftVersions.map(v => ({ label: v, value: v })),
  ];

  const loaderOptions = [
    { label: "All Loaders", value: "all" },
    ...modLoaders.map(l => ({ label: l, value: l })),
  ];

  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Most Likes", value: "likes" },
    { label: "Name", value: "name" },
  ];

  // Fetch available Minecraft versions dynamically from Modrinth API
  useEffect(() => {
    fetch("https://api.modrinth.com/v2/tag/game_version")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch game versions");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const releases = data
            .filter((item: any) => item.version_type === "release")
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((item: any) => item.version);

          // Filter for modern versions >= 1.16
          const modernReleases = releases.filter((v: string) => {
            const match = v.match(/^1\.(\d+)(?:\.(\d+))?$/);
            if (match) {
              const major = parseInt(match[1], 10);
              return major >= 16;
            }
            return false;
          });

          if (modernReleases.length > 0) {
            setMinecraftVersions(modernReleases);
          }
        }
      })
      .catch((err) => console.error("Error fetching game versions:", err));
  }, []);

  // Handle dynamic background blobs placement
  useEffect(() => {
    const blobs = document.querySelectorAll(".blob-dynamic");
    blobs.forEach((blob) => {
      const el = blob as HTMLElement;
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      el.style.width = `${420 + Math.random() * 520}px`;
      el.style.height = `${420 + Math.random() * 520}px`;
      el.style.animationDelay = `${Math.random() * 6}s`;
    });
  }, []);

  // Fetch Modpacks (Search vs General list)
  const fetchModpacks = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = "";
      if (searchTerm.trim() !== "") {
        // Use Search API
        url = `https://modpacks.net/api/v1/search?q=${encodeURIComponent(searchTerm)}&source=${source}&page=${page}&per_page=12`;
        if (gameVersion !== "all") url += `&gameVersion=${gameVersion}`;
        if (modLoader !== "all") url += `&modLoader=${modLoader}`;
      } else {
        // Use modpacks list API (only local community modpacks)
        url = `https://modpacks.net/api/v1/modpacks?page=${page}&per_page=12&sort=${sortBy}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const envelope = await response.json();

      if (envelope.success) {
        let items: Modpack[] = envelope.data || [];

        // If not searching (local list mode), filter version & loader client-side
        if (searchTerm.trim() === "") {
          items = items.map(item => ({ ...item, platform: "local" }));
          
          if (gameVersion !== "all") {
            items = items.filter(item => item.minecraft_version === gameVersion);
          }
          if (modLoader !== "all") {
            items = items.filter(item => 
              item.mod_loader.toLowerCase().includes(modLoader.toLowerCase())
            );
          }
        }

        setModpacks(items);

        if (envelope.meta) {
          setTotalPages(Math.ceil(envelope.meta.total / envelope.meta.per_page) || 1);
        } else {
          setTotalPages(1);
        }
      } else {
        throw new Error("API responded with failure status");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load modpacks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when search terms, filters, sorting, or pagination change
  useEffect(() => {
    fetchModpacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, source, gameVersion, modLoader, sortBy, page]);

  // Fetch detailed info when active modpack changes
  useEffect(() => {
    if (activeId === null) {
      setActiveModpack(null);
      return;
    }

    const fetchDetail = async () => {
      setLoadingDetail(true);
      setDetailTab("overview");
      try {
        // Check if selected modpack is local or external
        const selectedPack = modpacks.find(p => p.id === activeId);
        const isLocal = selectedPack?.platform === "local" || typeof activeId === "number";

        if (isLocal) {
          // Clean ID from prefix if present
          const cleanId = typeof activeId === "string" && activeId.includes(":") 
            ? activeId.split(":")[1] 
            : activeId;

          const response = await fetch(`https://modpacks.net/api/v1/modpacks/${cleanId}`);
          if (!response.ok) throw new Error("Failed to load modpack details");
          const envelope = await response.json();
          if (envelope.success) {
            setActiveModpack({
              ...envelope.data,
              platform: "local"
            });
          } else {
            throw new Error("Failed to parse modpack details");
          }
        } else {
          // External platforms: we don't have detailed endpoint in local API,
          // so we synthesize a details object from the existing modpack item.
          if (selectedPack) {
            setActiveModpack({
              ...selectedPack,
              mods: [],
              screenshots: []
            });
          }
        }
      } catch (err) {
        console.error(err);
        // Fallback to basic info if detail fetch fails
        const selectedPack = modpacks.find(p => p.id === activeId);
        if (selectedPack) {
          setActiveModpack({
            ...selectedPack,
            mods: [],
            screenshots: []
          });
        }
      } finally {
        setLoadingDetail(false);
      }
    };

    fetchDetail();
  }, [activeId, modpacks]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchTerm(query);
  };

  const handleResetFilters = () => {
    setQuery("");
    setSearchTerm("");
    setSource("all");
    setGameVersion("all");
    setModLoader("all");
    setSortBy("newest");
    setPage(1);
  };



  const handleBrowserImport = (pack: ModpackDetail) => {
    if (!pack.mods || pack.mods.length === 0) {
      alert("No mods found in this modpack to export.");
      return;
    }

    const decodeUrlSafe = (str: string) => {
      try {
        return decodeURIComponent(str);
      } catch {
        return str;
      }
    };

    // Format mods for browser import flow
    const modsList = pack.mods.map(m => ({
      platform: m.platform,
      platform_project_id: m.platform_project_id,
      platform_version_id: m.platform_version_id || undefined,
      mod_name: m.mod_name,
      mod_slug: m.mod_slug || undefined,
      mod_icon_url: m.mod_icon_url ? decodeUrlSafe(m.mod_icon_url) : undefined,
      file_name: m.file_name ? decodeUrlSafe(m.file_name) : undefined,
      file_url: m.file_url ? decodeUrlSafe(m.file_url) : undefined,
      file_size: m.file_size || undefined
    }));

    const name = pack.name;
    const version = pack.minecraft_version;
    const loader = pack.mod_loader;
    const modsJson = encodeURIComponent(JSON.stringify(modsList));

    const redirectUrl = `https://modpacks.net/modpack/create?name=${encodeURIComponent(name)}&version=${version}&loader=${loader}&mods=${modsJson}`;
    window.open(redirectUrl, "_blank");
  };

  const handleDownloadModpack = (pack: ModpackDetail) => {
    try {
      const cleanId = typeof pack.id === "string" && pack.id.includes(":") 
        ? pack.id.split(":")[1] 
        : pack.id;
      const downloadUrl = `https://modpacks.net/api/v1/modpacks/${cleanId}/download?format=mrstack`;
      window.location.href = downloadUrl;
    } catch (err) {
      console.error("Failed to download modpack:", err);
      alert("An error occurred while starting the download.");
    }
  };

  const getPlatformBadge = (platform?: string) => {
    switch (platform) {
      case "local":
        return null;
      case "modrinth":
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase">Modrinth</span>;
      case "curseforge":
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase">CurseForge</span>;
      case "feedthebeast":
        return <span className="bg-red-500/10 text-red-400 border border-red-500/25 px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase">FTB</span>;
      default:
        return <span className="bg-zinc-500/10 text-zinc-400 border border-zinc-500/25 px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase">Local</span>;
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb > 1) return `${mb.toFixed(2)} MB`;
    return `${kb.toFixed(1)} KB`;
  };

  return (
    <div className="relative min-h-screen bg-[#0f1923] text-white overflow-x-hidden flex flex-col">
      {/* Background dynamic blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="blob-dynamic" />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2596be]/10 via-transparent to-transparent" />

      {/* Header Navigation */}
      <nav className="sticky top-0 z-40 backdrop-blur-md border-b border-white/5">
        <a className="logo" href="/">
          <div className="logo-mark">
            <img src={iconImg} alt="logo" />
          </div>
          <img
            src={titleImg}
            alt="title"
            className="h-5 w-auto top-1 relative"
          />
        </a>
        <div className="nav-center hidden md:flex items-center gap-1">
          <a href="/" className="nav-item">Home</a>
          <a href="/workshop" className="nav-item font-semibold text-[#2596be] bg-[#103444]/40 border border-[#2596be]/20">Workshop</a>
          <a href="/changelog" className="nav-item">Changelog</a>
          <a href="/about" className="nav-item">About</a>
        </div>
        <div className="nav-right">
          <a
            href="https://discord.gg/nxsDcYVa6s"
            target="_blank"
            rel="noopener noreferrer"
            className="!rounded-[8px] px-3 py-2 bg-[#5865F2] text-white shadow-[0_4px_0_rgb(71,82,196)] hover:translate-y-[1px] hover:shadow-[0_3px_0_rgb(71,82,196)] active:translate-y-[3px] active:shadow-[0_1px_0_rgb(71,82,196)] active:scale-[0.98] transition-all duration-150 flex items-center gap-2.5 text-sm w-auto font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 127.14 96.36"
              fill="currentColor"
            >
              <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.2,77.2,0,0,0-3.3,6.83A96.67,96.67,0,0,0,52.88,6.83,77.2,77.2,0,0,0,49.58,0,105.15,105.15,0,0,0,19.14,8.07C-3,41.15-.39,73.36,10.63,89.55a105.82,105.82,0,0,0,31.9,16.14,79.5,79.5,0,0,0,6.67-10.87,68.73,68.73,0,0,1-10.57-5.1c.9-.66,1.79-1.37,2.63-2.11a75.76,75.76,0,0,0,71.7,0c.84.74,1.73,1.45,2.63,2.11a68.61,68.61,0,0,1-10.57,5.1,79.5,79.5,0,0,0,6.67,10.87,105.82,105.82,0,0,0,31.9-16.14C128.53,73.36,131.06,41.15,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.9,46,53.9,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.14,46,96.14,53,91,65.69,84.69,65.69Z" />
            </svg>
          </a>
          <AuthButton />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10 flex flex-col">
        
        {/* Mobile Nav Links */}
        <div className="flex md:hidden items-center justify-center gap-4 mb-8 text-sm text-zinc-400">
          <a href="/" className="hover:text-white">Home</a>
          <a href="/workshop" className="text-[#2596be] font-semibold">Workshop</a>
          <a href="/changelog" className="hover:text-white">Changelog</a>
          <a href="/about" className="hover:text-white">About</a>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12 flex flex-col items-center">
   
          <h1 className="text-4xl md:text-6xl font-normal text-white mt-1 mb-4 tracking-normal font-minecraft">
            Workshop
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            The official Modstack modpack Page.
            Play modpacks that use both Modrinth and Curseforge mods.
          </p>
          <a
            href="https://modpacks.net/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="!rounded-[10px] px-5 py-2.5 bg-zinc-900/60 hover:bg-zinc-800/80 text-white border border-zinc-800 hover:border-zinc-700 transition-all font-semibold text-xs flex items-center gap-1.5"
            id="workshop-create-modpack-btn"
          >
            <span>Create Modpack</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#2596be]" />
          </a>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 sm:p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/10 backdrop-blur-md mb-8 flex flex-col gap-4 relative z-30">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search modpacks by name, author, keywords..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/60 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#2596be]/60 focus:ring-1 focus:ring-[#2596be]/60 transition-all"
                id="workshop-search-input"
              />
            </div>
            <button
              type="submit"
              className="!rounded-[10px] px-6 py-2.5 bg-[#2596be] text-black shadow-[0_4px_0_rgb(29,123,158)] hover:bg-[#2bb1e0] active:translate-y-[3px] active:shadow-[0_1px_0_rgb(29,123,158)] transition-all font-semibold text-sm"
              id="workshop-search-btn"
            >
              Search
            </button>
          </form>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
            <div className="flex flex-wrap items-center gap-3">
              {/* Platform / Source Select */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Source</span>
                <CustomSelect
                  value={source}
                  onChange={(val) => {
                    setPage(1);
                    setSource(val);
                  }}
                  options={sourceOptions}
                  id="workshop-source-filter"
                />
              </div>

              {/* Game Version Select */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Minecraft Version</span>
                <CustomSelect
                  value={gameVersion}
                  onChange={(val) => {
                    setPage(1);
                    setGameVersion(val);
                  }}
                  options={versionOptions}
                  id="workshop-version-filter"
                />
              </div>

              {/* Mod Loader Select */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Mod Loader</span>
                <CustomSelect
                  value={modLoader}
                  onChange={(val) => {
                    setPage(1);
                    setModLoader(val);
                  }}
                  options={loaderOptions}
                  id="workshop-loader-filter"
                />
              </div>

              {/* Sort By - Only visible when not searching (lists local packs) */}
              {searchTerm.trim() === "" && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Sort By</span>
                  <CustomSelect
                    value={sortBy}
                    onChange={(val) => {
                      setPage(1);
                      setSortBy(val);
                    }}
                    options={sortOptions}
                    id="workshop-sort-filter"
                  />
                </div>
              )}
            </div>

            {/* Reset / Status */}
            {(searchTerm || source !== "all" || gameVersion !== "all" || modLoader !== "all") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Modpacks Catalog */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-[#ffffff11] border-t-[#2596be] rounded-full animate-spin" />
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
              Loading Workshop Catalog...
            </p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-2xl border border-red-500/20 bg-red-950/5 text-center max-w-md mx-auto my-12">
            <p className="text-red-400 font-semibold mb-2">Error Retrieving Data</p>
            <p className="text-zinc-400 text-sm mb-4">{error}</p>
            <button
              onClick={fetchModpacks}
              className="!rounded-[8px] px-4 py-2 bg-red-500 text-white font-semibold text-xs transition-colors hover:bg-red-400"
            >
              Retry Connection
            </button>
          </div>
        ) : modpacks.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800/80 rounded-2xl bg-zinc-950/10">
            <Layers className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-white font-semibold mb-1">No Modpacks Found</p>
            <p className="text-zinc-500 text-sm max-w-sm mx-auto">
              We couldn't find any modpacks matching your filters. Try resetting filters or using a different search term.
            </p>
          </div>
        ) : (
          <>
            {/* Grid of modpack cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {modpacks.map((modpack) => (
                <div
                  key={modpack.id}
                  onClick={() => setActiveId(modpack.id)}
                  className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/10 backdrop-blur-sm hover:border-[#2596be]/30 hover:bg-zinc-900/35 transition-all duration-300 flex flex-col gap-4 group cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-14 h-14 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center text-zinc-600 flex-shrink-0">
                      {modpack.icon_url ? (
                        <img
                          src={modpack.icon_url}
                          alt={modpack.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Layers className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getPlatformBadge(modpack.platform)}
                      <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-zinc-500" />
                          {modpack.likes_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <DownloadCloud className="w-3.5 h-3.5 text-zinc-500" />
                          {modpack.downloads_count}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-[#2596be] transition-colors duration-300 line-clamp-1">
                      {modpack.name}
                    </h3>
                    <div className="text-zinc-400 text-xs mb-3 flex items-center gap-1.5">
                      <User className="w-3 h-3 text-zinc-500" />
                      <span>by <span className="font-semibold text-zinc-300">{modpack.author}</span></span>
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3 mb-4 flex-1">
                      {modpack.summary || modpack.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5">
                      <span className="bg-zinc-955 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded text-[11px] font-medium">
                        {modpack.minecraft_version}
                      </span>
                      <span className="bg-zinc-955 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded text-[11px] font-medium">
                        {modpack.mod_loader}
                      </span>
                      {modpack.mods_count !== undefined && modpack.mods_count > 0 && (
                        <span className="bg-[#103444]/40 text-[#2596be] border border-[#2596be]/20 px-2 py-0.5 rounded text-[11px] font-medium">
                          {modpack.mods_count} Mods
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-zinc-800 bg-zinc-900/40 text-white disabled:opacity-40 disabled:pointer-events-none hover:bg-zinc-900/60 transition-colors"
                >
                  Previous Page
                </button>
                <span className="text-xs text-zinc-400 font-semibold">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-zinc-800 bg-zinc-900/40 text-white disabled:opacity-40 disabled:pointer-events-none hover:bg-zinc-900/60 transition-colors"
                >
                  Next Page
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="px-5 sm:px-12 py-10 bg-[#0a1219] border-t border-[#1e2d3d] mt-24">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 overflow-hidden">
              <img src={iconImg} alt="logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-semibold text-zinc-400">Modstack Workshop</span>
            <span>© 2026</span>
          </div>
          <div className="flex gap-6">
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/about" className="hover:text-white transition-colors">About</a>
          </div>
        </div>
      </footer>

      {/* Details / Import Modal */}
      {activeId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setActiveId(null)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-3xl bg-[#111a24] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header / Banner */}
            <div className="p-6 border-b border-zinc-800/80 bg-zinc-900/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-zinc-955 border border-zinc-800 overflow-hidden flex items-center justify-center text-zinc-600 flex-shrink-0">
                  {activeModpack?.icon_url ? (
                    <img src={activeModpack.icon_url} alt={activeModpack.name} className="w-full h-full object-cover" />
                  ) : (
                    <Layers className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-xl font-bold text-white">{activeModpack?.name || "Modpack Details"}</h2>
                    {activeModpack && getPlatformBadge(activeModpack.platform)}
                  </div>
                  <p className="text-zinc-400 text-xs mt-1">
                    by <span className="font-semibold text-zinc-300">{activeModpack?.author}</span> • {activeModpack?.minecraft_version} • {activeModpack?.mod_loader}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setActiveId(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body Tabs Nav */}
            <div className="flex border-b border-zinc-800/80 bg-zinc-950/20 px-6">
              <button
                onClick={() => setDetailTab("overview")}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                  detailTab === "overview"
                    ? "border-[#2596be] text-[#2596be]"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Overview
              </button>
              {activeModpack?.platform === "local" && (
                <>
                  <button
                    onClick={() => setDetailTab("mods")}
                    className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                      detailTab === "mods"
                        ? "border-[#2596be] text-[#2596be]"
                        : "border-transparent text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Mods ({activeModpack.mods?.length || 0})
                  </button>
                  {activeModpack.screenshots && activeModpack.screenshots.length > 0 && (
                    <button
                      onClick={() => setDetailTab("screenshots")}
                      className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                        detailTab === "screenshots"
                          ? "border-[#2596be] text-[#2596be]"
                          : "border-transparent text-zinc-400 hover:text-white"
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      Gallery ({activeModpack.screenshots.length})
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 p-6 overflow-y-auto min-h-[300px]">
              {loadingDetail ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-8 h-8 border-3 border-[#ffffff11] border-t-[#2596be] rounded-full animate-spin" />
                  <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider">
                    Fetching detailed pack info...
                  </p>
                </div>
              ) : activeModpack ? (
                <>
                  {detailTab === "overview" && (
                    <div className="prose prose-invert max-w-none text-sm leading-relaxed text-zinc-300">
                      {activeModpack.description ? (
                        <ReactMarkdown>{activeModpack.description}</ReactMarkdown>
                      ) : (
                        <p>{activeModpack.summary || "No description provided."}</p>
                      )}
                    </div>
                  )}

                  {detailTab === "mods" && (
                    <div className="flex flex-col gap-3">
                      {activeModpack.mods && activeModpack.mods.length > 0 ? (
                        activeModpack.mods.map((mod) => (
                          <div
                            key={mod.id}
                            className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/20 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center text-zinc-600 flex-shrink-0">
                                {mod.mod_icon_url ? (
                                  <img src={mod.mod_icon_url} alt={mod.mod_name} className="w-full h-full object-cover" />
                                ) : (
                                  <Layers className="w-4 h-4" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-bold text-white text-sm">{mod.mod_name}</h4>
                                <p className="text-zinc-400 text-xs line-clamp-1 mt-0.5">
                                  {mod.mod_description || "Installed mod file"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-zinc-500 text-xs font-semibold hidden sm:inline">
                                {formatSize(mod.file_size)}
                              </span>
                              <a
                                href={mod.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-[#2596be] hover:text-[#2bb1e0] transition-colors border border-zinc-800 flex items-center justify-center"
                                title="Download .jar file"
                              >
                                <DownloadCloud className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-zinc-500 text-xs text-center py-8">No mod list available.</p>
                      )}
                    </div>
                  )}

                  {detailTab === "screenshots" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activeModpack.screenshots && activeModpack.screenshots.map((screen) => (
                        <div key={screen.id} className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-955 flex flex-col">
                          <div className="relative pt-[56.25%] overflow-hidden bg-black">
                            <img
                              src={screen.image_url}
                              alt={screen.caption || "Screenshot"}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
                          {screen.caption && (
                            <div className="p-3 text-xs text-zinc-400 border-t border-zinc-900">
                              {screen.caption}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-zinc-500 text-xs">Failed to load details.</p>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="p-6 border-t border-zinc-800/80 bg-zinc-900/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs text-zinc-400">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-zinc-500" />
                  <span>{activeModpack?.likes_count || 0} likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <DownloadCloud className="w-4 h-4 text-zinc-500" />
                  <span>{activeModpack?.downloads_count || 0} downloads</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {activeModpack?.platform === "local" ? (
                  <>
                    <button
                      onClick={() => handleBrowserImport(activeModpack)}
                      className="!rounded-[10px] px-4 py-2.5 border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 text-white flex items-center gap-2 text-xs font-semibold transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Import on Web
                    </button>
                    <button
                      onClick={() => handleDownloadModpack(activeModpack)}
                      className="!rounded-[10px] px-5 py-2.5 bg-[#2596be] text-black shadow-[0_4px_0_rgb(29,123,158)] hover:bg-[#2bb1e0] active:translate-y-[2px] active:shadow-[0_2px_0_rgb(29,123,158)] transition-all flex items-center gap-2 text-xs font-bold"
                    >
                      <DownloadCloud className="w-3.5 h-3.5" />
                      Download Modpack
                    </button>
                  </>
                ) : (
                  activeModpack && (
                    <a
                      href={
                        activeModpack.platform === "modrinth"
                          ? `https://modrinth.com/modpack/${String(activeModpack.id).split(":")[1]}`
                          : activeModpack.platform === "curseforge"
                          ? `https://www.curseforge.com/minecraft/modpacks/${String(activeModpack.id).split(":")[1]}`
                          : "https://modpacks.net"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="!rounded-[10px] px-5 py-2.5 bg-[#2596be] text-black shadow-[0_4px_0_rgb(29,123,158)] hover:bg-[#2bb1e0] active:translate-y-[2px] active:shadow-[0_2px_0_rgb(29,123,158)] transition-all flex items-center gap-2 text-xs font-bold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View on {activeModpack.platform === "modrinth" ? "Modrinth" : "CurseForge"}
                    </a>
                  )
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
