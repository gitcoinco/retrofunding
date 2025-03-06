import stringify from "json-stringify-deterministic";
import { Hex } from "viem";
import { keccak256, toHex } from "viem";

export async function getDeterministicObjectKeccakHash<T>(obj: T): Promise<Hex> {
  const deterministicString = stringify(obj);
  return keccak256(toHex(deterministicString));
}
