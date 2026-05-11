import { NextRequest, NextResponse } from "next/server";
import { getResourceRecommendations, analyzeWorkload, predictDelayRisks } from "@/lib/gemini";
import { getZohoData } from "@/lib/zoho";

export async function POST(req: NextRequest) {
  try {
    const { action, payload } = await req.json();
    const data = await getZohoData();

    switch (action) {
      case "recommend":
        const employees = payload.employees || data.employees;
        const recommendations = await getResourceRecommendations(payload.task, employees);
        return NextResponse.json(recommendations);
      
      case "balance":
        const balanceSuggestions = await analyzeWorkload(data.employees, data.tasks);
        return NextResponse.json({ suggestions: balanceSuggestions });
      
      case "predict_risks":
        const risks = await predictDelayRisks(data.projects, data.tasks, data.employees);
        return NextResponse.json(risks);
      
      case "chat":
        const { message, history } = payload;
        const { sendMessageToChat } = await import("@/lib/gemini");
        const chatResponse = await sendMessageToChat(message, history);
        return NextResponse.json({ response: chatResponse });
      
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
