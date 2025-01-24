import { config } from "@/config";
import { AnyJson, IpfsUploader, Result, success } from "@/types";

export function uploadData(file: Blob | AnyJson): Promise<Result<string>> {
  const { pinataJwt: token, pinataUploadUrl: endpoint } = config;

  return createPinataIpfsUploader({
    token,
    endpoint,
  })(file);
}
function createPinataIpfsUploader(args: {
  token: string;
  endpoint: string;
  fetch?: typeof globalThis.fetch;
}): IpfsUploader {
  const { fetch = globalThis.fetch, token, endpoint } = args;

  return async (file: Blob | AnyJson): Promise<Result<string>> => {
    const params = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        pinataMetadata: {
          name: "Gitcoin Retrofunding Admin",
          keyvalues: {
            app: "Gitcoin Retrofunding Admin",
          },
        },
        pinataOptions: {
          cidVersion: 1,
        },
      },
    };

    const fd = new FormData();
    let blob: Blob;

    if (file instanceof Blob) {
      blob = file;
    } else {
      blob = new Blob([JSON.stringify(file)], { type: "application/json" });
    }

    fd.append("file", blob);
    fd.append("pinataOptions", JSON.stringify(params.body.pinataOptions));
    fd.append("pinataMetadata", JSON.stringify(params.body.pinataMetadata));

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: fd,
    });

    if (!res.ok) {
      throw new Error(`Failed to upload file to IPFS: ${await res.text()}`);
    }

    const json = (await res.json()) as { IpfsHash: string };

    return success(json.IpfsHash);
  };
}
