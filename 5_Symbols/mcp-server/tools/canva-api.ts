export interface CanvaUploadResult {
  success: boolean;
  assetId?: string;
  url?: string;
  error?: string;
}

export interface UploadManifest {
  group: string;
  assets: Array<{
    url: string;
    filename: string;
    mimeType: string;
  }>;
}

export interface CreateDesignResult {
  success: boolean;
  designId?: string;
  title?: string;
  editUrl?: string;
  viewUrl?: string;
  error?: string;
}

export async function createDesign(
  title: string,
  accessToken: string,
  designType: string = "doc"
): Promise<CreateDesignResult> {
  try {
    const res = await fetch("https://api.canva.com/rest/v1/designs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        design_type: { type: "preset", name: designType },
        title,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, title, error: `HTTP ${res.status}: ${errText}` };
    }

    const data = await res.json();
    return {
      success: true,
      designId: data.design?.id,
      title: data.design?.title ?? title,
      editUrl: data.design?.urls?.edit_url,
      viewUrl: data.design?.urls?.view_url,
    };
  } catch (err) {
    return { success: false, title, error: (err as Error).message };
  }
}

export async function uploadAssetsToCanva(
  manifest: UploadManifest,
  accessToken: string
): Promise<{ results: CanvaUploadResult[] }> {
  const results: CanvaUploadResult[] = [];

  for (const asset of manifest.assets) {
    try {
      const body = {
        name: asset.filename,
        url: asset.url,
        mime_type: asset.mimeType,
        tags: [manifest.group],
      };

      const res = await fetch("https://api.canva.com/rest/v1/brand-assets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        results.push({
          success: false,
          url: asset.url,
          error: `HTTP ${res.status}: ${errText}`,
        });
        continue;
      }

      const data = await res.json();
      results.push({
        success: true,
        assetId: data.id,
        url: asset.url,
      });
    } catch (err) {
      results.push({
        success: false,
        url: asset.url,
        error: (err as Error).message,
      });
    }
  }

  return { results };
}
