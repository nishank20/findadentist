import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { dentists, insuranceCarriers } from "../data";

export default defineTool({
  name: "list_insurance_carriers",
  title: "List insurance carriers",
  description:
    "List the dental insurance carriers findadentist supports, optionally with how many directory dentists accept each one.",
  inputSchema: {
    withCounts: z.boolean().optional().describe("Include the number of dentists accepting each carrier."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ withCounts }) => {
    const rows = insuranceCarriers.map((carrier) => ({
      carrier,
      dentistCount: dentists.filter((d) => d.insurance.includes(carrier)).length,
    }));
    return {
      content: [
        {
          type: "text" as const,
          text: rows
            .map((r) => (withCounts ? `${r.carrier} — ${r.dentistCount} dentist(s)` : r.carrier))
            .join("\n"),
        },
      ],
      structuredContent: { carriers: rows },
    };
  },
});
