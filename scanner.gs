// Define the email address to CC in the notification email
var CC = 'test@test.com';

// Get the username of the currently active user
var username = Session.getActiveUser().getUsername();

// Function to create a new Google Sheet and share access with specified recipients
function createAndShareSheet() {
  // Create a new Google Sheet with a name that includes the username
  var sheet = SpreadsheetApp.create("Infosec Drive Scans Activity - " + username);
  
  // Split the CC email list by commas to handle multiple recipients
  var recipients = CC.split(",");
  
  // Share the newly created sheet with each recipient in the CC list
  recipients.forEach(function(email) {
    sheet.addEditor(email.trim());
  });

  // Get the URL of the newly created Google Sheet
  var sheetUrl = sheet.getUrl();

  // Prepare and send an email to the user with the sheet link
  var name = Session.getActiveUser().getUsername();
  var email = Session.getActiveUser().getEmail();
  var html = 'Hey ' + name + ',';
  html += '<h4>Please find the file URL : </h4>' + sheetUrl;
  
  // Send email with HTML body and CC recipients
  MailApp.sendEmail(email, 'Infosec Drive Scans Activity Audit - File URL ' + name, '', {
    htmlBody: html,
    cc: CC
  });

  // Return the created sheet object for further processing
  return sheet;
}

// Function to list all Google Sheets files in Google Drive in batches
function listGoogleSheetsFilesInBatches(batchSize) {
  // Get only Google Sheets files from the user's Google Drive
  var files = DriveApp.getFilesByType(MimeType.GOOGLE_SHEETS); 
  var promises = [];  // Array to hold promises for asynchronous batch processing
  var batchCount = 0;

  // Create and share a new Google Sheet for recording file details
  var sheet = createAndShareSheet();

  // Loop through each file in the Google Drive (only Google Sheets files)
  while (files.hasNext()) {
    var batch = [];  // Temporary array to store details of files in the current batch

    // Add files to the current batch up to the specified batch size
    for (var i = 0; i < batchSize && files.hasNext(); i++) {
      var file = files.next();
      try {
        var fileName = file.getName();                // Get the file name
        var fileUrl = file.getUrl();                  // Get the file URL
        var owner = file.getOwner().getEmail();       // Get the owner's email address
        var editors = getEditors(file);               // Get a list of users who have edit access
        batch.push([fileName, owner, editors.join(', '), fileUrl]);  // Add file details to the batch
      } catch (error) {
        Logger.log("Error accessing file:", error);   // Log any error and continue to the next file
        continue;
      }
    }

    // Process the current batch asynchronously and store the promise
    promises.push(processBatch(sheet, batch));
    batchCount++;  // Increment batch count
  }

  Logger.log(batchCount + " batches will be processed.");  // Log the number of batches processed

  // Wait for all batch processing promises to resolve
  return Promise.all(promises);
}

// Function to get the emails of users who have edit access to the file
function getEditors(file) {
  var editors = [];
  var sharingAccess = file.getSharingAccess();

  // Check if the file is shared with anyone who has the link or publicly available
  if (sharingAccess === DriveApp.Access.ANYONE_WITH_LINK || sharingAccess === DriveApp.Access.ANYONE) {
    editors.push('Anyone with access');
  } else {
    // Get emails of individual editors if sharing is restricted
    var editorEmails = file.getEditors().map(function(editor) {
      return editor.getEmail();
    });
    editors = editorEmails;
  }
  return editors;  // Return the list of editor emails
}

// Function to process a batch of files and paste their details into the Google Sheet
function processBatch(sheet, batch) {
  return new Promise(function(resolve, reject) {
    try {
      // Get the first sheet within the newly created spreadsheet
      var targetSheet = sheet.getSheets()[0];

      // Append details of each file in the batch to the Google Sheet
      batch.forEach(function(detail) {
        targetSheet.appendRow(detail);  // Append each file's details to a new row
      });

      Logger.log("Batch processed successfully.");  // Log success message
      resolve();  // Resolve the promise when done
    } catch (error) {
      Logger.log("Error processing batch:", error);  // Log any error encountered
      reject(error);  // Reject the promise if there's an error
    }
  });
}

// Set the batch size for processing files (can be adjusted as needed)
var batchSize = 50;

// Run the file listing and batch processing function with the specified batch size
listGoogleSheetsFilesInBatches(batchSize);
