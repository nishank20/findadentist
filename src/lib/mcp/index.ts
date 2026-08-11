import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchDentists from "./tools/search-dentists";
import getDentist from "./tools/get-dentist";
import listInsuranceCarriers from "./tools/list-insurance-carriers";
import listSpecialties from "./tools/list-specialties";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "findadentist",
  title: "findadentist",
  version: "0.1.0",
  instructions:
    "Tools for findadentist, a dentist discovery app. Use `search_dentists` to find dentists by specialty, insurance, location text, or rating; `get_dentist` for a full profile; `list_insurance_carriers` and `list_specialties` to discover valid filter values.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [searchDentists, getDentist, listInsuranceCarriers, listSpecialties],
});
