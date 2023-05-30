# Start backend
Set-Location -Path ".\backend"
npm run dev:container:rebuild -- -d

# Start frontend
Set-Location -Path "..\frontend"
npm install
npm start