const fs = require("fs");
const path = require("path");
const pdf2md = require("@opendocsg/pdf2md");
const mammoth = require("mammoth");

const folderPath = "./input";
const outputPath = "./output";

/**
 * Move Input File to Processed
 * @param {*} filePath
 * @returns
 */
async function moveToProcessed(filePath) {
  const destination = filePath.replace("input/", "processed/");
  fs.renameSync(`./${filePath}`, `./${destination}`);
  return true;
}

/**
 * Converts a PDF filepath to Markdown
 * @param {*} filePath
 * @returns void
 */
async function convertPDFToMarkdown(filePath) {
  const pdfBuffer = fs.readFileSync(filePath);
  const mdContent = await pdf2md(pdfBuffer);
  const fileName = path.basename(filePath, ".pdf");
  const mdFilePath = path.join(outputPath, `${fileName}.md`);
  return fs.writeFileSync(mdFilePath, mdContent);
}

/**
 * Converts a WordDoc file path to Markdown
 * @param {*} filePath
 * returns Promise<void>
 */
function convertWordDocToMarkdown(filePath) {
  new Promise((resolve, reject) => {
    mammoth
      .extractRawText({ path: filePath })
      .then((result) => {
        const mdContent = result.value;
        const fileName = path.basename(filePath, ".docx");
        const mdFilePath = path.join(outputPath, `${fileName}.md`);

        fs.writeFileSync(mdFilePath, mdContent);
        resolve(true);
      })
      .catch((error) => {
        console.error("Error converting Word document to Markdown:", error);
        reject(error);
      });
  });
}

// Get the List of documents
const docs = fs.readdirSync(folderPath);

// If no documents output message
if (docs.length === 0) {
  console.log("⛔️ No Documents found in ./input");
} else {
  let converted = 0;

  // Loop over each doc
  docs.forEach(async (file) => {
    // Get the docs file path
    const filePath = path.join(folderPath, file);
    if (file.endsWith(".pdf")) {
      // Handle PDF
      converted = converted + 1;
      await convertPDFToMarkdown(filePath);
    } else if (file.endsWith(".docx") || file.endsWith(".doc")) {
      // Handle Doc
      converted = converted + 1;
      await convertWordDocToMarkdown(filePath);
    } else if (file.endsWith(".xlsx")) {
      // Convert Excel file to Markdown using a library like 'xlsx' or 'csvtojson'
    }
    await moveToProcessed(filePath);
  });

  console.log(`✅ Converted ${converted} out of ${docs.length} files`);
}
