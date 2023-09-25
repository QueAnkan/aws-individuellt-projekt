import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient,DeleteCommand} from "@aws-sdk/lib-dynamodb";


const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "animals-table";

export const handler = async (event) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
      // Skapa en DeleteCommand för att ta bort 
      await dynamo.send(
        new DeleteCommand({
          TableName: tableName,
          Key: {
            id: event.pathParameters.id,
            
          },
        })
      );

      body = `deleted animal with id: ${event.pathParameters.id}`;
    } 
   catch (error) {
    statusCode = 500;
    body = error.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};