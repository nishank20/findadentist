import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { dentists } from "../data";

export default defineTool({
  name: "get_dentist",
  title: "Get dentist details",
  description: "Get the full profile of one dentist in the findadentist directory by id.",
  inputSchema: { id: z.number().describe("Dentist id returned by search_dentists.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const dentist = dentists.find((d) => d.id === id);
    if (!dentist) throw new ToolError(`No dentist found with id ${id}.`);
    return {
      content: [
        {
          type: "text" as const,
          text: `${dentist.name} — ${dentist.officeName}\nSpecialty: ${dentist.specialty}\nAddress: ${dentist.address}\nRating: ${dentist.rating} (${dentist.reviews} reviews)\nDistance: ${dentist.distance}\nAccepted insurance: ${dentist.insurance.join(", ")}\nDental.com Network provider: ${dentist.networkProvider ? "yes" : "no"}\nDirections: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dentist.address)}`,
        },
      ],
      structuredContent: { dentist },
    };
  },
});
