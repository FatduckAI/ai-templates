import { FileText, Terminal, Wrench } from "lucide-react";
import Link from "next/link";

export function Features() {
  const features = [
    {
      title: "Prompts",
      description: "Pre-built prompt templates for common use cases.",
      icon: FileText,
      link: "/registry/prompts",
    },
    {
      title: "Tools",
      description:
        "Utility functions and integrations for enhancing AI responses.",
      icon: Wrench,
      link: "/registry/tools",
    },
    {
      title: "@fatduckai/ai",
      description:
        "A lightweight and efficient prompt builder npm package for parsing and linting prompts.",
      icon: Terminal,
      link: "https://github.com/FatduckAI/ai",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
      {features.map((feature) => (
        <Link
          href={feature.link}
          key={feature.title}
          className="h-full block group"
        >
          <div className="relative overflow-hidden rounded-lg border bg-background p-6 h-full flex flex-col transition-transform duration-300 ease-out transform group-hover:scale-105 items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <feature.icon className="h-6 w-6" />
            </div>
            <div className="flex flex-col flex-1">
              <h3 className="mt-4 text-lg font-medium">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
