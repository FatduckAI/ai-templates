import { RegistryItem } from "@/components/registry-item";
import { getPromptById } from "@fatduckai/core";
import { notFound } from "next/navigation";

export default async function PromptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const prompt = await getPromptById(id);

  if (!prompt) {
    notFound();
  }

  return <RegistryItem item={prompt} />;
}
