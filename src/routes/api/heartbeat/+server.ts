import { checkDatabaseConnection } from "$lib/server/db";


export async function GET() {
     try {
          const dbConnection = await checkDatabaseConnection();
          return new Response(JSON.stringify(dbConnection));
     } catch (error) {
          console.error(error);
          if (error instanceof Error) {
               return new Response(JSON.stringify({ error: error.message }), { status: 500 });
          } else {
               return new Response(JSON.stringify({ error: "Unknown error" }), { status: 500 });
          }
     }
}