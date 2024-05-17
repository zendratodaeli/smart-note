import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();

  if(userId) redirect("/notes")

  return (
    <main className=" flex flex-col h-screen items-center justify-center gap-5">
      <div className="flex items-center gap-4">
        <Image
          src="/logo.svg"
          alt="logo"
          width={100}
          height={100}
        />
        <span className=" font-extrabold tracking-tight text-4xl lg:text-5xl">
          FN - AI
        </span>
      </div>
      <p className=" text-center">
        An Intelligence note-taking app with AI integration
      </p>

      <Button size={"lg"} asChild>
        <Link href="/notes">Open</Link>
      </Button>
    </main>
  );
}