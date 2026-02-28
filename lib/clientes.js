const DASHBOARD_LEDESMA =
  "https://lookerstudio.google.com/embed/reporting/ea241dca-5ca9-48e0-880b-2af0ef3f7a65/page/fuwpF";

const DASHBOARD_DEMO =
  "https://lookerstudio.google.com/embed/reporting/1b7a9f79-2347-4d7b-87c3-b5f65a9cef54/page/fuwpF";

export const clientes = {
  ledesma: {
    nombre: "Ledesma",
    logoTexto: "Ledesma",
    dashboards: {
      resumen: DASHBOARD_LEDESMA,
      matrizEstado: DASHBOARD_LEDESMA,
      historicoEstados: DASHBOARD_LEDESMA,
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
