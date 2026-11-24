import { getPublicServiceProviders } from "@/domain/services/services-dto";
import { createClient } from "@/utils/supabase/server";
import ExploreTabs from "./ExploreTabs";

export const metadata = {
  title: "Explore",
  description: "Search community organizations, districts, businesses, nonprofits, and services.",
};

export default async function ExplorePage() {
  const supabase = await createClient();
  const providers = await getPublicServiceProviders(supabase);

  return <ExploreTabs providers={providers} />;
}
