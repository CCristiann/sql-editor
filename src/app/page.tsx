import { Vortex } from "@/components/aceternityui/Vortex";
import Editor from "@/components/Editor";


export default function Home() {
  return (
    <section id="sql-editor" className="relative my-20">
      <div className="max-w-3xl w-full mx-auto px-4 lg:px-0">
        <div className="flex flex-col gap-y-6">
          <Editor />
        </div>
      </div>
      <div className="fixed top-0 left-0 -z-10 w-screen h-screen">
      <Vortex
        backgroundColor="transparent"
        rangeY={800}
        particleCount={70}
        baseHue={120}
        className="bg-transparent w-full h-full"
      />
      </div>
    </section>
  );
}
