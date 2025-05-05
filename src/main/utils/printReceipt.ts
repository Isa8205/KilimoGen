import {  BrowserWindow } from "electron";

function printReceipt({berryType, date,  time, weight, servedBy, farmerName, farmerNumber, seasonTotal}: any, printerName?: string) {
    printerName = "POS Printer 80250 Series";
  // Create a hidden window for printing.
  const printWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false, // Keep it hidden
    webPreferences: {
      contextIsolation: false,
    },
  });

  const receiptHTML = `
  <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      @page {
        margin: 0;
      }
      body {
        font-family: monospace;
        height: fit-content;
        width: 70mm;
        font-size: 12px;
        margin: 0;
        padding: 0;
      }
      .center {
        text-align: center;
      }
      .bold {
        font-weight: bold;
      }
      .line {
        border-top: 1px dashed #000;
        margin: 5px 0;
      }
      .row {
        display: flex;
        justify-content: space-between;
      }
    </style>
  </head>
  <body>
    <div class="center bold">OLMISMIS FCS</div>
    <div class="center">TIN: 123456789 | VAT: 987654321</div>
    <div class="center">Nairobi CBD - River Rd</div>
    <div class="line"></div>

    <div class="row"><span>Date:</span><span>${date}</span></div>
    <div class="row"><span>Time:</span><span>${time}</span></div>
    <div class="row"><span>Cashier:</span><span>${servedBy}</span></div>
    <div class="line"></div>

    <div class="row"><span>Farmer Name:</span><span>${farmerName}</span></div>
    <div class="row">
      <span>Farmer Number:</span><span id="farmer-number">${farmerNumber}</span>
    </div>
    <div class="row"><span>Berry Type:</span><span>${berryType}</span></div>
    <div class="row"><span>Weight</span><span>${weight} kgs</span></div>
    <div class="line"></div>

    <div class="row bold">
      <span>Season Total:</span><span>${seasonTotal}</span>
    </div>
    <div class="center">Powered by Kilimogen!</div>
  </body>

  <script>
    document.addEventListener("DOMContentLoaded", (e) => {
      const numberCont = document.getElementById('farmer-number')
      const farmerNumber = parseInt(numberCont.textContent)

      if (farmerNumber <= 9) {
        numberCont.textContent = 00${farmerNumber}
      } else if (farmerNumber >= 10 && farmerNumber <= 99) {
        numberCont.textContent = 0${farmerNumber}
      } else {
        numberCont.textContent = farmerNumber
      }
    })
  </script>
</html>
`;

  // Use a data URL to load the HTML content.
  printWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(receiptHTML)}`
  );

  // Wait until the content is fully loaded.
  printWindow.webContents.on("did-finish-load", () => {
    // Print the content with the specified printer.
    printWindow.webContents.print(
      {
        silent: true, // Silent printing—remove if you want the dialog.
        printBackground: true, // Include background graphics if needed.
        deviceName: printerName, // Pass your printer name here
      },
      (success, errorType) => {
        if (!success) {
          console.error("Print failed:", errorType);
        } else {
          console.log(`Printed successfully to ${printerName}`);
        }
        printWindow.close(); // Close the window after printing.
      }
    );
  });
}

export default printReceipt