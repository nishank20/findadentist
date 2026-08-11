import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { dentists, specialties } from "../data";

export default defineTool({
  name: "list_specialties",
  title: "List dental specialties",
  description: "List the dental specialties findadentist covers and how many directory dentists offer each.",
  inputSchema: {
    query: z.string().optional().describe("Optional text filter applied to specialty names."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query }) => {
    const q = query?.trim().toLowerCase();
    const rows = specialties
      .filter((s) => !q || s.toLowerCase().includes(q))
      .map((specialty) => ({
        specialty,
        dentistCount: dentists.filter((d) => d.specialty === specialty).length,
      }));
    return {
      content: [
        { type: "text" as const, text: rows.map((r) => `${r.specialty} — ${r.dentistCount} dentist(s)`).join("\n") },
      ],
      structuredContent: { specialties: rows },
    };
  },
});
