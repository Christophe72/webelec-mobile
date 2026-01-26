import { fetchNavigation } from "@/lib/api/navigation";
import SidebarSection from "@/components/sidebar/SidebarSection";

export default async function Sidebar() {
  const navigation = await fetchNavigation();

  if (navigation.sections.length === 0) {
    return null;
  }

  return (
    <aside>
      {navigation.sections.map((section) => (
        <SidebarSection key={section.code} section={section} />
      ))}
    </aside>
  );
}
