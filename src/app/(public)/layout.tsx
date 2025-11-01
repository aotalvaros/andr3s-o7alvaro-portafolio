"use client";

import { App } from "./App";
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <App>{children}</App>
    </>
  );
}
