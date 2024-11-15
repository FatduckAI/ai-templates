import { RegistryItem } from "@/components/registry-item";
import { getClientById } from "@fatduckai/core";
import { notFound } from "next/navigation";

export default async function ClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const client = await getClientById(id);

  if (!client) {
    notFound();
  }

  return <RegistryItem item={client} />;
}
