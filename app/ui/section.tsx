import React from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
}

export function Section({ title, description, className, children, ...props }: SectionProps) {
  return (
    <section className={className} {...props}>
      <div className="space-y-2 gap-4 mb-6">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">{title}</p>
        {description ? <p className="max-w-2xl text-sm ">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
