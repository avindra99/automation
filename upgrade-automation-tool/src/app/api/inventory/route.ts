import { NextResponse } from "next/server";

const JAVA_BACKEND_URL = "http://localhost:8081/api/applications";

export async function GET() {
    try {
        const res = await fetch(JAVA_BACKEND_URL);
        if (!res.ok) {
            throw new Error(`Java backend returned ${res.status}`);
        }

        const javaApps = await res.json();

        // Transform Java nested structure to flattened structure expected by frontend
        const applications: any[] = [];
        const environments: any[] = [];
        const servers: any[] = [];

        javaApps.forEach((app: any) => {
            applications.push({
                id: app.id,
                name: app.name,
                vastId: app.vastId
            });

            if (app.environments) {
                app.environments.forEach((env: any) => {
                    environments.push({
                        id: env.id,
                        name: env.name,
                        appId: env.appId
                    });

                    if (env.servers) {
                        env.servers.forEach((server: any) => {
                            servers.push({
                                ...server
                            });
                        });
                    }
                });
            }
        });

        return NextResponse.json({
            applications,
            environments,
            servers
        });
    } catch (error: any) {
        console.error("Failed to fetch from Java backend:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
