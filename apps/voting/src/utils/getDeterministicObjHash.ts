import stringify from "json-stringify-deterministic";
import { type Hex, keccak256, toHex } from "viem";

export async function getDeterministicObjHash<T>(obj: T): Promise<Hex> {
  const hash = stringify(obj);
  return keccak256(toHex(hash));
}
