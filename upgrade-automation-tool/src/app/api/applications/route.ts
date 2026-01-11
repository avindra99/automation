import { NextResponse } from "next/server";

const JAVA_BACKEND_URL = "http://localhost:8081/api/applications";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const res = await fetch(JAVA_BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorText = await res.text();
            return NextResponse.json({ error: errorText }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json({ success: true, app: data });
    } catch (error: any) {
        console.error("Failed to post to Java backend:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
