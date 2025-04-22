const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const JSZip = require("jszip");


const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "../Frontend/public")));

// POST endpoint to save questions as JSON
app.post("/save-questions", (req, res) => {
  const questions = req.body;

  // Ensure target directory exists
  const dirPath = path.join(__dirname, "../Frontend/public/Resources");
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, "questions.json");

  fs.writeFile(filePath, JSON.stringify(questions, null, 2), (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return res.status(500).send("Error saving the file.");
    }
    res.status(200).send("File successfully saved!");
  });
});

// Multer setup for handling file uploads (for zip files)
const storage = multer.memoryStorage(); // Store uploaded file in memory
const upload = multer({ storage: storage });

// POST endpoint to upload and extract zip file
app.post("/upload-zip", upload.single("zipFile"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No zip file uploaded.");
  }

  const zip = new JSZip();
  try {
    const zipContent = await zip.loadAsync(req.file.buffer);

    const resourcesDir = path.join(__dirname, "../Frontend/public/Resources");

    // Ensure Resources directory exists
    if (!fs.existsSync(resourcesDir)) {
      fs.mkdirSync(resourcesDir, { recursive: true });
    }

    const savePromises = [];

    zip.forEach((relativePath, file) => {
      if (file.dir) return; // Skip folders
    
      let targetDir = "";
    
      if (file.name.toLowerCase().startsWith("img/")) {
        targetDir = path.join(resourcesDir, "Img");
      } else if (file.name.toLowerCase().startsWith("video/")) {
        targetDir = path.join(resourcesDir, "video");
      }
      
    
      if (targetDir) {
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
    
        const filePath = path.join(targetDir, path.basename(file.name));
    
        const promise = file.async("nodebuffer").then((content) => {
          fs.writeFileSync(filePath, content);
          if (targetDir.includes("Img")) {
            console.log(`🖼️ Image saved: ${filePath}`);
          } else if (targetDir.includes("video")) {
            console.log(`🎬 Video saved: ${filePath}`);
          }
        });
    
        savePromises.push(promise);
      }
    });
    

    await Promise.all(savePromises);

    res.status(200).send("Files successfully uploaded and saved.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing zip file.");
  }
});


// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
