import { NextResponse } from "next/server";
import { updateServerComponent } from "@/data/mockData";

export async function POST(request: Request) {
    const body = await request.json();
    const { serverId, componentName, targetVersion } = body;

    if (!serverId || !componentName || !targetVersion) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        );
    }

    // Simulate long running upgrade process
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const success = updateServerComponent(serverId, componentName, targetVersion);

    if (success) {
        return NextResponse.json({ success: true, message: "Upgrade successful" });
    } else {
        return NextResponse.json(
            { error: "Server or Component not found" },
            { status: 404 }
        );
    }
}
