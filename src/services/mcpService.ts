import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { getMongoDBTool } from "../tools/mongodbTool.ts";

export const getMCPTools = async () => {


  const mcpClient = new MultiServerMCPClient({
    mcpServers: {
        ...getMongoDBTool(),
    },
    onMessage: (log, source) => {
        console.log(`[${source.server}] ${log.data}`);
    }
  });

  const mcpTools = await mcpClient.getTools();

  return [
    ...mcpTools,
  ];
};
