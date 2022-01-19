import { JSON } from "assemblyscript-json";

export * from "./virtual-code";

export function parseJSON(buf: string): JSON.Value {
  return JSON.parse(buf);
}
