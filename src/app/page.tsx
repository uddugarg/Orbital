import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 flex items-center">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left section: Content & CTAs */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Orbital
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-md">
                A modern task management system designed to help teams organize, track, and complete tasks efficiently.
              </p>
              <p className="text-muted-foreground">
                Visualize workflow, manage deadlines, and boost productivity with our intuitive platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/tasks">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Tasks
                </Button>
              </Link>
            </div>

            <div className="pt-4">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-primary/10 border border-background flex items-center justify-center text-xs font-medium">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Join <span className="font-medium text-foreground">2,500+</span> teams using Orbital
                </p>
              </div>
            </div>
          </div>

          {/* Right section: App screenshot */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-3xl opacity-30"></div>
            <div className="relative bg-background border border-border rounded-lg shadow-xl overflow-hidden">
              {/* Replace with your actual app screenshot */}
              <div className="aspect-[16/10] relative bg-muted">
                <Image
                  src="/app-screenshot.png"
                  alt="Orbital app screenshot"
                  fill
                // className="object-contain"
                // If you don't have an image yet, remove the Image component and use this placeholder:
                // style={{ background: "linear-gradient(to bottom right, #3b82f6, #8b5cf6)" }}
                />

                {/* Fallback if image is not available */}
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <span>App Screenshot</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
