import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@heroui/react";
import titleImg from "../images/modstack-title.png";
import iconImg from "../images/placeholder.png";


type PrivacyPageProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function PrivacyPage({ open = false, onClose }: PrivacyPageProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isRouteOpen = location.pathname === "/privacy";
  const shouldRender = isRouteOpen || open;

  const handleClose = () => {
    if (isRouteOpen) navigate("/");
    else onClose?.();
  };

  useEffect(() => {
    if (!shouldRender) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRender, isRouteOpen]);

  useEffect(() => {
    if (!shouldRender) return;
    const blobs = document.querySelectorAll(".blob-dynamic");
    blobs.forEach((blob) => {
      const el = blob as HTMLElement;
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      el.style.width = `${420 + Math.random() * 520}px`;
      el.style.height = `${420 + Math.random() * 520}px`;
      el.style.animationDelay = `${Math.random() * 6}s`;
    });
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <div className="relative min-h-screen bg-[#0f1923] text-white overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="blob-dynamic" />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2596be]/10 via-transparent to-transparent" />

      <header className="sticky top-0 z-20 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-5 md:px-8 py-4 flex items-start justify-between gap-4">
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
          <Button
          isIconOnly
            variant="bordered"
            onPress={() => setTimeout(handleClose, 300)}
            className="!rounded-[8px] px-5 py-2 bg-[#2596be] text-white shadow-[0_4px_0_rgb(29,123,158)] hover:translate-y-[1px] hover:shadow-[0_3px_0_rgb(29,123,158)] active:translate-y-[3px] active:shadow-[0_1px_0_rgb(29,123,158)] active:scale-[0.98] transition-all duration-150 flex items-center gap-2.5 text-sm w-full sm:w-auto font-medium ml-auto"
            
          >
            <svg width="24px" height="24px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ffffff"><path d="M21 12L3 12M3 12L11.5 3.5M3 12L11.5 20.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                      <span>Back</span>
          </Button>

        </div>
                  
      </header>


      <main className="relative z-10 mx-auto max-w-5xl px-5 md:px-8 py-8 md:py-12">
        <img src="/images/placeholder.png" alt="Privacy Policy" className="size-32 mx-auto mb-5"  />
                  <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mx-auto w-fit">
              <span className="bg-gradient-to-r from-sky-400 to-[#2596be] bg-clip-text text-transparent">
                Privacy Policy
              </span>
              <span className="text-white"> for Modstack</span>
            </h1>

          </div>
                    <div className="mt-1 text-sm text-white/80 font-extrabold mx-auto w-fit mb-6">
              Last updated: May 2026
            </div>
        <p className="text-sm leading-relaxed text-white/70 font-semibold">
          By using{" "}
          <span className="text-[#2596be] font-extrabold">Modstack</span>{" "}
          and our services, you agree to the practices described in this policy.
          We recommend reading it carefully.
        </p>

        <Section title="1. Information We Collect">
          <p className="text-sm leading-relaxed text-white/70">
            Modstack{" "}
            <span className="text-white/90 font-extrabold">
              does not collect, store, or process any personal data
            </span>{" "}
            from its users. We do not use telemetry, usage analytics, advertising,
            or any form of tracking.
          </p>
        </Section>

        <Section title="2. Microsoft Authentication">
          <p className="text-sm leading-relaxed text-white/70">
            To access Minecraft, the launcher uses Microsoft's official
            authentication system. Please note:
          </p>
          <ul className="mt-3 list-disc pl-5 text-sm text-white/70 space-y-1">
            <li>
              The login process happens{" "}
              <span className="text-white/90 font-extrabold">
                directly with Microsoft's servers
              </span>
              . Modstack never has access to your password.
            </li>
            <li>
              Your session token is stored{" "}
              <span className="text-white/90 font-extrabold">
                only on your local device
              </span>{" "}
              to keep you logged in. It is never sent to our own servers.
            </li>
            <li>
              Modstack does not store or have access to your Microsoft or
              Minecraft credentials.
            </li>
          </ul>
        </Section>

        <Section title="3. Third-Party Services">
          <p className="text-sm leading-relaxed text-white/70">
            The authentication process is subject to{" "}
            <a
              href="https://privacy.microsoft.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2596be] hover:text-sky-400 transition-colors"
            >
              Microsoft's Privacy Policy
            </a>
            . Modstack is not responsible for Microsoft's data practices.
          </p>
        </Section>

        <Section title="4. Security">
          <p className="text-sm leading-relaxed text-white/70">
            Since we do not collect or store any personal data on our own servers,
            the risk of your information being exposed through Modstack is minimal.
            We still recommend keeping your Microsoft credentials confidential.
          </p>
        </Section>

        <Section title="5. Minors">
          <p className="text-sm leading-relaxed text-white/70">
            Our services are not directed at children under the age of 13. We do
            not knowingly collect data from anyone under 13.
          </p>
        </Section>

        <Section title="6. Changes to This Policy">
          <p className="text-sm leading-relaxed text-white/70">
            We reserve the right to update this privacy policy at any time. We
            will notify you of significant changes through the platform.
          </p>
        </Section>

        <Section title="7. Contact">
          <p className="text-sm leading-relaxed text-white/70">
            If you have any questions about this policy, feel free to reach out:
          </p>
          <ul className="mt-3 list-disc pl-5 text-sm text-white/70 space-y-1">
            <li>
              <span className="text-white/90 font-extrabold">Email:</span>{" "}
              <a
                href="mailto:modstacksupport@gmail.com"
                className="text-[#2596be] hover:text-sky-400 transition-colors"
              >
                modstacksupport@gmail.com
              </a>
            </li>
            <li>
              <span className="text-white/90 font-extrabold">Discord:</span>{" "}
              <a
                href="https://discord.gg/QmZpUCbn2N"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2596be] hover:text-sky-400 transition-colors"
              >
                discord.gg/QmZpUCbn2N
              </a>
            </li>
          </ul>
        </Section>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/45">
          © 2026 Modstack. All rights reserved.
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-base md:text-lg font-extrabold text-[#2596be]">{title}</h2>
      <div className="mt-2 font-semibold">{children}</div>
    </section>
  );
}