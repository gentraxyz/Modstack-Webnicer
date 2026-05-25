import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@heroui/react";

type TermsPageProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function TermsPage({ open = false, onClose }: TermsPageProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isRouteOpen = location.pathname === "/terms";
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
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="blob-dynamic" />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/10 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-black/60" />

      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/55 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-5 md:px-8 py-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                Terms & Conditions
              </span>
              <span className="text-white"> of Modstack</span>
            </h1>
            <div className="mt-1 text-sm text-white/45">
              Last updated: May 2026
            </div>
          </div>
          <Button
            variant="light"
            onPress={handleClose}
            className="text-white/70 hover:text-white"
          >
            Go back
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-5 md:px-8 py-8 md:py-12">
        <p className="text-sm leading-relaxed text-white/70">
          By downloading, installing, or using{" "}
          <span className="text-green-500 font-semibold">Modstack</span>,
          you automatically agree to all the terms and conditions described in this document.
          If you disagree with any of them, you must uninstall the application immediately
          and refrain from using it.
        </p>

        <Section title="1. Ownership and Intellectual Property">
          <p className="text-sm leading-relaxed text-white/70">
            Modstack, including its source code, design, logos, graphic resources, multimedia, and any
            other associated elements, is the exclusive property of its developers. All rights are
            reserved. No element of the Application may be reproduced, distributed, modified, or
            used for commercial purposes without the express written authorization of the rights holders.
          </p>
        </Section>

        <Section title="2. Usage Restrictions">
          <p className="text-sm leading-relaxed text-white/70">
            The following are strictly prohibited:
          </p>
          <ul className="mt-3 list-disc pl-5 text-sm text-white/70 space-y-1">
            <li>Distributing, sharing, reselling, or sublicensing the Application or any of its components to third parties.</li>
            <li>Reproducing or redistributing resources downloaded through the Application, including images, multimedia files, configurations, and internal documents.</li>
            <li>Modifying, altering, decompiling, reverse engineering, or attempting to access the source code of the Application in any way.</li>
            <li>Tampering with, bypassing, or interfering with the Application's security, verification, or authentication systems.</li>
            <li>Using the Application for illegal, fraudulent purposes or in any way that may cause harm to third parties.</li>
          </ul>
        </Section>

        <Section title="3. Disclaimer of Liability">
          <p className="text-sm leading-relaxed text-white/70">
            Modstack is provided{" "}
            <span className="text-green-500 font-semibold">"as is"</span>, without warranties of any kind,
            whether express or implied. The developers are not responsible for:
          </p>
          <ul className="mt-3 list-disc pl-5 text-sm text-white/70 space-y-1">
            <li>Bugs, technical failures, or interruptions in the Application's operation.</li>
            <li>Loss of data, files, or configurations resulting from use of the Application.</li>
            <li>Direct, indirect, incidental, or consequential damages caused by the use or inability to use the Application.</li>
            <li>Issues arising from third-party services, platforms, or software.</li>
            <li>Incompatibilities with the operating system or other software installed on the user's device.</li>
          </ul>
        </Section>

        <Section title="4. Security Warnings">
          <p className="text-sm leading-relaxed text-white/70">
            Modstack does not have a Windows digital signature or a verified publisher certificate. As a
            result, some security systems such as Windows Defender or other antivirus programs may display
            alerts or false positives when downloading or running the Application.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            These warnings do not imply that the Application contains malware, viruses, or malicious code
            of any kind. By installing Modstack, the user acknowledges this situation and agrees to run
            the Application at their own risk.
          </p>
        </Section>

        <Section title="5. Use at the User's Own Risk">
          <p className="text-sm leading-relaxed text-white/70">
            Use of Modstack is entirely voluntary and is carried out at the user's sole responsibility. By
            installing the Application, the user agrees that any consequences arising from its use, whether
            direct or indirect, will be borne entirely by themselves, releasing the developers from any
            liability in that regard.
          </p>
        </Section>

        <Section title="6. Updates and Modifications to the Application">
          <p className="text-sm leading-relaxed text-white/70">
            The developers of Modstack reserve the right to release updates, modify features, suspend the
            service, or discontinue the Application at any time and without prior notice, without incurring
            any obligation or liability toward the user.
          </p>
        </Section>

        <Section title="7. Modifications to the Terms and Conditions">
          <p className="text-sm leading-relaxed text-white/70">
            Modstack reserves the right to modify this document at any time. Changes will take effect upon
            publication. Continued use of the Application after changes are published implies full acceptance
            of the updated terms. Users are encouraged to review this document periodically.
          </p>
        </Section>

        <Section title="8. Acceptance of Terms">
          <p className="text-sm leading-relaxed text-white/70">
            Downloading, installing, or using{" "}
            <span className="text-green-500 font-semibold">Modstack</span> constitutes full, voluntary,
            and unconditional acceptance of all the terms and conditions described herein. If you do not
            agree with any of them, you must refrain from using the Application.
          </p>
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
      <h2 className="text-base md:text-lg font-bold text-green-500">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}