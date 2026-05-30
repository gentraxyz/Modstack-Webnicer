import React, { useState } from "react";
import { Card, CardBody } from "@heroui/react";
import previewImg from "../images/launcher-preview.png";
import iconImg from "../images/placeholder.png";
import titleImg from "../images/modstack-title.png";
import {
  Download,
  Monitor,
  ChevronDown,
  Feather,
  Server,
  Boxes,
  DownloadCloud,
  Users,
  Sliders
} from "lucide-react";

const windowsExeUrl   = "https://cdn.stackedhost.crysistudio.xyz/modstack/release/latest/modstack-setup.exe";
const linuxAppImageUrl = "https://cdn.stackedhost.crysistudio.xyz/modstack/release/latest/modstack.AppImage";
const linuxDebUrl      = "https://cdn.stackedhost.crysistudio.xyz/modstack/release/latest/modstack.deb";
const linuxRpmUrl      = "https://cdn.stackedhost.crysistudio.xyz/modstack/release/latest/modstack.rpm";
const macDmgUrl        = "https://cdn.stackedhost.crysistudio.xyz/modstack/release/latest/modstack.dmg";

const WindowsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const LinuxIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489.117.779.567 1.563 1.182 2.114.267.237.553.439.848.605-.19.38-.227.832.076 1.433.256.503.686.951 1.148 1.277.614.436 1.26.639 1.785.539.226.388.546.719.866.922.428.278.867.36 1.277.318 1.506.728 3.14.707 4.632.003.432.044.87-.038 1.296-.317.32-.203.636-.534.862-.922.524.1 1.17-.103 1.785-.539.462-.326.892-.774 1.148-1.277.303-.601.266-1.053.076-1.433.295-.166.581-.368.848-.605.615-.551 1.065-1.335 1.182-2.114.123-.805-.009-1.657-.287-2.489-.589-1.771-1.831-3.47-2.716-4.521-.75-1.067-.974-1.928-1.05-3.02-.065-1.491 1.056-5.965-3.17-6.298-.165-.013-.325-.021-.48-.021zm0 1.501c.135 0 .27.006.404.017 3.06.242 2.464 3.932 2.44 5.818-.025 1.278.248 2.345 1.108 3.557.846 1.186 2.022 2.807 2.566 4.457.231.695.34 1.393.244 2.017-.083.549-.37 1.115-.808 1.503-.236.21-.505.386-.786.527-.064.033-.139.064-.205.098l-.035.02c-.067.034-.128.068-.184.104-.117.073-.217.156-.29.255-.076.101-.116.213-.104.328.018.168.1.33.197.476.196.297.462.563.688.764.082.072.156.132.211.18.091.077.148.123.148.123s-.153.17-.38.396c-.154.152-.38.32-.633.467-.252.145-.521.254-.782.3-.26.044-.504.023-.698-.12-.14-.101-.227-.252-.297-.396-.077-.164-.145-.318-.258-.433-.12-.122-.282-.187-.447-.178-.162.009-.311.078-.43.194-.238.232-.399.565-.495.87-.143.451-.143.875-.001 1.144.137.259.393.414.697.455.151.02.31.018.465-.003.307-.04.601-.136.845-.268.242-.132.434-.289.553-.444.076-.1.12-.196.128-.278l.003-.03v.04c.007.072.05.168.127.268.119.155.311.312.553.444.244.132.538.228.845.268.155.021.314.023.465.003.304-.041.56-.196.697-.455.142-.269.142-.693-.001-1.144-.096-.305-.257-.638-.495-.87-.119-.116-.268-.185-.43-.194-.165-.009-.327.056-.447.178-.113.115-.181.269-.258.433-.07.144-.157.295-.297.396-.194.143-.438.164-.698.12-.261-.046-.53-.155-.782-.3-.253-.147-.479-.315-.633-.467-.227-.226-.38-.396-.38-.396s.057-.046.148-.123c.055-.048.129-.108.211-.18.226-.201.492-.467.688-.764.097-.146.179-.308.197-.476.012-.115-.028-.227-.104-.328-.073-.099-.173-.182-.29-.255-.056-.036-.117-.07-.184-.104l-.035-.02c-.066-.034-.141-.065-.205-.098-.281-.141-.55-.317-.786-.527-.438-.388-.725-.954-.808-1.503-.096-.624.013-1.322.244-2.017.544-1.65 1.72-3.271 2.566-4.457.86-1.212 1.133-2.279 1.108-3.557-.024-1.886-.62-5.576 2.44-5.818.134-.011.269-.017.404-.017z"/>
  </svg>
);

const DiscordIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

interface SubOptionProps {
  href: string;
  label: string;
}

const SubOption = ({ href, label }: SubOptionProps) => (
  <a
    href={href}
    style={{
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      gap: "5px",
      padding: "6px 10px",
      backgroundColor: "rgba(0,0,0,0.2)",
      borderRadius: "6px",
      textDecoration: "none",
      color: "rgba(255,255,255,0.9)",
      fontSize: "11px",
      fontWeight: 600,
      transition: "background 0.15s",
      whiteSpace: "nowrap" as const,
    }}
    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.35)")}
    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.2)")}
  >
    <Download style={{ width: "9px", height: "9px" }} />
    {label}
  </a>
);

const greenCard: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px 12px 14px",
  backgroundColor: "#16a355",
  borderRadius: "8px 8px 6px 6px",
  color: "#ffffff",
  fontWeight: 600,
  boxShadow: "0 6px 0 rgb(21,128,61)",
};

const subTray: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  backgroundColor: "rgba(22,163,85,0.12)",
  border: "1px solid rgba(22,163,85,0.25)",
  borderTop: "none",
  borderRadius: "0 0 8px 8px",
  padding: "8px",
};

const features = [
  {
    icon: Feather,
    title: "Fast and Lightweight",
    description: "ModStack takes almost no resources on your computer. ModStack is also about 20 times smaller than most other launchers",
  },
  {
    icon: Server,
    title: "Server Browser",
    description: "Easily find Minecraft servers inside the launcher. No need to keep your browser open. We show smaller non P2W servers",
  },
  {
    icon: Boxes,
    title: "Bedrock and Java Support",
    description: "Forget just having Java. Play on Bedrock edition too whenever you want",
  },
  {
    icon: DownloadCloud,
    title: "Easy Mod installation and imports",
    description: "No need for any folder archeology. Just download or import your mods inside the launcher",
  },
  {
    icon: Users,
    title: "Account Switcher",
    description: "Easily manage and instantly switch between multiple Microsoft and offline accounts.",
  },
  {
    icon: Sliders,
    title: "Sleek Customization",
    description: "A beautiful, ad-free interface with clean layouts and advanced customization.",
  },
];

function App() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#0f1923', color: '#e2e8f0', minHeight: '100vh', overflow: 'hidden' }}>

      <nav>
        <a className="logo" href="#">
          <div className="logo-mark">
            <img src={iconImg} alt="logo" />
          </div>
          <img src={titleImg} alt="title" className="h-5 w-auto top-1 relative" />
        </a>
        <div className="nav-center"></div>
        <div className="nav-right">

                        <a
                href="https://discord.gg/nxsDcYVa6s"
                target="_blank"
                rel="noopener noreferrer"
                className="!rounded-[8px] px-5 py-2 bg-[#5865F2] text-white shadow-[0_4px_0_rgb(71,82,196)] hover:translate-y-[1px] hover:shadow-[0_3px_0_rgb(71,82,196)] active:translate-y-[3px] active:shadow-[0_1px_0_rgb(71,82,196)] active:scale-[0.98] transition-all duration-150 flex items-center gap-2.5 text-sm w-full sm:w-auto font-medium"
              >
                <DiscordIcon size={18} />
                <span>Join Discord</span>
              </a>
        </div>
      </nav>

      <div className="hero">
        <svg className="hero-bg" viewBox="0 0 900 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.9">
            <polygon points="450,60 200,200 200,440 450,300" fill="#1a2a40" stroke="#2a3a55" strokeWidth="1"/>
            <polygon points="450,60 700,200 700,440 450,300" fill="#152030" stroke="#2a3a55" strokeWidth="1"/>
            <polygon points="450,60 200,200 450,340 700,200" fill="#1e3040" stroke="#2a3a55" strokeWidth="1"/>
            <line x1="450" y1="60" x2="450" y2="300" stroke="#2a3a55" strokeWidth="0.8" opacity="0.6"/>
            <line x1="200" y1="200" x2="700" y2="200" stroke="#2a3a55" strokeWidth="0.8" opacity="0.4"/>
          </g>
          <g opacity="0.4">
            <polygon points="130,310 10,380 10,480 130,410" fill="#1a2a40" stroke="#2a3a55" strokeWidth="0.7"/>
            <polygon points="130,310 250,380 250,480 130,410" fill="#152030" stroke="#2a3a55" strokeWidth="0.7"/>
            <polygon points="130,310 10,380 130,450 250,380" fill="#1e3040" stroke="#2a3a55" strokeWidth="0.7"/>
          </g>
          <g opacity="0.4">
            <polygon points="770,310 650,380 650,480 770,410" fill="#1a2a40" stroke="#2a3a55" strokeWidth="0.7"/>
            <polygon points="770,310 890,380 890,480 770,410" fill="#152030" stroke="#2a3a55" strokeWidth="0.7"/>
            <polygon points="770,310 650,380 770,450 890,380" fill="#1e3040" stroke="#2a3a55" strokeWidth="0.7"/>
          </g>
        </svg>

        <div className="hero-content">
          <div className="badge">Beta Release v1.0.3</div>
          <h1>Download Modstack<br />for Windows</h1>
          <p>Modstack is a unique launcher that lets you play your favorite mods and keep them up to date, all in one handy package.</p>

          {/* ── Download buttons + expandable platform grid ── */}
          <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "16px", width: "100%" }}>

            <div className="hero-btns">
              <button
                onClick={() => window.location.href = windowsExeUrl}
                className="!rounded-[8px] px-8 py-4 bg-[#16a355] text-white shadow-[0_6px_0_rgb(21,128,61)] hover:translate-y-[1px] hover:shadow-[0_4px_0_rgb(21,128,61)] active:translate-y-[4px] active:shadow-[0_1px_0_rgb(21,128,61)] active:scale-[0.98] transition-all duration-150 flex items-center gap-3 w-full sm:w-auto"
              >
                <Monitor className="w-5 h-5" />
                <span>Download for Windows</span>
                <Download className="w-5 h-5" />
              </button>

              <button
                onClick={() => setExpanded(!expanded)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8", padding: "12px 20px", borderRadius: "8px",
                  cursor: "pointer", fontSize: "14px", fontWeight: 500,
                  transition: "all 0.2s", whiteSpace: "nowrap" as const,
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#e2e8f0"; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#94a3b8"; }}
              >
                <Download style={{ width: "16px", height: "16px" }} />
                More download options
                <ChevronDown style={{ width: "16px", height: "16px", transition: "transform 0.25s", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }} />
              </button>
            </div>

            {/* Expandable platform grid */}
            <div style={{
              width: "100%", maxWidth: "580px", overflow: "hidden",
              maxHeight: expanded ? "400px" : "0px",
              opacity: expanded ? 1 : 0,
              transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease",
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", padding: "4px 2px 8px" }}>

                {/* Windows */}
                <div>
                  <div style={greenCard}>
                    <WindowsIcon />
                    <span style={{ fontSize: "13px", fontWeight: 600, marginTop: "8px" }}>Windows</span>
                  </div>
                  <div style={subTray}>
                    <SubOption href={windowsExeUrl} label=".exe" />
                  </div>
                </div>

                {/* macOS */}
                <div>
                  <div style={greenCard}>
                    <AppleIcon />
                    <span style={{ fontSize: "13px", fontWeight: 600, marginTop: "8px" }}>macOS</span>
                  </div>
                  <div style={subTray}>
                    <SubOption href={macDmgUrl} label=".dmg" />
                  </div>
                </div>

                {/* Linux */}
                <div>
                  <div style={greenCard}>
                    <LinuxIcon />
                    <span style={{ fontSize: "13px", fontWeight: 600, marginTop: "8px" }}>Linux</span>
                  </div>
                  <div style={subTray}>
                    <SubOption href={linuxAppImageUrl} label=".AppImage" />
                    <SubOption href={linuxDebUrl}      label=".deb" />
                    <SubOption href={linuxRpmUrl}      label=".rpm" />
                  </div>
                </div>

              </div>
            </div>

          </div>
          {/* ── end download section ── */}

          <div className="preview-card">
            <Card
              isPressable radius="sm"
              className="!rounded-[8px] overflow-hidden border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm hover:border-green-600/40 will-change-transform !cursor-default"
              style={{ transformStyle: "preserve-3d", transition: "transform 0.06s linear" }}
            >
              <CardBody className="p-0">
                <img src={previewImg} alt="Modstack Launcher Preview" className="w-full h-[400px] md:h-[515px] object-cover pointer-events-none select-none" />
              </CardBody>
            </Card>
          </div>

          {/* Features Section */}
          <div className="mt-24 md:mt-32 max-w-6xl w-full px-4 mb-16 text-center">
            <span className="text-[#1bd96a] font-bold tracking-wider uppercase text-xs sm:text-sm bg-[#1a3a28] px-3.5 py-1.5 rounded-full border border-green-500/25">
              Features
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-5 mb-3 tracking-tight">
              Built for every player
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-16 font-normal">
              Choose a Minecraft launcher that actually puts the community first.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {features.map((feature, i) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={i}
                    className="p-6 md:p-8 rounded-xl border border-zinc-800/80 bg-zinc-900/20 backdrop-blur-sm hover:border-[#1bd96a]/40 hover:bg-zinc-900/40 transition-all duration-300 flex flex-col gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#1a3a28] border border-green-500/30 flex items-center justify-center text-[#1bd96a] group-hover:border-[#1bd96a]/50 transition-all duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#1bd96a] transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      <footer style={{ backgroundColor: '#0a1219', borderTop: '1px solid #1e2d3d', padding: '40px 48px 28px', marginTop: '80px', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src={iconImg} alt="logo" style={{ width: '22px', height: '22px' }} />
                <span style={{ fontWeight: 700, fontSize: '15px', color: '#e2e8f0' }}>Modstack</span>
              </div>
              <p style={{ fontSize: '12px', color: '#4a6080', margin: 0, maxWidth: '220px', lineHeight: '1.6' }}>
                Custom Minecraft launcher to manage and play your favorite mods.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3a5070', fontWeight: 600 }}>Community</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="https://twitter.com/modstack_" target="_blank" rel="noopener noreferrer" style={socialLinkStyle}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  @Modstack
                </a>
                <a href="https://twitter.com/primeCigarrete" target="_blank" rel="noopener noreferrer" style={socialLinkStyle}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  @primeCigarrete
                </a>
                <a href="https://discord.gg/nxsDcYVa6s" target="_blank" rel="noopener noreferrer" style={socialLinkStyle}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                  Discord
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3a5070', fontWeight: 600 }}>Legal</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="/terms" style={legalLinkStyle}>Terms & Conditions</a>
                <a href="/privacy" style={legalLinkStyle}>Privacy Policy</a>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #1a2a3a' }} />

          <div style={{ textAlign: 'center', marginBottom: '-8px', marginRight: '86%' }}>
            <span style={{ fontSize: '12px', color: '#4a6a8a' }}>
              Modstack is{' '}
              <a
                href="https://github.com/Modstack-Launcher/ModstackApp"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#16a355', textDecoration: 'underline', textUnderlineOffset: '3px' }}
                onMouseEnter={e => e.currentTarget.style.color = '#22c55e'}
                onMouseLeave={e => e.currentTarget.style.color = '#16a355'}
              >open source</a>.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#2e4060' }}>© 2026 Modstack. All rights reserved.</span>
            <span style={{ fontSize: '12px', color: '#3a5070', textAlign: 'center', maxWidth: '400px', lineHeight: '1.6' }}>
              NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.
            </span>
            <span style={{ fontSize: '12px', color: '#2e4060' }}>
              Made with 💚 by @primeCigarrete<br />
              support: @fitzxel & @gekoxd
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

const socialLinkStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '8px',
  fontSize: '13px', color: '#5a7a9a', textDecoration: 'none',
  transition: 'color 0.2s', cursor: 'pointer',
};

const legalLinkStyle: React.CSSProperties = {
  fontSize: '13px', color: '#5a7a9a', textDecoration: 'none', cursor: 'pointer',
};

export default App;