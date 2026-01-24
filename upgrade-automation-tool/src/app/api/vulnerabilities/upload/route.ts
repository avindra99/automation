import { NextResponse } from "next/server";

const JAVA_BACKEND_URL = "http://localhost:8081/api/vulnerabilities/upload";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const res = await fetch(JAVA_BACKEND_URL, {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            const errorText = await res.text();
            return NextResponse.json({ error: errorText }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Failed to upload to Java backend:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
