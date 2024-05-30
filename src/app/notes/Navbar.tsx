"use client"

import AIChatButton from "@/components/AIChatButton"
import AddEditNoteDialog from "@/components/AddEditNoteDialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { OrganizationSwitcher, SignInButton, SignedIn, SignedOut, UserButton, useOrganization } from "@clerk/nextjs"
import { Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const Navbar = () => {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { organization } = useOrganization();
  console.log(organization?.id)
  useEffect(() => {
    setMounted(true)
  }, []);

  if(!mounted) {
    return null;
  }

  return (
    <>
      <div className=" p-4 shadow dark:border">
        <div className=" max-w-7xl m-auto flex flex-wrap gap-3 items-center justify-between">
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/logo.svg"
              alt="logo"
              width={20}
              height={20}
            />
            <span className=" font-bold">FO - AI</span>
          </Link>
          <div className=" flex items-center gap-3">
            <ThemeToggle/>
            <Button onClick={() => setShowAddEditNoteDialog(true)}>
              <Plus size={20} className="mr-2"/>
              Add Note
            </Button>
            <AIChatButton/>
            <OrganizationSwitcher/>
            <UserButton afterSignOutUrl='/'/>
          </div>
        </div>
      </div>
      <AddEditNoteDialog open={showAddEditNoteDialog} setOpen={setShowAddEditNoteDialog} />
    </>
  )
}

export default Navbar
