const fs = require('fs');
const path = require('path');
const pdf2md = require('@opendocsg/pdf2md');
const mammoth = require('mammoth');

const folderPath = "./input";
const outputPath = "./output"

async function convertPDFToMarkdown(filePath) {
  const pdfBuffer = fs.readFileSync(filePath);
  const mdContent = await pdf2md(pdfBuffer);
  const fileName = path.basename(filePath, '.pdf');
  const mdFilePath = path.join(outputPath, `${fileName}.md`);
  fs.writeFileSync(mdFilePath, mdContent);
}

function convertWordDocToMarkdown(filePath) {
  mammoth.extractRawText({ path: filePath })
    .then((result) => {
      const mdContent = result.value;
      const fileName = path.basename(filePath, '.docx');
      const mdFilePath = path.join(outputPath, `${fileName}.md`);
      
      fs.writeFileSync(mdFilePath, mdContent);
    })
    .catch((error) => {
      console.error('Error converting Word document to Markdown:', error);
    });
}

fs.readdirSync(folderPath).forEach(async (file) => {
  const filePath = path.join(folderPath, file);

  if (file.endsWith('.pdf')) {
    await convertPDFToMarkdown(filePath);
  } else if (file.endsWith('.docx')) {
    await convertWordDocToMarkdown(filePath);
  } else if (file.endsWith('.xlsx')) {
    // Convert Excel file to Markdown using a library like 'xlsx' or 'csvtojson'
  }
});
