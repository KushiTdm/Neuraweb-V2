import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  ref?: React.RefObject<HTMLDivElement>;
}

export const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ children, className = '' }, ref) => {
    return (
      <section ref={ref} className={className}>
        {children}
      </section>
    );
  }
);

Section.displayName = 'Section';
