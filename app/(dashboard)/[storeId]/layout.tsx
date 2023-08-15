import { UserButton, auth } from "@clerk/nextjs";
import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar";

export default async function layout({
  params,
  children,
}: {
  children: ReactNode;
  params: { storeId: string };
}) {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const store = await prismadb.store.findFirst({
    where: { id: params.storeId, userId },
  });
  if (!store) {
    redirect("/");
  }
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
