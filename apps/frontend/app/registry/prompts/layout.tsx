import { DocLayout } from "@/components/doc-layout";

export default function PromptsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocLayout>{children}</DocLayout>;
}
