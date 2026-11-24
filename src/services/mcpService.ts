import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { getMongoDBTool } from "../tools/mongodbTool.ts";
import { getCsvToJsonTool } from "../tools/csvToJsonTool.ts";
import { getFSTool } from "../tools/fsTool.ts";

export const getMCPTools = async () => {


  const mcpClient = new MultiServerMCPClient({
    mcpServers: {
        ...getMongoDBTool(),
        ...getFSTool(),
    },
    onMessage: (log, source) => {
        console.log(`[${source.server}] ${log.data}`);
    }
  });

  const mcpTools = await mcpClient.getTools();

  return [
    ...mcpTools,
    getCsvToJsonTool()
  ];
};
