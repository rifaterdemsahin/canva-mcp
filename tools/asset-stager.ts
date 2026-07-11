export interface AssetStagerInput {
  assetGroup: string;
  urls: string[];
  tags?: string[];
}

export interface AssetManifest {
  manifestVersion: string;
  group: string;
  generatedAt: string;
  totalAssets: number;
  tags: string[];
  assets: Array<{
    index: number;
    url: string;
    filename: string;
    mimeType: string;
    status: string;
  }>;
}

function inferMimeType(url: string): string {
  const ext = url.split(".").pop()?.toLowerCase() ?? "";
  const mimeMap: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    avif: "image/avif",
    bmp: "image/bmp",
    tiff: "image/tiff",
    tif: "image/tiff",
  };
  return mimeMap[ext] ?? "application/octet-stream";
}

export function stageAssets(input: AssetStagerInput): AssetManifest {
  if (!input.urls.length) {
    throw new Error("At least one URL is required to stage assets.");
  }

  const assets = input.urls.map((url, index) => {
    const urlPath = new URL(url).pathname;
    const filename = urlPath.split("/").pop() || `asset-${index + 1}`;
    return {
      index: index + 1,
      url,
      filename,
      mimeType: inferMimeType(url),
      status: "pending",
    };
  });

  return {
    manifestVersion: "1.0.0",
    group: input.assetGroup,
    generatedAt: new Date().toISOString(),
    totalAssets: assets.length,
    tags: input.tags ?? [],
    assets,
  };
}
