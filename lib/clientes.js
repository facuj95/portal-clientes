const DASHBOARD_LEDESMA_RESUMEN =
  "https://lookerstudio.google.com/embed/reporting/ea241dca-5ca9-48e0-880b-2af0ef3f7a65/page/p_0eimbmed1d/appview";

const DASHBOARD_LEDESMA_MATRIZ =
  "https://lookerstudio.google.com/embed/reporting/ea241dca-5ca9-48e0-880b-2af0ef3f7a65/page/fuwpF/appview";

const DASHBOARD_LEDESMA_HISTORICO =
  "https://lookerstudio.google.com/embed/reporting/ea241dca-5ca9-48e0-880b-2af0ef3f7a65/page/p_bmn0v3hi1d/appview";

const DASHBOARD_DEMO =
  "https://lookerstudio.google.com/embed/reporting/1b7a9f79-2347-4d7b-87c3-b5f65a9cef54/page/fuwpF/appview";

export const clientes = {
  ledesma: {
    nombre: "Ledesma",
    logoTexto: "Ledesma",
    logoUrl: "/logo_ledesma_sidebar.jpg",
    dashboards: {
      resumen: DASHBOARD_LEDESMA_RESUMEN,
      matrizEstado: DASHBOARD_LEDESMA_MATRIZ,
      historicoEstados: DASHBOARD_LEDESMA_HISTORICO,
    },
  },

  demo: {
    nombre: "Cliente Demo",
    logoTexto: "Cliente Demo",
    dashboards: {
      resumen: DASHBOARD_DEMO,
      matrizEstado: DASHBOARD_DEMO,
      historicoEstados: DASHBOARD_DEMO,
    },
  },
};
