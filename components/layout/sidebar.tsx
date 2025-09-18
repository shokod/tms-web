"use client";

import { SidebarNav } from './sidebar-nav';

export function Sidebar() {
  return (
    <div className="fixed inset-y-0 left-0 z-20 flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <span className="text-lg font-semibold">Tms</span>
      </div>
      <div className="flex-1 overflow-auto">
        <SidebarNav />
      </div>
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">Delvin Shoko</span>
            <span className="text-xs text-muted-foreground">Senior Developer</span>
          </div>
        </div>
      </div>
    </div>
  );
}