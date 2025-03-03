open terminal and run:
cd backend
node server.js

if successful, you should see:
"server running on port 3000
MongoDB Connected"

now, open another terminal and run:
npm run dev

if the front is not working, run:
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
npm run dev