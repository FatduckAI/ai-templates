export interface RegistryItem {
  name: string;
  file: string;
  type: "prompt" | "tool";
  category?: "base" | "specialized";
  dependencies?: string[];
}

export interface Registry {
  [key: string]: RegistryItem;
}
