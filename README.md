#### A Google Drive scanning tool using Google Apps Script designed to provide a comprehensive overview of organizational file access. This tool automatically generates a detailed Google Sheets report listing file names, URLs, access permissions, and ownership. It identifies and flags files with potential external & internal access to prevent unauthorized exposure of sensitive documents.

# Google Sheets File Access Auditor

This Google Apps Script creates a new Google Sheet to log details of all Google Sheets files accessible to the active user, including information about file name, owner, editor access, and file URL. It processes files in batches to handle large volumes and sends a notification email with the link to the generated Google Sheet.

## Features

- **Automated Google Sheets Creation**: Creates a new Google Sheet with a unique name based on the active user’s username.
- **Batch Processing**: Processes Google Sheets files in batches for efficient handling of large datasets.
- **Editor Access Logging**: Records the emails of users who have edit access to each file, including files that are publicly accessible.
- **Email Notification**: Sends an email to the active user with a link to the generated Google Sheet containing the file access details.
- **CC Notification**: Allows specifying additional email recipients for notification.

## Prerequisites

- A Google account with access to Google Drive and Google Sheets.
- Google Apps Script editor access to create and deploy the script.

## Setup

1. Open your Google Drive and create a new Google Apps Script project.
2. Copy and paste the code from this repository into your Apps Script editor.
3. Adjust the `CC` variable in the script to specify the email addresses (comma-separated) of additional recipients who should receive access to the created Google Sheet.
4. Run the script with the desired batch size (e.g., 50) to process Google Sheets files and record access details.

---

## Code Explanation

### Variables and Setup

```javascript
var CC = 'test@test.com';
var username = Session.getActiveUser().getUsername();
```

`CC`: Email addresses of recipients who should have access to the created Google Sheet.
`username`: The username of the active Google user, used in naming the new Google Sheet.


# Functions
1. `createAndShareSheet()`
This function creates a new Google Sheet and shares access with the recipients specified in `CC`. It also sends an email to the active user containing the link to the created Google Sheet.

**Parameters:** None
**Returns:** sheet - the created Google Sheet object.

2. `listGoogleSheetsFilesInBatches(batchSize)`
This function retrieves all Google Sheets files in the user’s Google Drive and processes them in batches. Each batch is recorded in the generated Google Sheet.

**Parameters:** batchSize - number of files to process in each batch.
**Returns:** A promise that resolves when all batches are processed.

3. `getEditors(file)`
This function retrieves the emails of users who have edit access to a specified file, checking for both direct editors and public access.

**Parameters:** file - a Google Drive file object.
**Returns:** editors - an array of editor email addresses.

4. `rocessBatch(sheet, batch)`
This function processes each batch by appending file details (name, owner, editors, and URL) to the Google Sheet.

**Parameters:**
`sheet`: The Google Sheet object where data is being logged.
`batch`: An array containing details of the current batch of files.
**Returns:** A promise that resolves when the batch is processed.

---

# Example Usage
To run the script, specify the batch size and execute the main function:
```
var batchSize = 50;
listGoogleSheetsFilesInBatches(batchSize);
```

# Logging and Debugging
The script logs batch processing status and errors using the Logger.log() function, which helps in debugging any issues during execution. You can view logs in the Apps Script editor under View > Logs.

# Notes
**Performance:** The script is optimized for large datasets by using batch processing and asynchronous execution.
**Access Permissions:** Ensure that the script has sufficient permissions to read Google Drive files and send emails.
**Error Handling:** Errors accessing specific files are logged, and the script continues to the next file in the batch.


# License
This project is licensed under the MIT License. See the LICENSE file for more information.


### Summary of Sections

- **Introduction**: Brief overview of the script's purpose and functionality.
- **Features**: Key features and capabilities.
- **Prerequisites**: Requirements before running the script.
- **Setup**: Steps to configure the script.
- **Code Explanation**: Description of key variables and functions.
- **Example Usage**: Instructions on how to run the script.
- **Logging and Debugging**: Information on viewing logs for debugging.
- **Notes**: Important considerations for permissions, performance, and error handling.
- **License**: Licensing information for the project.

This `README.md` provides a comprehensive guide for understanding, setting up, and running the script effectively.
