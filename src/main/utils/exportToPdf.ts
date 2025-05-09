import { app, BrowserWindow } from "electron";
import fs from 'fs'


export default function exportToPdf(savePath:string) {
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
            <th>ID</th>
            <th>Department</th>
            <th>Manager</th>
            <th>Efficiency (%)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>Logistics</td><td>Alex Morgan</td><td>88.3</td><td>Stable</td></tr>
          <tr><td>2</td><td>Engineering</td><td>Samantha Chen</td><td>92.1</td><td>Improving</td></tr>
          <tr><td>3</td><td>HR</td><td>James Lee</td><td>75.6</td><td>At Risk</td></tr>
          <tr><td>4</td><td>Sales</td><td>Emily Davis</td><td>98.2</td><td>Excellent</td></tr>
          <tr><td>5</td><td>Support</td><td>Michael Brown</td><td>84.9</td><td>Stable</td></tr>
          <tr><td>6</td><td>Finance</td><td>Linda White</td><td>79.4</td><td>Monitoring</td></tr>
          <tr><td>7</td><td>Marketing</td><td>John Smith</td><td>88.0</td><td>Stable</td></tr>
          <tr><td>8</td><td>Legal</td><td>Olivia Taylor</td><td>94.3</td><td>Excellent</td></tr>
          <tr><td>9</td><td>Procurement</td><td>Robert Johnson</td><td>83.5</td><td>Stable</td></tr>
          <tr><td>10</td><td>IT</td><td>Angela King</td><td>91.7</td><td>Improving</td></tr>
          <tr><td>11</td><td>QA</td><td>Chris Wilson</td><td>87.6</td><td>Stable</td></tr>
          <tr><td>12</td><td>Research</td><td>Jessica Hall</td><td>95.2</td><td>Excellent</td></tr>
          <tr><td>13</td><td>Compliance</td><td>David Clark</td><td>78.4</td><td>At Risk</td></tr>
          <tr><td>14</td><td>Operations</td><td>Nancy Lewis</td><td>90.3</td><td>Improving</td></tr>
          <tr><td>15</td><td>Admin</td><td>Brian Walker</td><td>76.8</td><td>Monitoring</td></tr>
          <tr><td>16</td><td>Security</td><td>Rachel Adams</td><td>85.9</td><td>Stable</td></tr>
          <tr><td>17</td><td>Training</td><td>Mark Robinson</td><td>80.6</td><td>Stable</td></tr>
          <tr><td>18</td><td>Innovation</td><td>Karen Martinez</td><td>96.4</td><td>Excellent</td></tr>
          <tr><td>19</td><td>Facilities</td><td>Thomas Harris</td><td>82.2</td><td>Stable</td></tr>
          <tr><td>20</td><td>Analytics</td><td>Laura Young</td><td>89.7</td><td>Stable</td></tr>
        </tbody>
      </table>
    
      <footer>
        © 2025 Synergex Global Solutions. Confidential Internal Use Only.
      </footer>
    </body>
    </html>
    
    `
    
    const win = new BrowserWindow({
      show: false,
      webPreferences: {
        offscreen: true
      }
    });
    
    win.loadURL('data:text/html;charset=UTF-8,' + encodeURIComponent(printHtml))
    
      win.webContents.on('did-finish-load', () => {
        // optional: delay for dynamic content
        setTimeout(() => {
          win.webContents.printToPDF({
            printBackground: true,
            pageSize: 'A4',
          }).then(data => {
            fs.mkdirSync(savePath, {recursive: true})
            fs.writeFileSync(`${savePath}/Farmers.pdf`, data);
            console.log('PDF generated');
            app.quit();
          }).catch(err => {
            console.error('Error generating PDF:', err);
            app.quit();
          });
        }, 300);
      });

}

