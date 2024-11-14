import { RegistryItem } from "@/components/registry-item";
import { getPromptById } from "@fatduckai/core";
import { notFound } from "next/navigation";

export default async function PromptPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const prompt = await getPromptById(id);

  if (!prompt) {
    notFound();
  }

  return <RegistryItem item={prompt} />;
}
