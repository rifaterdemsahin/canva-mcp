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
