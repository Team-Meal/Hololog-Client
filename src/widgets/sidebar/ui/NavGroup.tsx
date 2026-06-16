import type { NavGroup as NavGroupData } from "../model/nav.data";
import { NavItem } from "./NavItem";

interface Props {
  group: NavGroupData;
}

export function NavGroup({ group }: Props) {
  return (
    <div>
      {group.label && (
        <p className="mb-1 px-3 py-1 text-xs text-zinc-400">{group.label}</p>
      )}
      <ul className="space-y-0.5">
        {group.items.map((item) => (
          <li key={item.id}>
            <NavItem item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
