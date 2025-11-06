"use client";

import { App } from "./App";
import PublicRoute from '@/components/auth/PublicRoute';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <PublicRoute>
      <App>{children}</App>
    </PublicRoute>
    </>
  );
}
