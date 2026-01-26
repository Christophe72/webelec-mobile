import Link from "next/link";
import type { NavigationItem } from "@/lib/api/navigation";

export default function SidebarItem({
  item
}: {
  item: NavigationItem;
}) {
  return (
    <li>
      <Link href={item.route}>{item.label}</Link>
    </li>
  );
}
