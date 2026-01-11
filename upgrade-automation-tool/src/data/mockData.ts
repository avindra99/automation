export interface Application {
    id: number;
    name: string;
    vastId: string;
}

export interface Environment {
    id: number;
    name: "Non-Prod" | "Prod";
    appId: number;
}

export interface SoftwareComponent {
    name: string;
    type: "Java" | "Python" | "Node.js" | "OpenSSL" | "Data" | "Web" | "API" | "Analytics";
    currentVersion: string;
    vulnerabilities: string;
    targetVersion: string;
    installPath?: string;
}

export interface Server {
    id: number;
    hostname: string;
    ip: string;
    appId: number;
    envId: number;
    components: SoftwareComponent[];
    status: "Outdated" | "Up to Date" | "Vulnerable";
}

export const generateMockData = () => {
    return { applications: [], environments: [], servers: [] };
};
