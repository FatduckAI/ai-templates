import { RegistryItem } from "@/components/registry-item";
import { getToolById } from "@fatduckai/core";
import { notFound } from "next/navigation";

export default async function ToolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const tool = getToolById(id);

  if (!tool) {
    notFound();
  }

  return <RegistryItem item={tool} />;
}
