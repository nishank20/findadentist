import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { dentists } from "../data";

export default defineTool({
  name: "search_dentists",
  title: "Search dentists",
  description:
    "Search the findadentist directory of dentists by specialty, accepted insurance carrier, city or address text, and minimum rating.",
  inputSchema: {
    query: z.string().optional().describe("Free text matched against dentist name, office name, or address."),
    specialty: z.string().optional().describe("Specialty such as Orthodontist, Periodontist, Pediatric Dentist."),
    insurance: z.string().optional().describe("Insurance carrier the dentist must accept, e.g. Aetna."),
    minRating: z.number().optional().describe("Minimum star rating from 0 to 5."),
    networkOnly: z.boolean().optional().describe("Only return Dental.com Network providers."),
    limit: z.number().optional().describe("Maximum number of results to return (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, specialty, insurance, minRating, networkOnly, limit }) => {
    const q = query?.trim().toLowerCase();
    const results = dentists
      .filter((d) => {
        if (q && ![d.name, d.officeName, d.address].some((f) => f.toLowerCase().includes(q))) return false;
        if (specialty && !d.specialty.toLowerCase().includes(specialty.trim().toLowerCase())) return false;
        if (insurance && !d.insurance.some((i) => i.toLowerCase() === insurance.trim().toLowerCase())) return false;
        if (typeof minRating === "number" && d.rating < minRating) return false;
        if (networkOnly && !d.networkProvider) return false;
        return true;
      })
      .sort((a, b) => Number(b.networkProvider) - Number(a.networkProvider) || b.rating - a.rating)
      .slice(0, Math.max(1, Math.min(limit ?? 10, 50)));

    return {
      content: [
        {
          type: "text" as const,
          text: results.length
            ? results
                .map(
                  (d) =>
                    `#${d.id} ${d.name} — ${d.officeName} (${d.specialty})\n${d.address}\nRating ${d.rating} (${d.reviews} reviews), ${d.distance}\nInsurance: ${d.insurance.join(", ")}${d.networkProvider ? "\nDental.com Network provider" : ""}`,
                )
                .join("\n\n")
            : "No dentists matched those filters.",
        },
      ],
      structuredContent: { count: results.length, dentists: results },
    };
  },
});
