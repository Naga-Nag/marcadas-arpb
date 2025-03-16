import { checkDatabaseConnection } from "$lib/server/db";

export async function GET() {
     const dbConnection = await checkDatabaseConnection();
     console.log("Heartbeat", dbConnection);
     return new Response(JSON.stringify({ dbConnection }));
}