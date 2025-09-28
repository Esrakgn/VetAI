// This file is part of a redundant and conflicting route.
// It has been moved to this (unused-dashboard) group to disable the route
// and resolve the "parallel pages" error in Next.js.
// The correct layout is in /src/app/(main)/layout.tsx.
import React from 'react';

// This component is intentionally non-functional.
function RedundantLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default RedundantLayout;
