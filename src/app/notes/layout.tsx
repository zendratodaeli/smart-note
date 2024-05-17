import React from "react"
import Navbar from "./Navbar"

const Layout = ({children}: {
  children: React.ReactNode
}) => {
  return (
    <>
      <Navbar/>
      <main className="m-auto p-4 max-w-7xl">{children}</main> 
    </>
  )
}

export default Layout
