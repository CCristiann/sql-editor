import Link from "next/link";
import Logo from "./Logo";
import ModeToggle from "./ModeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 p-4 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-lg shadow-lg border border-input/50">
      <nav className="max-w-7xl mx-auto w-full">
        <div className="w-full flex justify-between items-center">
          <Logo />
          <Link target="_blank" href={"tables"}>
            View tables
          </Link>
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
