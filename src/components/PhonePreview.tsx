import type { ReactNode } from "react";

interface PhonePreviewProps {
  children: ReactNode;
}

export function PhonePreview({ children }: PhonePreviewProps) {
  return (
    <div className="mx-auto flex max-w-lg justify-center">
      <div data-phone-preview-shell className="relative w-[430px] overflow-hidden rounded-[44px] border-[6px] border-slate-800 bg-white shadow-2xl">
        <div className="absolute left-1/2 top-0 z-10 h-[28px] w-[140px] -translate-x-1/2 rounded-b-2xl bg-slate-800" />
        <div data-phone-preview-content className="flex min-h-[760px] flex-col bg-white">{children}</div>
        <div className="absolute bottom-2 left-1/2 z-10 h-[5px] w-[120px] -translate-x-1/2 rounded-full bg-slate-300" />
      </div>
    </div>
  );
}
