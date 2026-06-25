import { CurrentDate } from "./CurrentDate";
import { PageTitle } from "./PageTitle";

export function TopBar() {
  return (
    <header className="flex h-18 shrink-0 items-center justify-between bg-white/90 px-4 backdrop-blur sm:px-6">
      <PageTitle />
      <CurrentDate />
    </header>
  );
}
