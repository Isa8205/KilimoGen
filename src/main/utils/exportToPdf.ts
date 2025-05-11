import { Farmer } from "@/main/database/src/entities/Farmer";
import { app, BrowserWindow } from "electron";
import fs from "fs";

let response: {passed: boolean, message: string} | any = {};
export default function exportToPdf(savePath: string, data: Farmer[], fileName: string) {
  const printHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Q2 Operational Report</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 40px;
          color: #333;
          background-color: #f9f9f9;
        }
    
        .logo-container {
          text-align: center;
          margin-bottom: 10px;
        }
    
        .logo-container img {
          height: 90px;
          border-radius: 8px;
        }
    
        .title-container {
          text-align: center;
          margin-top: 10px;
          margin-bottom: 30px;
        }
    
        .title-container h1 {
          font-size: 28px;
          margin-bottom: 5px;
          color: #222;
        }
    
        .company-details {
          font-size: 14px;
          line-height: 1.5;
          text-align: center;
          color: #555;
        }
    
        .subtext {
          font-size: 14px;
          color: #666;
          margin-top: 20px;
          text-align: center;
        }
    
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 30px;
          background-color: #fff;
        }
    
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
    
        th {
          background-color: #f2f2f2;
        }
    
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
    
        footer {
          margin-top: 40px;
          font-size: 12px;
          color: #aaa;
          text-align: center;
        }
    
        @media print {
          body {
            margin: 20mm;
            background-color: #fff;
          }
        }
      </style>
    </head>
    <body>
    
      <div class="logo-container">
        <img src="https://picsum.photos/seed/logo/120/120" alt="Company Logo">
      </div>
    
      <div class="title-container">
        <h1>Q2 Operational Efficiency Report</h1>
      </div>
    
      <div class="company-details">
        Synergex Global Solutions<br>
        1234 Innovation Blvd, Suite 400<br>
        Metropolis, CA 90210<br>
        +1 (555) 123-4567<br>
        <small>Report generated on May 9, 2025</small>
      </div>
    
      <p class="subtext">
        Below is a detailed overview of department-level performance metrics for Q2. Please review and reach out to the Strategy Office with any discrepancies or inquiries.
      </p>
    
      <table>
        <thead>
          <tr>
            <th>NO.</th>
            <th>Full Name</th>
            <th>Deliveries (Kgs)</th>
            <th>Phone</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
        ${data.map((farmer, idx) => `        
          <tr><td>${idx + 1}</td><td>${farmer.firstName} ${farmer.lastName}</td><td>${farmer.totalDeliveries}</td><td>${farmer.phone}</td><td>Active</td></tr>
        )`)}
        </tbody>
      </table>
    
      <footer>
        © 2025 Synergex Global Solutions. Confidential Internal Use Only.
      </footer>
    </body>
    </html>
    
    `;

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      contextIsolation: false,
    },
  });

  win.loadURL("data:text/html;charset=UTF-8," + encodeURIComponent(printHtml));

  win.webContents.on("did-finish-load", () => {
      win.webContents
        .printToPDF({
          printBackground: true,
          pageSize: "A4",
        })
        .then((data) => {
          fs.mkdirSync(savePath, { recursive: true });
          fs.writeFileSync(`${savePath}/${fileName}.pdf`, data);
          response.passed = true
          response.message = `File saved in ${savePath}`
        })
        .catch((err) => {
          console.error("Error generating PDF:", err);
          response.passed = false
          response.message = `Failed to save file. Try again!`
        })
  });

  return response
}
