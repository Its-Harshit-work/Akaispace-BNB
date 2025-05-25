// const { google } = require('googleapis');
// const path = require('path');
// const fs = require('fs');

// // Load env vars
// require('dotenv').config();

// const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// const auth = new google.auth.GoogleAuth({
//   keyFile: path.join(__dirname, '../config/credentials.json'), // Path to your service account key file
//   scopes: SCOPES,
// });

// const sheets = google.sheets({ version: 'v4', auth });

// const appendToGoogleSheet = async (newData) => {
//   const spreadsheetId = process.env.GOOGLE_SHEET_ID;

//   // Convert each record into array of values
//   const values = newData.map(record => [
//     record.FirstName,
//     record.LastName,
//     record.Email,
//     record.Phone,
//     record.Company,
//     record.Message
//   ]);

//   try {
//     await sheets.spreadsheets.values.append({
//       spreadsheetId,
//       range: 'Responses!A1', // Sheet name
//       valueInputOption: 'USER_ENTERED',
//       insertDataOption: 'INSERT_ROWS',
//       requestBody: {
//         values: values,
//       },
//     });

//     console.log('Data appended to Google Sheet');
//   } catch (err) {
//     console.error('Error appending data to Google Sheet:', err.message);
//   }
// };

// module.exports = { appendToGoogleSheet };


const xlsx = require("xlsx");
const fs = require("fs");

const appendToExcel = async (filePath, newData) => {
  const sheetName = "Responses";
  let workbook;
  let jsonData = [];

  // Load the existing workbook or create a new one
  if (fs.existsSync(filePath)) {
    workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[sheetName];
    if (worksheet) {
      jsonData = xlsx.utils.sheet_to_json(worksheet); // Load existing data
    }
  } else {
    workbook = xlsx.utils.book_new(); // Create a new workbook
  }

  // Update existing records or add new ones
  newData.forEach(newRecord => {
    const existingIndex = jsonData.findIndex(
      record =>
        record.FirstName === newRecord.FirstName &&
        record.LastName === newRecord.LastName
    );

    if (existingIndex !== -1) {
      // Update the existing record
      jsonData[existingIndex] = { ...jsonData[existingIndex], ...newRecord };
    } else {
      // Add the new record
      jsonData.push(newRecord);
    }
  });

  // Convert JSON data back to worksheet
  const worksheet = xlsx.utils.json_to_sheet(jsonData);

  // Remove existing sheet if it exists
  if (workbook.Sheets[sheetName]) {
    delete workbook.Sheets[sheetName];
    workbook.SheetNames = workbook.SheetNames.filter(name => name !== sheetName);
  }

  // Append the updated worksheet to the workbook
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Save the workbook
  xlsx.writeFile(workbook, filePath);
};

module.exports = { appendToExcel };