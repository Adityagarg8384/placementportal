import { downloadpdf } from "@/lib/googleDrive";

export default async function POST(req, res) {
    try {
        const pdfid = req?.body?.pdfid;

        if (!pdfid) {
            return res.status(400).json({ message: "Pdfid not found" });
        }

        const responseStream = await downloadpdf(pdfid);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="resume${pdfid}.pdf"`);

        responseStream
            .on('end', () => {
                console.log('Download complete');
            })
            .on('error', (err) => {
                console.error('Error during download:', err);
                res.status(500).json({ message: 'Failed to download spreadsheet' });
            })
            .pipe(res);

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({message:"Error in downloading"});
    }
}