import React from 'react';

interface ContentAreaProps {
  children: React.ReactNode;
}

export default function ContentArea({ children }: ContentAreaProps) {
  return <main className="mx-auto w-full max-w-7xl px-6 py-8">{children}</main>;
}
