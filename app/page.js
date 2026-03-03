"use client";

import { useMemo, useState } from "react";
import { clientes } from "../lib/clientes";

const SECCIONES = [
  { id: "resumen", label: "Resumen" },
  { id: "matrizEstado", label: "Matriz de estado" },
  { id: "historicoEstados", label: "Historico de activos" },
];

export default function Home() {
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;

  const clienteParam = params?.get("cliente")?.toLowerCase();
  const subdomain = host.split(".")[0]?.toLowerCase();

  const clienteId = useMemo(() => {
    if (subdomain && clientes[subdomain]) {
      return subdomain;
    }

    if (clienteParam && clientes[clienteParam]) {
      return clienteParam;
    }

    return "ledesma";
  }, [clienteParam, subdomain]);

  const cliente = clientes[clienteId];
  const [seccionActiva, setSeccionActiva] = useState(SECCIONES[0].id);

  const seccionActivaConfig = useMemo(
    () => SECCIONES.find((seccion) => seccion.id === seccionActiva) || SECCIONES[0],
    [seccionActiva],
  );

  const dashboardSrc = useMemo(() => {
    if (!cliente) {
      return "";
    }

    return cliente.dashboards?.[seccionActiva] || cliente.dashboards?.resumen || "";
  }, [cliente, seccionActiva]);

  if (!cliente) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Cliente no encontrado.
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex bg-[#f5f7fb] text-[#0f172a]">
      <aside className="relative z-20 w-[280px] shrink-0 bg-[#0b1220] text-white flex flex-col p-6 gap-8">
        <div className="rounded-xl bg-white/10 border border-white/20 p-4">
          <p className="text-2xl font-semibold">Prediman</p>
        </div>

        <div className="rounded-xl bg-white/10 border border-white/20 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-white/70">Empresa</p>
          <h1 className="mt-2 text-2xl font-semibold">{cliente.logoTexto || cliente.nombre}</h1>
        </div>

        <nav className="flex flex-col gap-3">
          {SECCIONES.map((seccion) => {
            const activa = seccionActiva === seccion.id;

            return (
              <button
                key={seccion.id}
                type="button"
                onClick={() => setSeccionActiva(seccion.id)}
                aria-pressed={activa}
                className={`cursor-pointer rounded-xl px-4 py-3 text-left transition ${
                  activa
                    ? "bg-[#2563eb] text-white shadow-lg"
                    : "bg-white/5 hover:bg-white/15 text-white/90"
                }`}
              >
                {seccion.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="relative z-10 min-w-0 flex-1 p-4">
        <div className="h-full overflow-hidden rounded-2xl border border-[#dbe3f3] bg-white shadow-sm">
          <header className="border-b border-[#e8edf7] px-5 py-3 text-sm font-medium text-[#334155]">
            Vista actual: <span className="font-semibold">{seccionActivaConfig.label}</span>
          </header>

          <div className="h-[calc(100%-53px)]">
            <iframe
              key={seccionActiva}
              src={dashboardSrc}
              title={`Dashboard ${seccionActivaConfig.label}`}
              width="100%"
              height="100%"
              style={{ border: "none" }}
              allowFullScreen
            />
          </div>
        </div>
      </main>
    </div>
  );
}
