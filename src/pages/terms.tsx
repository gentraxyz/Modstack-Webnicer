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
                Términos y Condiciones
              </span>
              <span className="text-white"> de Modstack</span>
            </h1>
            <div className="mt-1 text-sm text-white/45">
              Última actualización: Mayo 2026
            </div>
          </div>
          <Button
            variant="light"
            onPress={handleClose}
            className="text-white/70 hover:text-white"
          >
            Volver
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-5 md:px-8 py-8 md:py-12">
        <p className="text-sm leading-relaxed text-white/70">
          Al descargar, instalar o utilizar{" "}
          <span className="text-green-500 font-semibold">Modstack</span>,
          aceptas automáticamente todos los términos y condiciones descritos en este documento.
          Si no estás de acuerdo con alguno de ellos, debes desinstalar la aplicación de forma inmediata
          y abstenerte de utilizarla.
        </p>

        <Section title="1. Titularidad y Propiedad Intelectual">
          <p className="text-sm leading-relaxed text-white/70">
            Modstack, incluyendo su código fuente, diseño, logotipos, recursos gráficos, multimedia y cualquier
            otro elemento asociado, es propiedad exclusiva de sus desarrolladores. Todos los derechos están
            reservados. Ningún elemento de la Aplicación podrá ser reproducido, distribuido, modificado o
            utilizado con fines comerciales sin autorización expresa y por escrito de los titulares.
          </p>
        </Section>

        <Section title="2. Restricciones de Uso">
          <p className="text-sm leading-relaxed text-white/70">
            Queda estrictamente prohibido:
          </p>
          <ul className="mt-3 list-disc pl-5 text-sm text-white/70 space-y-1">
            <li>Distribuir, compartir, revender o sublicenciar la Aplicación o cualquiera de sus componentes a terceros.</li>
            <li>Reproducir o redistribuir los recursos descargados a través de la Aplicación, incluyendo imágenes, archivos multimedia, configuraciones y documentos internos.</li>
            <li>Realizar modificaciones, alteraciones, descompilaciones, ingeniería inversa o cualquier intento de acceder al código fuente de la Aplicación.</li>
            <li>Manipular, eludir o interferir con los sistemas de seguridad, verificación o autenticación de la Aplicación.</li>
            <li>Utilizar la Aplicación con fines ilegales, fraudulentos o que puedan causar daño a terceros.</li>
          </ul>
        </Section>

        <Section title="3. Exención de Responsabilidad">
          <p className="text-sm leading-relaxed text-white/70">
            Modstack se proporciona{" "}
            <span className="text-green-500 font-semibold">"tal cual"</span>, sin garantías de ningún tipo,
            ya sean explícitas o implícitas. Los desarrolladores no se hacen responsables por:
          </p>
          <ul className="mt-3 list-disc pl-5 text-sm text-white/70 space-y-1">
            <li>Errores, fallos técnicos o interrupciones en el funcionamiento de la Aplicación.</li>
            <li>Pérdida de datos, archivos o configuraciones derivada del uso de la Aplicación.</li>
            <li>Daños directos, indirectos, incidentales o consecuentes causados por el uso o la imposibilidad de uso de la Aplicación.</li>
            <li>Problemas derivados de servicios, plataformas o software de terceros.</li>
            <li>Incompatibilidades con el sistema operativo u otro software instalado en el equipo del usuario.</li>
          </ul>
        </Section>

        <Section title="4. Advertencias de Seguridad">
          <p className="text-sm leading-relaxed text-white/70">
            Modstack no cuenta con firma digital de Windows ni con certificado de editor verificado. Como
            consecuencia, es posible que algunos sistemas de seguridad, como Windows Defender u otros programas
            antivirus, muestren alertas o falsos positivos al momento de descargar o ejecutar la Aplicación.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Estas advertencias no implican que la Aplicación contenga malware, virus o código malicioso de
            ningún tipo. Al instalar Modstack, el usuario declara comprender esta situación y acepta ejecutar
            la Aplicación bajo su propia responsabilidad.
          </p>
        </Section>

        <Section title="5. Uso Bajo Responsabilidad del Usuario">
          <p className="text-sm leading-relaxed text-white/70">
            El uso de Modstack es completamente voluntario y se realiza bajo la exclusiva responsabilidad del
            usuario. Al instalar la Aplicación, el usuario acepta que cualquier consecuencia derivada de su uso,
            directa o indirecta, será asumida íntegramente por él mismo, eximiendo a los desarrolladores de
            toda responsabilidad al respecto.
          </p>
        </Section>

        <Section title="6. Actualizaciones y Modificaciones de la Aplicación">
          <p className="text-sm leading-relaxed text-white/70">
            Los desarrolladores de Modstack se reservan el derecho de publicar actualizaciones, modificar
            funcionalidades, suspender el servicio o discontinuar la Aplicación en cualquier momento y sin
            previo aviso, sin que ello genere ningún tipo de obligación o responsabilidad frente al usuario.
          </p>
        </Section>

        <Section title="7. Modificaciones a los Términos y Condiciones">
          <p className="text-sm leading-relaxed text-white/70">
            Modstack se reserva el derecho de modificar el presente documento en cualquier momento. Las
            modificaciones entrarán en vigor desde el momento de su publicación. El uso continuado de la
            Aplicación tras la publicación de cambios implica la aceptación total de los términos actualizados.
            Se recomienda al usuario revisar este documento periódicamente.
          </p>
        </Section>

        <Section title="8. Aceptación de los Términos">
          <p className="text-sm leading-relaxed text-white/70">
            La descarga, instalación o uso de{" "}
            <span className="text-green-500 font-semibold">Modstack</span> implica la aceptación plena,
            voluntaria e incondicional de todos los términos y condiciones aquí descritos. En caso de no estar
            de acuerdo con alguno de ellos, el usuario deberá abstenerse de utilizar la Aplicación.
          </p>
        </Section>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/45">
          © 2026 Modstack. Todos los derechos reservados.
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