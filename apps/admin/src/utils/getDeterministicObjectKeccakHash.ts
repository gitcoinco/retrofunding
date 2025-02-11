import { Hex } from "viem";
import { keccak256, stringify, toHex } from "viem";

export async function getDeterministicObjectKeccakHash<T>(obj: T): Promise<Hex> {
  const deterministicString = stringify(obj);
  return keccak256(toHex(deterministicString));
}
