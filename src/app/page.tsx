import Editor from "@/components/Editor";
import ModeToggle from "@/components/ModeToggle";

export default function Home() {
  return (
    <section id="sql-editor" className="my-20">
      <div className="max-w-5xl w-full mx-auto px-4 lg:px-0">
        <div className="flex flex-col gap-y-6">
          <Editor />
        </div>
      </div>
    </section>
  );
}
