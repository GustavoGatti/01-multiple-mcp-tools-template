import { tool } from "langchain";
import csvtojson from "csvtojson";
import {z} from "zod/v3";

export function getCsvToJsonTool() {
    return tool(
        async ({csvText}) => {
            const result = await csvtojson().fromString(csvText);
            console.log("[getCsvToJsonTool] CSV to JSON conversion result:", result.length, 'records');
            return JSON.stringify(result);
        },
        {
            name: 'csv_to_json',
            description: 'Convert CSV text to JSON',
            schema: z.object({
                csvText: z.string().describe("CSV data to be converted to JSON formart")
            })
        }
        
    );
}
