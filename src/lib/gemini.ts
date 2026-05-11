import { GoogleGenerativeAI } from "@google/generative-ai";
import { Employee, Task, Project } from "./zoho";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }, { apiVersion: "v1" });

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

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const data = JSON.parse(text.replace(/```json|```/g, "").trim());
    if (data.recommendations && data.recommendations.length > 0) return data;
  } catch (error) {
    console.error("Gemini AI recommendation failed, using local fallback:", error);
  }

  // Local Fallback Logic (Skill-based matching)
  const fallbackRecs = employees.map(emp => {
    const skillOverlap = emp.skills.filter(s => task.requiredSkills.includes(s)).length;
    const skillScore = (skillOverlap / Math.max(task.requiredSkills.length, 1)) * 100;
    const availabilityScore = 100 - emp.currentLoad;
    const totalScore = Math.round((skillScore * 0.6) + (availabilityScore * 0.4));
    
    return {
      name: emp.name,
      score: totalScore,
      reason: `Local Match: ${skillOverlap} skill overlap found. Bandwidth available: ${availabilityScore}%.`
    };
  }).sort((a, b) => b.score - a.score).slice(0, 3);

  return { recommendations: fallbackRecs };
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
      systemInstruction: `You are the AI Resource Allocation Assistant. 
You help users manage employees, tasks, and project risks.
Context: Alex Brown (UI/UX), Mike Johnson (Backend), Sarah Wilson (DevOps), David Chen (Frontend), Emily Davis (QA).

CAPABILITIES:
1. Retrieval: Info about team and projects.
2. Actions: Create tasks, update status, reassign.

RESPONSE FORMAT:
Always return a JSON object:
{
  "message": "Text response",
  "intent": "query" | "action",
  "action": "create_task" | "update_status" | "reassign_task" | null,
  "data": { ... } // action payload
}

ACTION SCHEMAS:
- create_task: { "name": string, "project": string, "deadline": string }
- update_status: { "task_id": string, "status": "Unassigned"|"In Progress"|"Completed"|"At Risk" }
- reassign_task: { "task_id": string, "employee_name": string }
`,
    });
    
    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text().replace(/```json|```/g, "").trim();
    
    try {
      return JSON.parse(text);
    } catch (e) {
      return {
        message: text,
        intent: "query",
        action: null,
        data: null
      };
    }
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "The AI is currently unavailable. Please check your API key or try again later.";
  }
}
