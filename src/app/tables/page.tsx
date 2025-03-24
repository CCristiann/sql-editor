import Image from "next/image";

export default function Tables() {
  return (
    <section id="tables" className="my-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-0">
            <div className="flex flex-col items-center justify-center gap-4">
                <Image alt="Tables" src={"/tables-2.png"} width={500} height={500} className="rounded-2xl border border-input/50" />
                <Image alt="Tables" src={"/tables-1.png"} width={500} height={500} className="rounded-2xl border border-input/50" />
            </div>
        </div>
    </section>
  );
}   