import { db } from "./src/database/database.connection.js";
import fs from "fs";

const mycollection = 'products';

// JSON file path
const jsonFilePath = 'products.json';

// Read the JSON file
fs.readFile(jsonFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  const jsonData = JSON.parse(data);
  const collection = db.collection(mycollection);
  
// Insert the JSON data into the collection
    collection.insertMany(jsonData, (err, result) => {
        if (err) {
        console.error('Error inserting documents:', err);
        } else {
        console.log(`${result.insertedCount} documents inserted successfully.`);
        }

        // Close the MongoDB connection
        db.close();
    });
});

