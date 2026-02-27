"use client";

import { clientes } from "../lib/clientes";

export default function Home() {

  const host =
    typeof window !== "undefined" ? window.location.hostname : "";

  const subdomain = host.split(".")[0];

  const cliente = clientes[subdomain];

  if (!cliente) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Cliente no encontrado
      </div>
    );
  }

  return (
    <div className="h-screen">
      <iframe
        src={cliente.dashboard}
        width="100%"
        height="100%"
        style={{ border: "none" }}
        allowFullScreen
      ></iframe>
    </div>
  );
}