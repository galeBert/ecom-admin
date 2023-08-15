import { UserButton, auth } from "@clerk/nextjs";
import React from "react";
import MainNav from "./main-nav";
import StoreSwitcher from "./store-switcher";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

export default async function Navbar() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const items = await prismadb.store.findMany({ where: { userId } });
  

  return (
    <div className="border-b">
      <div className="flex items-center px-4 h-16">
        <StoreSwitcher items={items} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}
