**as it requires server-side storage for saving files (like images, videos, and JSON),
 and Vercel's serverless environment does not support persistent file storage.**

I have uploaded the full source code to GitHub, which you can easily install and run locally.
The project is divided into two parts:

Backend: Built with Node.js and Express.js, handling API endpoints, file uploads (via multer), and saving JSON, images, and videos. please find the here : https://github.com/Hauntedwolf2000/Daily_Quest_Backend.git

The backend also includes a Resources folder where all uploaded images (Img) and videos (Video) are saved, which are later rendered in the "Attend Test" page.


Frontend: A React app for uploading Excel sheets, converting them into JSON format, and managing uploaded resources. please find the link here: https://github.com/Hauntedwolf2000/Daily_Quest.git

🔧 Installation Steps:
Clone the Repository

git clone [repo-link]
cd [repo-name]


Install Backend Dependencies

cd Backend
npm install


Start the Backend Server
node server.js
(Server will run on http://localhost:5000)


Clone and Install Frontend Dependencies

git clone [repo-link]
cd [repo-name]

cd ../Frontend
npm install

Start the Frontend React App

npm start
(App will run on http://localhost:3000) 
