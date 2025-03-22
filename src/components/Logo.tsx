import Image from "next/image";

export default function Logo() {
    return (
        <div className="flex items-center justify-center gap-x-2.5">
            <Image src={"/logo.svg"} width={40} height={40} alt="Logo" />
            <span className="font-bold text-xl">SQL Editor</span>
        </div>
    )
}