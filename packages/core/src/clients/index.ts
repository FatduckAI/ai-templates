import { Client } from "../types";
import { telegramClient } from "./telegram";

export const clients: Client[] = [telegramClient];

export function getClientById(id: string): Client | undefined {
  return clients.find((client) => client.id === id);
}
