you need to create a file in the backend root directory called .env and write there the following information:
PORT=3000
API_KEY=
MONGO_URI=

open terminal and run:
cd backend
npm install
node server.js

if successful, you should see:
"server running on port 3000
MongoDB Connected"

you need to do the backend first before you run the front

now, open another terminal and run:
npm install
npm run dev

if the front is not working, run:
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
npm run dev


