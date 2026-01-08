import { NextResponse } from "next/server";
import { addApplication, updateApplication } from "@/data/mockData";

export async function POST(request: Request) {
    const body = await request.json();
    const { action, id, name, vastId, envs } = body;

    if (action === "add") {
        const newApp = addApplication(name, vastId, envs);
        return NextResponse.json({ success: true, app: newApp });
    }

    if (action === "edit") {
        const success = updateApplication(id, name, vastId);
        return NextResponse.json({ success });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
