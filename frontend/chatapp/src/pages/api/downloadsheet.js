import { downloadspreadsheet } from "@/lib/spreadsheet";

export default async function POST(req, res) {
  try {
    const spreadsheetId = req?.body?.spreadsheetid;

    if (!spreadsheetId) {
      return res.status(400).json({ message: "Spreadsheet ID is required" });
    }

    const responseStream = await downloadspreadsheet(spreadsheetId);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="spreadsheet.csv"`);

    responseStream
      .on('end', () => {
        console.log('Download complete');
      })
      .on('error', (err) => {
        console.error('Error during download:', err);
        res.status(500).json({ message: 'Failed to download spreadsheet' });
      })
      .pipe(res);  

  } catch (err) {
    console.error('Error in POST handler:', err);
    return res.status(500).json({ message: "Some error occurred" });
  }
}
