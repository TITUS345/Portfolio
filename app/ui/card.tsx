import React from 'react';
import { clsx } from 'clsx';

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={clsx('relative overflow-hidden rounded-3xl border border-gray-400 bg-gray-200 shadow-sm shadow-black/5 transition-all duration-300 hover:scale-[1.05] hover:shadow-xl hover:z-10', className)} 
      {...props}
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-400 shadow-[0_2px_10px_rgba(37,99,235,0.4)]" />
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
