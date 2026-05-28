import React from "react";
import { Card, CardBody } from "@heroui/react";
import previewImg from "../images/launcher-preview.png";
import iconImg from "../images/placeholder.png";
import { Download, Monitor } from "lucide-react";

const windowsUrl = "https://cdn.stackedhost.crysistudio.xyz/modstack/release/latest/modstack-setup.exe";
const linuxUrl = `https://cdn.stackedhost.crysistudio.xyz/modstack/release/latest/modstack-setup.AppImage`;

function App() {
  const handleInstallWindows = () => {
    window.location.href = windowsUrl;
  };

  const handleInstallLinux = () => {
    window.location.href = linuxUrl;
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#0f1923', color: '#e2e8f0', minHeight: '100vh', overflow: 'hidden' }}>

      <nav>
        <a className="logo" href="#">
          <div className="logo-mark">
            <img 
              src={iconImg}
              alt="logo" 
            />
          </div>
          <span>Modstack</span>
        </a>

        <div className="nav-center"></div>

        <div className="nav-right">
          <a href="https://discord.gg/nxsDcYVa6s" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#5865F2', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#4752c4')} onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#5865F2')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
            Join Discord
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
          <div className="badge">Beta Release v1.0.2</div>

          <h1>Download Modstack<br />for Windows</h1>

          <p>Modstack is a unique launcher that lets you play your favorite mods and keep them up to date, all in one handy package.</p>

          <div className="hero-btns">
              <button
                onClick={handleInstallWindows}
                className="
                  !rounded-[8px]
                  px-8 py-4
                  bg-[#16a355]
                  text-white
                  shadow-[0_6px_0_rgb(21,128,61)]
                  hover:translate-y-[1px]
                  hover:shadow-[0_4px_0_rgb(21,128,61)]
                  active:translate-y-[4px]
                  active:shadow-[0_1px_0_rgb(21,128,61)]
                  active:scale-[0.98]
                  transition-all
                  duration-150
                  flex items-center gap-3
                  w-full sm:w-auto
                "
              >
                <Monitor className="w-5 h-5" />
                <span>Download for Windows</span>
                <Download className="w-5 h-5" />
              </button>

              <button
               // onClick={handleInstallLinux}
                className="
                  !rounded-[8px]
                  px-8 py-4
                  bg-[#16a355]
                  text-white
                  shadow-[0_6px_0_rgb(21,128,61)]
                  hover:translate-y-[1px]
                  hover:shadow-[0_4px_0_rgb(21,128,61)]
                  active:translate-y-[4px]
                  active:shadow-[0_1px_0_rgb(21,128,61)]
                  active:scale-[0.98]
                  transition-all
                  duration-150
                  flex items-center gap-3
                  w-full sm:w-auto
                "
              >
                <Monitor className="w-5 h-5" />
                <span>Download for Linux (coming soon)</span>
                <Download className="w-5 h-5" />
              </button>
          </div>

          <div className="preview-card">
            <Card
              isPressable
              radius="sm"
              className="!rounded-[8px] overflow-hidden border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm hover:border-green-600/40 will-change-transform"
              style={{
                transformStyle: "preserve-3d",
                transition: "transform 0.06s linear"
              }}
            >
              <CardBody className="p-0">
                <img
                  src={previewImg}
                  alt="Modstack Launcher Preview"
                  className="w-full h-[400px] md:h-[515px] object-cover pointer-events-none select-none"
                />
              </CardBody>
            </Card>
          </div>

        </div>
      </div>

      <footer style={{
        backgroundColor: '#0a1219',
        borderTop: '1px solid #1e2d3d',
        padding: '40px 48px 28px',
        marginTop: '80px',
        overflow: 'hidden',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '24px',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img 
                  src={iconImg} 
                  alt="logo" 
                  style={{ width: '22px', height: '22px' }} 
                />
                <span style={{ fontWeight: 700, fontSize: '15px', color: '#e2e8f0' }}>Modstack</span>
              </div>
              <p style={{ fontSize: '12px', color: '#4a6080', margin: 0, maxWidth: '220px', lineHeight: '1.6' }}>
                Custom Minecraft launcher to manage and play your favorite mods.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3a5070', fontWeight: 600 }}>
                Community
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="https://twitter.com/modstack_" target="_blank" rel="noopener noreferrer" style={socialLinkStyle}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  @Modstack
                </a>
                <a href="https://twitter.com/primeCigarrete" target="_blank" rel="noopener noreferrer" style={socialLinkStyle}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  @primeCigarrete
                </a>
                <a href="https://discord.gg/nxsDcYVa6s" target="_blank" rel="noopener noreferrer" style={socialLinkStyle}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  Discord
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3a5070', fontWeight: 600 }}>
                Legal
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="/terms" style={legalLinkStyle}>Terms & Conditions</a>
                <a href="/privacy" style={legalLinkStyle}>Privacy Policy</a>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #1a2a3a' }} />

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
          }}>
            <span style={{ fontSize: '12px', color: '#2e4060' }}>
              © 2026 Modstack. All rights reserved.
            </span>
          
            <span style={{ fontSize: '12px', color: '#3a5070', textAlign: 'center', maxWidth: '400px', lineHeight: '1.6' }}>
              NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.
            </span>
          
            <span style={{ fontSize: '12px', color: '#2e4060' }}>
              Made with 💚 by @primeCigarrete
              <br />
              support: @fitzxel & @gekoxd
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

const socialLinkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '13px',
  color: '#5a7a9a',
  textDecoration: 'none',
  transition: 'color 0.2s',
  cursor: 'pointer',
};

const legalLinkStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#5a7a9a',
  textDecoration: 'none',
  cursor: 'pointer',
};

export default App;