import { GoogleGenerativeAI } from "@google/generative-ai";
import { Employee, Task, Project } from "./zoho";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getResourceRecommendations(task: Task, employees: Employee[]) {
  const prompt = `
    You are an AI resource allocation engine.
    
    Task: "${task.name}"
    Deadline: ${task.deadline}
    Required Skills: ${task.requiredSkills.join(", ")}
    
    Employees:
    ${employees.map(e => `- ${e.name}: Skills [${e.skills.join(", ")}], Current Load: ${e.currentLoad}%, Past Performance: ${e.pastPerformance}%`).join("\n")}
    
    Scoring formula:
    Score = 0.4×SkillMatch + 0.3×Availability + 0.2×PastPerformance + 0.1×DeadlineCompatibility
    
    Return JSON ONLY in this format:
    {
      "recommendations": [
        { "name": "Employee Name", "score": 92, "reason": "Reason for recommendation" }
      ]
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (e) {
    console.error("Failed to parse Gemini response", text);
    return { recommendations: [] };
  }
}

export async function analyzeWorkload(employees: Employee[], tasks: Task[]) {
  const prompt = `
    Analyze this team workload and suggest reassignments to balance the load.
    
    Team Data:
    ${employees.map(e => `- ${e.name}: Current Load: ${e.currentLoad}%, Skills: [${e.skills.join(", ")}]`).join("\n")}
    
    Tasks:
    ${tasks.map(t => `- ${t.name} (Project: ${t.project}, Skills: [${t.requiredSkills.join(", ")}])`).join("\n")}
    
    Return which tasks should move from whom to whom, and why. Use a concise professional tone.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function predictDelayRisks(projects: Project[], tasks: Task[], employees: Employee[]) {
  const prompt = `
    Given these tasks, deadlines, and resource loads, predict delay probability for each project (0–100%). Explain the top risk factors.
    
    Projects: ${JSON.stringify(projects)}
    Tasks: ${JSON.stringify(tasks)}
    Employees: ${JSON.stringify(employees)}
    
    Return JSON ONLY in this format:
    {
      "risks": [
        { "project": "Project Name", "delay_probability": 78, "reason": "Specific risk factor description" }
      ]
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (e) {
    console.error("Failed to parse Gemini response", text);
    return { risks: [] };
  }
}

export async function startAIChat(history: any[]) {
  const chat = model.startChat({
    history: history,
  });
  return chat;
}

export async function sendMessageToChat(message: string, history: any[]) {
  try {
    const chat = model.startChat({
      history: history.map(m => ({
        role: m.role === 'bot' ? 'model' : 'user',
        parts: [{ text: m.text }],
      })),
      systemInstruction: "You are the AI Resource Allocation Assistant. You help users manage employees, tasks, and project risks. Use the context of the team: Alex Brown (UI/UX), Mike Johnson (Backend), Sarah Wilson (DevOps), David Chen (Frontend), Emily Davis (QA). Be concise and professional.",
    });
    
    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();
    
    return text || "I'm sorry, I couldn't generate a response. Please try rephrasing.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "The AI is currently unavailable. Please check your API key or try again later.";
  }
}
