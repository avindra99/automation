import { NextResponse } from "next/server";

const JAVA_BACKEND_URL = "http://localhost:8081/api/upgrade";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { serverId, componentName, targetVersion } = body;

        if (!serverId || !componentName || !targetVersion) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const res = await fetch(JAVA_BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ serverId, componentName, targetVersion }),
        });

        if (res.ok) {
            return NextResponse.json({ success: true, message: "Upgrade successful" });
        } else {
            const errorText = await res.text();
            return NextResponse.json(
                { error: errorText || "Server error during upgrade" },
                { status: res.status }
            );
        }
    } catch (error: any) {
        console.error("Upgrade API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
