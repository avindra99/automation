import { NextResponse } from "next/server";
import { getInventory } from "@/data/mockData";

export async function GET() {
    const data = getInventory();
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return NextResponse.json(data);
}
