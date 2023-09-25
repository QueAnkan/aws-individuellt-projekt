import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient,PutCommand} from "@aws-sdk/lib-dynamodb";
import {nanoid} from "nanoid";

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
    
    const id = nanoid();
    
    const requestData = JSON.parse(event.body);
    
      // Skapa en PUTCommand för att Addera post med nytt id
      await dynamo.send(
        new PutCommand({
          TableName: tableName,
          Item: {
            id: id,
            animal: requestData.animal
          },
        })
      );

      body = `Addedd item ${id}`;
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