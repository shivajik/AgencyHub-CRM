import { ReactNode } from "react";
import { Link } from "wouter";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 to-purple-600/40" />
        
        <div className="relative z-20 flex items-center text-lg font-medium">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground mr-2">
            <span className="text-lg font-bold">A</span>
          </div>
          <span className="font-heading font-bold text-2xl">AgencyFlow</span>
        </div>
        
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This platform has completely transformed how we manage our digital campaigns. The client portal alone saved us 20 hours of emails per week.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis, CEO at DigitalAge</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {children}
        </div>
      </div>
    </div>
  );
}