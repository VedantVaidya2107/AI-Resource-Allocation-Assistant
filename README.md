# AI Resource Allocation Assistant

A premium full-stack web application that uses Google Gemini AI to automatically assign the right employees to the right tasks based on skills, workload, and availability.

## Features

- **Team Heatmap:** Visual representation of team workload (Red / Yellow / Green).
- **AI Task Assignment:** Gemini-powered resource recommendations with scoring logic.
- **Workload Balancer:** AI-driven reassignment suggestions to optimize team capacity.
- **Delay Risk Panel:** Predictive analytics for project deadlines.
- **AI Chat Sidebar:** Multi-turn conversational interface for manager queries.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Framer Motion
- **AI Layer:** Google Gemini API (`gemini-2.0-flash`)
- **Icons:** Lucide React

## Setup Instructions

1. **Navigate to the project directory:**
   ```bash
   cd "d:\Fristine\AI Resource Allocation Assistant"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Open `.env.local` and add your [Google Gemini API Key](https://aistudio.google.com/app/apikey).
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Access the app:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## AI Scoring Logic

The recommendation engine uses the following weighted formula:
- **40%** Skill Match
- **30%** Availability
- **20%** Past Performance
- **10%** Deadline Compatibility
