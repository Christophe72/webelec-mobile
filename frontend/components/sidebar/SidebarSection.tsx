import SidebarItem from "@/components/sidebar/SidebarItem";
import type { NavigationSection } from "@/lib/api/navigation";

export default function SidebarSection({
  section
}: {
  section: NavigationSection;
}) {
  return (
    <section>
      <div>{section.label}</div>
      <ul>
        {section.items.map((item) => (
          <SidebarItem key={item.code} item={item} />
        ))}
      </ul>
    </section>
  );
}
