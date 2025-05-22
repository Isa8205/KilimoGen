import { app, BrowserWindow } from "electron";
import fs from "fs";

let response: {passed: boolean, message: string} | any = {};
export default function exportToPdf(savePath: string, data: any, fileName: string) {
  const printHtml = `
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

    .status-active {
      background-color: #d1fae5;
      color: #065f46;
    }

    .status-inactive {
      background-color: #fee2e2;
      color: #b91c1c;
    }

    .status-pending {
      background-color: #fef3c7;
      color: #92400e;
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
        margin: 20mm;
        background-color: white;
      }

      table {
        box-shadow: none;
      }

      @page {
        size: A4;
        margin: 20mm;
      }
    }
  </style>
</head>
<body>
  <div class="logo-container">
    <img src="https://picsum.photos/seed/logo/120/120" alt="Company Logo">
  </div>

  <div class="title-container">
    <h1>Farmers Delivery Report</h1>
  </div>

  <div class="company-details">
    Kilimogen Agricultural Cooperative<br>
    1234 Harvest Road, Suite 400<br>
    Nairobi, Kenya<br>
    +254 712 345 678<br>
    <small>Report generated on May 21, 2025</small>
  </div>

  <p class="subtext">
    Below is a detailed overview of farmer deliveries for the current season. Please review and reach out to the Agricultural Office with any discrepancies or inquiries.
  </p>

  <table>
    <thead>
      <tr>
        <th>NO.</th>
        <th>Full Name</th>
        <th>Farmer No.</th>
        <th>Deliveries (Kgs)</th>
        <th>Phone</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>John Doe</td>
        <td>F-001</td>
        <td>1,250</td>
        <td>0712345678</td>
        <td><span class="status-badge status-active">Active</span></td>
      </tr>
      <tr>
        <td>2</td>
        <td>Jane Smith</td>
        <td>F-002</td>
        <td>980</td>
        <td>0723456789</td>
        <td><span class="status-badge status-active">Active</span></td>
      </tr>
      <tr>
        <td>3</td>
        <td>Robert Johnson</td>
        <td>F-003</td>
        <td>1,540</td>
        <td>0734567890</td>
        <td><span class="status-badge status-active">Active</span></td>
      </tr>
      <tr>
        <td>4</td>
        <td>Emily Davis</td>
        <td>F-004</td>
        <td>0</td>
        <td>0745678901</td>
        <td><span class="status-badge status-inactive">Inactive</span></td>
      </tr>
      <tr>
        <td>5</td>
        <td>Michael Wilson</td>
        <td>F-005</td>
        <td>2,300</td>
        <td>0756789012</td>
        <td><span class="status-badge status-active">Active</span></td>
      </tr>
      <tr>
        <td>6</td>
        <td>Sarah Brown</td>
        <td>F-006</td>
        <td>1,120</td>
        <td>0767890123</td>
        <td><span class="status-badge status-active">Active</span></td>
      </tr>
      <tr>
        <td>7</td>
        <td>David Miller</td>
        <td>F-007</td>
        <td>750</td>
        <td>0778901234</td>
        <td><span class="status-badge status-active">Active</span></td>
      </tr>
      <tr>
        <td>8</td>
        <td>Jennifer Taylor</td>
        <td>F-008</td>
        <td>1,870</td>
        <td>0789012345</td>
        <td><span class="status-badge status-active">Active</span></td>
      </tr>
      <tr>
        <td>9</td>
        <td>James Anderson</td>
        <td>F-009</td>
        <td>0</td>
        <td>0790123456</td>
        <td><span class="status-badge status-inactive">Inactive</span></td>
      </tr>
      <tr>
        <td>10</td>
        <td>Patricia Thomas</td>
        <td>F-010</td>
        <td>920</td>
        <td>0701234567</td>
        <td><span class="status-badge status-pending">Pending</span></td>
      </tr>
    </tbody>
  </table>

  <footer>
    © 2025 Kilimogen Agricultural Cooperative. Confidential Internal Use Only.
  </footer>
</body>
</html>
  `

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
