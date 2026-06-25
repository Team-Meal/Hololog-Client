import type { NavGroup as NavGroupData } from "../model/nav.data";
import { NavItem } from "./NavItem";

interface Props {
  group: NavGroupData;
}

export function NavGroup({ group }: Props) {
  return (
    <div>
      <p className="mb-2 px-3 text-xs font-semibold text-zinc-400">{group.label}</p>
      <ul className="space-y-1">
        {group.items.map((item) => (
          <li key={item.id}>
            <NavItem item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
