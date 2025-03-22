import Logo from "./Logo";
import ModeToggle from "./ModeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 p-4">
      <nav className="max-w-3xl mx-auto pl-6 pr-4 py-3 w-full bg-white dark:bg-neutral-900/70 backdrop-blur-lg rounded-full shadow-lg border border-input/50">
        <div className="w-full flex justify-between items-center">
          <Logo />
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
