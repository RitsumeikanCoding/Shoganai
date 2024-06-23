const fs = require('fs'); // Module for working with file system
const { google } = require('googleapis'); // Google APIs Node.js client library

// Import necessary Google Calendar API components
const { OAuth2Client } = require('google-auth-library');
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// Function to load credentials from token.json file
async function getCredentials() {
    let creds = null;
    // Check if the file 'CREDENTIALS/token.json' exists
    if (fs.existsSync('CREDENTIALS/token.json')) {
        // Load credentials from the file if it exists
        const content = fs.readFileSync('CREDENTIALS/token.json');
        creds = JSON.parse(content);
    }

    // Check if credentials do not exist or are invalid
    if (!creds || !creds.valid) {
        // Create a new OAuth2Client for handling OAuth 2.0 authentication
        const { client_secret, client_id, redirect_uris } = creds.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id,
            client_secret,
            redirect_uris[0]
        );

        // Generate URL for consent page
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this URL:', authUrl);

        // Handle the token retrieval from user input (in a real application, this would be automated)
        const code = 'ENTER_THE_CODE_FROM_AUTH_URL_HERE'; // Replace with the code obtained from the authorization URL
        const { tokens } = await oAuth2Client.getToken(code);
        
        // Store token to disk
        fs.writeFileSync('CREDENTIALS/token.json', JSON.stringify(tokens));
        creds = tokens;
    }

    return creds;
}

// Initialize Google Calendar API
async function main() {
    try {
        const creds = await getCredentials();

        const calendar = google.calendar({ version: 'v3', auth: creds });

        // List all calendars
        console.log('Fetching all calendars:');
        const { data: { items: calendars } } = await calendar.calendarList.list();
        calendars.forEach(cal => console.log(cal.summary));

        // Create a new calendar
        const newCalendar = {
            summary: 'New Semester Calendar',
            timeZone: 'Asia/Tokyo'
        };
        const createdCalendar = await calendar.calendars.insert({ resource: newCalendar });
        console.log(`Created calendar: ${createdCalendar.data.id}`);
    } catch (err) {
        console.error('Error:', err);
    }
}

// Call the main function to start the program
main();