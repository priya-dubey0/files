import fs from 'fs';

/**
 * Downloads a PDF file from the specified URL and saves it to the specified file path.
 *
 * @param {string} pdfUrl - The URL of the PDF file to download.
 * @param {string} filePath - The local directory path where the downloaded PDF will be saved.
 * @param {string} fileName - The filename to be used for the saved PDF.
 * @returns {Promise<string>} A Promise that resolves with a success message if the download is successful,
 *                            or an error message if anything goes wrong.
 */
export const downloadHelper = async (pdfUrl = "", filePath = "", fileName = "") => {
  try {
      const pdfResponse = await fetch(pdfUrl);

      if (!pdfResponse.ok) {
          throw new Error(
              `Failed to download PDF. HTTP status: ${pdfResponse.status}`
          );
      }

      const pdfBuffer = await pdfResponse.arrayBuffer();
      const binaryPdf = Buffer.from(pdfBuffer);

      // Ensure filePath ends with a slash
      const modifiedFilePath = filePath.endsWith('/') ? filePath : `${filePath}/`;

      // Save the PDF file with the specified filename in the specified directory
      fs.writeFileSync(`${modifiedFilePath}${fileName}`, binaryPdf, "binary");
      // console.log("PDF download successful.");
      return;
  } catch (error) {
      console.log(`Error downloading PDF: ${error.message} url: ${pdfUrl}`);
      return;
  }
};

/**
 * Generates a SHA-256 hash for the given message.
 *
 * @param {string} message - The message for which the hash needs to be generated.
 * @returns {Promise<string>} A Promise that resolves with the generated SHA-256 hash (truncated to the first 8 characters).
 */
export const hashGenerator = async (message = "") => {
  const completeHash = Array.prototype.map
    .call(
      new Uint8Array(
        await crypto.subtle.digest("SHA-256", new TextEncoder().encode(message))
      ),
      (x) => ("0" + x.toString(16)).slice(-2)
    )
    .join("");
  return completeHash.substring(0, 8);
};


/**
 * Generates a unique filename based on the provided PDF URL.
 *
 * @param {string} pdfUrl - The URL of the PDF file.
 * @returns {Promise<string>} A Promise that resolves with the generated unique filename.
 */
export const fileNameGenerator = async (pdfUrl = "") => {
  // Extract the filename from the URL
  const pdfArray = pdfUrl.split("/");
  const fileName = pdfArray[pdfArray.length - 1].replace(".pdf", "");

  // Generate a hash for the filename
  const generatedHash = await hashGenerator(fileName);

  // Combine the filename and hash to create a unique filename
  const uniqueFileName = `${fileName}-${generatedHash}.pdf`;

  return uniqueFileName;
};

/**
 * Pauses the execution for the specified duration.
 *
 * @param {number} ms - The duration to wait in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the specified duration.
 */
export const waitForMe = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
