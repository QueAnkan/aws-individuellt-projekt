import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient,PutCommand} from "@aws-sdk/lib-dynamodb";


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
    

    
    const requestData = JSON.parse(event.body);
    
      // Skapa en PUTCommand för att ändra Item
      await dynamo.send(
        new PutCommand({
          TableName: tableName,
          Item: {
            ...requestData,
            id: requestData.id          },
        })
      );

      body = `Addedd item ${requestData.id}`;
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