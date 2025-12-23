# TicketOps

TicketOps is an intelligent ticket management system that leverages AI to automate ticket assignment and classification. It uses a modern fullstack architecture with React, Express, and MongoDB, orchestrated by Inngest for background workflows.

## 🚀 Features

- **AI-Driven Assignment**: Automatically assign tickets to the most relevant developer using Google Gemini AI.
- **Workflow Automation**: Durable background tasks and event-driven architecture powered by Inngest.
- **Real-time Updates**: Track ticket status from creation to completion.
- **Developer Roles**: Dedicated views for creators and assigned developers.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, React Router, Axios
- **Backend**: Express.js, Node.js
- **Database**: MongoDB (Mongoose)
- **AI/Automation**: Google Gemini AI, Inngest
- **Emails**: Nodemailer

## 📦 Project Structure

- `/client`: React frontend application.
- `/TIcketOps`: Express backend and Inngest functions.

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- MongoDB instance (local or Atlas)
- Google Gemini API Key
- Inngest Dev Server

### Installation

1. Clone the repository.
2. Install dependencies for both backend and frontend:
   ```bash
   # Backend
   cd TIcketOps
   npm install

   # Frontend
   cd ../client
   npm install
   ```
3. Set up environment variables in both directories (refer to `.env` files).

### Running the App

1. **Start the Backend & Inngest**:
   ```bash
   cd TIcketOps
   npm run dev
   npm run inngest-dev
   ```
2. **Start the Frontend**:
   ```bash
   cd client
   npm run dev
   ```

## 📄 License

ISC License
