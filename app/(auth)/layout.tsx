import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center items-center h-full">{children}</div>
  );
}
