import { spread } from "axios";
import { google } from "googleapis";
import stream from "stream";

// const CLIENTID = process.env.CLIENTID
// const CLIENTSECRET = process.env.CLIENTSECRET
// const REDIRECTURL = process.env.REDIRECTURL
// const REFRESHTOKEN = process.env.REFRESHTOKEN

// const oauth2Client = new google.auth.OAuth2(
//     CLIENTID,
//     CLIENTSECRET,
//     REDIRECTURL,
// )

// oauth2Client.setCredentials({ refresh_token: REFRESHTOKEN })

// const KEYFILEPATH = "tnpportal-65864e4ee570.json"; // Path to your JSON key file
const KEYFILEPATH= process.env.KEYFILEPATH
const SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file"
  ];
  

export const createspreadsheet = async (title) => {
    try {
        const auth = new google.auth.GoogleAuth({
                        keyFile: KEYFILEPATH,
                        scopes: SCOPES,
                    });
        
        const drive = google.drive({ version: "v3", auth });
        const sheets = google.sheets({ version: 'v4', auth });
        // const drive = google.drive({ version: 'v3', auth: oauth2Client });

        // Create a new spreadsheet
        const createspreadsheet = await sheets.spreadsheets.create({
            resource: {
                properties: {
                    title: `Spreadsheet_${title}_${new Date().toISOString()}`,
                }
            }
        });

        const newSpreadsheetId = createspreadsheet.data.spreadsheetId;

        // Define the column titles
        const columnTitles = [
            'User ID',
            'FullName',
            'DOB',
            'Age',
            'College Name',
            'Degree',
            'Gender',
            'Emailid',
            'PhoneNumber',
            'Sem1CGPA',
            'Sem2CGPA',
            'Sem3CGPA',
            'Sem4CGPA',
            'Sem5CGPA',
            'Sem6CGPA',
            'Sem7CGPA',
            'Sem8CGPA',
            'Resume',
        ];

        // Append column titles to the new spreadsheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: newSpreadsheetId,
            range: 'Sheet1!A1',
            valueInputOption: 'RAW',
            resource: {
                values: [
                    columnTitles
                ]
            }
        });

        // Set the permission to make the spreadsheet viewable by anyone
        await drive.permissions.create({
            resource: {
                role: 'reader',
                type: 'anyone',
            },
            fileId: newSpreadsheetId,
            fields: 'id',
        });

        return newSpreadsheetId;

    } catch (err) {
        console.log(err);
        return 404;
    }
}


export const addspreadsheet = async (id, data) => {
    try {

        const auth = new google.auth.GoogleAuth({
            keyFile: KEYFILEPATH,
            scopes: SCOPES,
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const b= `https://drive.google.com/file/d/${data?.pdfid}`
        // data?.pdfid= 

        // const sheets = google.sheets({ version: 'v4', auth: oauth2Client, params: { "key": process.env.CLOUDAPIKEY } });
        console.log(sheets);
        await sheets.spreadsheets.values.append({
            spreadsheetId: id,
            range: 'Sheet1!A1',
            valueInputOption: 'RAW',
            resource: {
                values: [

                    [data?._id, data?.fullname, data?.dob, data?.Age, data?.collegename, data?.degree, data?.gender, data?.emailid,
                    data?.phonenumber, data?.sem1cgpa, data?.sem2cgpa, data?.sem3cgpa, data?.sem4cgpa, data?.sem5cgpa, 
                    data?.sem6cgpa, data?.sem7cgpa, data?.sem8cgpa, b],
                ],
            },
        })
        return 200;
    }
    catch (err) {
        console.log(err);
        return 404;
    }

}

export const deletespreadsheet = async (spreadsheetid, userid) => {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: KEYFILEPATH,
            scopes: SCOPES,
        });

        const drive = google.drive({ version: "v3", auth });
        const sheets = google.sheets({ version: 'v4', auth });
        // const sheets = google.sheets({ version: 'v4', auth: oauth2Client, params: { "key": process.env.CLOUDAPIKEY } });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetid,
            range: 'Sheet1!A2:Z',
        })
        const rows = response?.data?.values;

        if (rows.length) {
            let rowindex = -1;

            for (let i = 0; i < rows.length; i++) {
                if (rows[i][0] == userid) {
                    rowindex = i + 2;
                    break;
                }
            }

            if (rowindex !== -1) {
                await sheets.spreadsheets.values.clear({
                    spreadsheetId: spreadsheetid,
                    range: `Sheet1!A${rowindex}:Z${rowindex}`
                });
                return 200;
            }
            else {
                return 404;
            }
        }
    }
    catch (err) {
        console.log(err);
        return 404;
    }
}

export const downloadspreadsheet = async (spreadsheetId) => {
    try {
        // Initialize the Google Drive API client
        const auth = new google.auth.GoogleAuth({
            keyFile: KEYFILEPATH,
            scopes: SCOPES,
        });

        const drive = google.drive({ version: "v3", auth });
        const sheets = google.sheets({ version: 'v4', auth });
        // const drive = google.drive({ version: 'v3', auth: oauth2Client });

        // Export the spreadsheet in CSV format
        const response = await drive.files.export(
            {
                fileId: spreadsheetId,
                mimeType: 'text/csv',  // Export as CSV
            },
            { responseType: 'stream' }  // Return the data as a stream
        );

        // Return the response stream
        return response?.data;  // This is the stream you will pipe in the API route

    } catch (err) {
        console.error('Error downloading spreadsheet:', err);
        throw err;  // Handle the error in the API route
    }
};
