import { DocLayout } from "@/components/doc-layout";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocLayout>{children}</DocLayout>;
}
