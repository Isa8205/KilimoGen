import { BrowserWindow, app } from "electron";
import * as fs from "fs";
import * as path from "path";
import { once } from "events"; // This import is not used in the provided code, can be removed.
import { AppDataSource } from "@/main/database/src/data-source";
import { Report } from "@/main/database/src/entities/Report";

type GradeEntry = {
  fullName: string;
  farmerNo: string;
  grade: string;
  quantity: number;
};

export default async function generateDeliveryReport(
  data: { cherryGrade: GradeEntry[]; mbuniGrade: GradeEntry[] },
  reportTitle: string
): Promise<boolean> {

  const reportsRepository = AppDataSource.getRepository(Report);

  // Sanitize the report title for use as a filename
  const sanitizedReportTitle = reportTitle.replace(/[^a-zA-Z0-9-_.]/g, '_');
  const reportsDir = path.join(app.getPath("userData"), 'docs', 'reports');
  const filePath = path.join(reportsDir, `${sanitizedReportTitle}.pdf`);

  // Ensure the directory exists
  try {
    await fs.promises.mkdir(reportsDir, { recursive: true });
  } catch (dirError) {
    console.error(`Failed to create directory ${reportsDir}:`, dirError);
    return false; // Cannot proceed if directory cannot be created
  }

  const reportTemplate = `
    <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Farmers Report</title>
    <style>
      /* Base styles */
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 40px;
        color: #6A6D69;
        background-color: #EFEDE7;
      }
  
      /* Logo and header styles */
      .logo-container {
        text-align: center;
        margin-bottom: 10px;
      }
  
      .logo-container img {
        height: 90px;
        border-radius: 8px;
        border: 2px solid #F65A11;
      }
  
      .title-container {
        text-align: center;
        margin-top: 10px;
        margin-bottom: 30px;
      }
  
      .title-container h1 {
        font-size: 28px;
        margin-bottom: 5px;
        color: #22331D;
        border-bottom: 2px solid #F65A11;
        padding-bottom: 10px;
        display: inline-block;
      }
  
      .company-details {
        font-size: 14px;
        line-height: 1.5;
        text-align: center;
        color: #6A6D69;
      }
  
      .subtext {
        font-size: 14px;
        color: #6A6D69;
        margin-top: 20px;
        text-align: center;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
      }
  
      /* Table styles */
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 30px;
        background-color: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        overflow: hidden;
      }
  
      th, td {
        padding: 12px 15px;
        text-align: left;
      }
  
      th {
        background-color: #6A6D69;
        color: white;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 14px;
        letter-spacing: 0.5px;
      }
  
      tr {
        border-bottom: 1px solid #EFEDE7;
      }
  
      tr:last-child {
        border-bottom: none;
      }
  
      tr:nth-child(even) {
        background-color: #EFEDE7;
      }
  
      /* Status badge styles */
      .status-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        text-align: center;
      }
  
      .sub-total {
        background-color: #6C7181;
        color: white;
      }
  
      .grand-total {
        background-color: #6A6D69;
        color: white;
      }
  
      /* Footer styles */
      footer {
        margin-top: 40px;
        font-size: 12px;
        color: #6A6D69;
        text-align: center;
        padding-top: 20px;
        border-top: 1px solid #6A6D69;
      }
  
      /* Print optimization */
      @media print {
        body {
          margin: 10mm;
          background-color: white;
        }
  
        table {
          box-shadow: none;
        }
  
        @page {
          size: A4;
          margin: 10mm;
        }
      }
    </style>
  </head>
  <body>
  
    <div class="title-container">
      <h1>${reportTitle}</h1>
    </div>
  
    <table>
      <thead>
        <tr>
          <th>NO.</th>
          <th>Full Name</th>
          <th>Farmer No.</th>
          <th>Grade</th>
          <th>Quantity</th>
        </tr>
      </thead>
      ${
        data.cherryGrade.length > 0
          ? `
      <tbody>
        ${data.cherryGrade
          .map(
            (item: GradeEntry, index: number) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.fullName}</td>
            <td>${item.farmerNo}</td>
            <td>${item.grade}</td>
            <td>${item.quantity} kg</td>
          </tr>
        `
          )
          .join("")}
  
          <tr class="sub-total">
            <td colspan="4" style="text-align: right;">Sub Total:  </td>
            <td>${(data.cherryGrade || []).reduce(
              (acc: number, item: GradeEntry) => acc + item.quantity,
              0
            )} kg</td>
          </tr>
      </tbody>
      `
          : ""
      }
  
    ${
      data.mbuniGrade.length > 0
        ? `
      <tbody>
        ${data.mbuniGrade
          .map(
            (item: GradeEntry, index: number) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.fullName}</td>
            <td>${item.farmerNo}</td>
            <td>${item.grade}</td>
            <td>${item.quantity} kg</td>
          </tr>
        `
          )
          .join("")}
  
          <tr class="sub-total">
            <td colspan="4" style="text-align: right;">Sub Total:  </td>
            <td>${(data.mbuniGrade || []).reduce(
              (acc: number, item: GradeEntry) => acc + item.quantity,
              0
            )} kg</td>
          </tr>
      </tbody>
      `
        : ""
    }
      
      <tfoot>
        <tr class="grand-total">
          <td colspan="4" style="text-align: right;"><b>Grand Total:  </b></td>
          <td>${
            (data.cherryGrade || []).reduce(
              (acc: number, item: GradeEntry) => acc + item.quantity,
              0
            ) +
            (data.mbuniGrade || []).reduce(
              (acc: number, item: GradeEntry) => acc + item.quantity,
              0
            )
          } kg</td>
        </tr>
      </tfoot>
    </table>
    
    <footer>
      © 2025 Kilimogen Agricultural Cooperative. Confidential Internal Use Only.
    </footer>
  </body>
  </html>
  `

  const window = new BrowserWindow({
    show: false,
    webPreferences: {
      contextIsolation: true,
      // Consider adding sandbox: true for even stronger security if not interacting with Node.js APIs directly in the renderer
      // nodeIntegration: false, // Ensure this is false for security reasons
    },
  });

  // Load the HTML content as a data URL
  window.loadURL(
    "data:text/html;charset=utf-8," + encodeURIComponent(reportTemplate)
  );

  return new Promise((resolve) => {
    const cleanup = () => {
      if (!window.isDestroyed()) {
        window.close();
      }
    };

    // Set a timeout to prevent the promise from hanging indefinitely
    const loadTimeout = setTimeout(() => {
      console.error("BrowserWindow failed to load content within 30 seconds.");
      cleanup();
      resolve(false);
    }, 30000); // 30 seconds timeout

    window.webContents.on("did-finish-load", async () => {
      clearTimeout(loadTimeout); // Clear the timeout if load finishes
      try {
        const pdfBuffer = await window.webContents.printToPDF({
          printBackground: true,
          pageSize: "A4",
        });

        // Write the PDF file
        await fs.promises.writeFile(filePath, pdfBuffer);

        // Save to the database
        const report = new Report();
        report.reportName = reportTitle; // Use original reportTitle for database
        report.dateGenerated = new Date();
        report.filePath = filePath;
        await reportsRepository.save(report);

        cleanup();
        resolve(true);
      } catch (error) {
        console.error("Failed to generate PDF or save report:", error);
        cleanup();
        resolve(false);
      }
    });

    // Handle potential loading errors
    window.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
      clearTimeout(loadTimeout);
      console.error(`BrowserWindow failed to load: [${errorCode}] ${errorDescription}`);
      cleanup();
      resolve(false);
    });

    // Handle renderer process crashes
    window.webContents.on('render-process-gone', (event, details) => {
      clearTimeout(loadTimeout);
      console.error(`Renderer process for report window crashed: ${details.reason}`);
      cleanup();
      resolve(false);
    });
  });
}
