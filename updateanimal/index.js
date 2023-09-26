import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient,UpdateCommand} from "@aws-sdk/lib-dynamodb";


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

    const filteredData = Object.entries(requestData).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const updateExpression = Object.entries(filteredData).filter(([key]) => key !== 'id') // Filtrera bort 'id'
    .reduce((acc, [key, _], index, array) => {
    
  
        // Lägg till '#key = :value' till strängen
        return acc + `#${key} = :${key}` + (index + 1 < array.length ? ', ' : '');
  }, 'SET ');
    
    const expressionAttributeNames = Object.entries(filteredData).reduce((acc, [key]) => {
      if (key === 'id') {
        return acc;
      }
    
      return { ...acc, [`#${key}`]: key };
    }, {});
    
    const expressionAttributeValues = Object.entries(filteredData).reduce((acc, [key, value]) => {
      if (key === 'id') {
        return acc;
      }
    
      return { ...acc, [`:${key}`]: value };
    }, {});

    
    
      // Skapa en PUTCommand för att ändra Item
      await dynamo.send(
        new UpdateCommand({
          TableName: tableName,
          Key: { id: requestData.id },
          UpdateExpression: updateExpression,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
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