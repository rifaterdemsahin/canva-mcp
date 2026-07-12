import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode,
} from "@modelcontextprotocol/sdk/types.js";
import { generateDesignBrief } from "../tools/design-brief.js";
import { stageAssets } from "../tools/asset-stager.js";
import { uploadAssetsToCanva } from "../tools/canva-api.js";

const server = new Server(
  {
    name: "canva-workspace-assistant",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "generate_design_brief",
      description:
        "Generate a structured Canva Design Kit brief from a client description. Returns a formatted brief with sections for project overview, target audience, brand guidelines, deliverables, and timeline.",
      inputSchema: {
        type: "object",
        properties: {
          clientName: {
            type: "string",
            description: "Name of the client or project",
          },
          description: {
            type: "string",
            description: "Detailed description of the design request",
          },
          brandColors: {
            type: "array",
            items: { type: "string" },
            description: "Optional brand color hex codes (e.g. #FF0000)",
          },
          deliverables: {
            type: "array",
            items: { type: "string" },
            description: "Optional list of deliverable types (e.g. Instagram post, Banner, Logo)",
          },
          tone: {
            type: "string",
            enum: ["professional", "playful", "luxury", "minimal", "bold"],
            description: "Optional brand voice / tone preference",
          },
        },
        required: ["clientName", "description"],
      },
    },
    {
      name: "stage_assets",
      description:
        "Accept an array of image URLs and generate a brand-asset manifest file that can be synced into Canva. Returns a JSON manifest with asset metadata ready for the Canva API.",
      inputSchema: {
        type: "object",
        properties: {
          assetGroup: {
            type: "string",
            description: "Name for this asset group (e.g. Q3 Campaign, Rebrand 2026)",
          },
          urls: {
            type: "array",
            items: { type: "string" },
            description: "Array of publicly accessible image URLs to stage",
          },
          tags: {
            type: "array",
            items: { type: "string" },
            description: "Optional tags to apply to all assets in this group",
          },
        },
        required: ["assetGroup", "urls"],
      },
    },
    {
      name: "upload_assets",
      description:
        "Upload staged assets to Canva via the Brand Assets API. Takes a manifest (from stage_assets) and uploads each asset. Requires CANVA_ACCESS_TOKEN in the environment.",
      inputSchema: {
        type: "object",
        properties: {
          manifest: {
            type: "object",
            description: "The asset manifest object (from stage_assets output)",
            properties: {
              group: { type: "string" },
              assets: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    url: { type: "string" },
                    filename: { type: "string" },
                    mimeType: { type: "string" },
                  },
                },
              },
            },
            required: ["group", "assets"],
          },
        },
        required: ["manifest"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "generate_design_brief": {
      const { clientName, description, brandColors, deliverables, tone } =
        request.params.arguments as {
          clientName: string;
          description: string;
          brandColors?: string[];
          deliverables?: string[];
          tone?: string;
        };
      if (typeof clientName !== "string" || typeof description !== "string") {
        throw new McpError(
          ErrorCode.InvalidParams,
          "generate_design_brief requires 'clientName' (string) and 'description' (string)"
        );
      }
      try {
        const brief = generateDesignBrief({
          clientName,
          description,
          brandColors,
          deliverables,
          tone,
        });
        return {
          content: [
            {
              type: "text",
              text: brief,
            },
          ],
        };
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to generate design brief: ${(error as Error).message}`
        );
      }
    }

    case "stage_assets": {
      const { assetGroup, urls, tags } = request.params.arguments as {
        assetGroup: string;
        urls: string[];
        tags?: string[];
      };
      if (typeof assetGroup !== "string" || !Array.isArray(urls)) {
        throw new McpError(
          ErrorCode.InvalidParams,
          "stage_assets requires 'assetGroup' (string) and 'urls' (string array)"
        );
      }
      try {
        const manifest = stageAssets({ assetGroup, urls, tags });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(manifest, null, 2),
            },
          ],
        };
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to stage assets: ${(error as Error).message}`
        );
      }
    }

    case "upload_assets": {
      const { manifest } = request.params.arguments as {
        manifest: {
          group: string;
          assets: Array<{ url: string; filename: string; mimeType: string }>;
        };
      };
      if (!manifest || !manifest.assets || !manifest.group) {
        throw new McpError(
          ErrorCode.InvalidParams,
          "upload_assets requires 'manifest' with 'group' (string) and 'assets' (array)"
        );
      }
      const accessToken = process.env.CANVA_ACCESS_TOKEN;
      if (!accessToken) {
        throw new McpError(
          ErrorCode.InternalError,
          "CANVA_ACCESS_TOKEN not set. Run the OAuth PKCE flow via auth.html and add the token to .env"
        );
      }
      try {
        const result = await uploadAssetsToCanva(manifest, accessToken);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Upload failed: ${(error as Error).message}`
        );
      }
    }

    default:
      throw new McpError(
        ErrorCode.MethodNotFound,
        `Unknown tool: ${request.params.name}`
      );
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Canva Workspace Assistant MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error starting server:", error);
  process.exit(1);
});
