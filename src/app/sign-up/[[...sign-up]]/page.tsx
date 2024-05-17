import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FN-AI Sign Up"
}

export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen">
      <SignUp path="/sign-up" appearance={{ variables: {colorPrimary: "#0F172A"}}}/>;
    </div>
  )
}