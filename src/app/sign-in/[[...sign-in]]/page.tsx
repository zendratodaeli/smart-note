import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FN-AI Sign In"
}

export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen">
      <SignIn path="/sign-in" appearance={{ variables: {colorPrimary: "#0F172A"}}}/>;
    </div>
  )
}