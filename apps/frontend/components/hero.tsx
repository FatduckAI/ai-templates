import { Features } from "./features";

export function Hero() {
  return (
    <div className="container py-16 md:py-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Prompts & Tools for LLMs
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          A collection of reusable prompts and tools for building AI
          applications. Easily copy and paste into your projects.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6 mx-auto h-full">
          <Features />
        </div>
      </div>
    </div>
  );
}
