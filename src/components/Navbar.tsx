import ModeToggle from "./ModeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-md border-b border-input/50 shadow-md">
      <nav className="max-w-5xl w-full mx-auto p-4 lg:px-0">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-4xl font-bold">SQL Editor</h1>
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
