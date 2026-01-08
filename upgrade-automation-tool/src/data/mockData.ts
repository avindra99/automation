export interface Application {
    id: string;
    name: string;
    vastId: string;
}

export interface Environment {
    id: string;
    name: "Dev" | "QA" | "Staging" | "Production";
    appId: string;
}

export interface SoftwareComponent {
    name: string;
    type: "Java" | "Python" | "Node.js" | "OpenSSL" | "Data" | "Web" | "API" | "Analytics";
    currentVersion: string;
    patchLevel: string;
    targetVersion: string;
}

export interface Server {
    id: string;
    hostname: string;
    ip: string;
    appId: string;
    envId: string;
    components: SoftwareComponent[];
    status: "Outdated" | "Up to Date" | "Vulnerable";
}

// Generators
let APPS: Application[] = [
    { id: "vzweb", name: "vzweb", vastId: "V001" },
    { id: "corpweb", name: "corpweb", vastId: "V002" },
    { id: "privacy-policy", name: "privacy policy", vastId: "V003" },
    { id: "inside-verizon", name: "inside verizon", vastId: "V004" },
    { id: "about-you", name: "about you", vastId: "V005" },
    { id: "about-you-todos", name: "about you todo's", vastId: "V006" },
    { id: "profile-pantry", name: "profile pantry", vastId: "V007" },
    { id: "profile-picture", name: "profile picture", vastId: "V008" },
    { id: "orgtree", name: "orgtree", vastId: "V009" },
    { id: "one-profile", name: "one profile", vastId: "V010" },
];

const ENV_NAMES: ("Dev" | "QA" | "Staging" | "Production")[] = ["Dev", "QA", "Staging", "Production"];

export const generateMockData = () => {
    const applications = [...APPS];
    const environments: Environment[] = [];
    const servers: Server[] = [];

    applications.forEach(app => {
        ENV_NAMES.forEach(envName => {
            const envId = `${app.id}-${envName.toLowerCase()}`;
            environments.push({
                id: envId,
                name: envName,
                appId: app.id
            });

            for (let j = 1; j <= 3; j++) {
                const statusRoll = Math.random();
                servers.push({
                    id: `${envId}-server-${j}`,
                    hostname: `${envName.toLowerCase()}-server0${j}`,
                    ip: `10.0.${Math.floor(Math.random() * 255)}.${j}`,
                    appId: app.id,
                    envId: envId,
                    status: statusRoll > 0.7 ? "Outdated" : statusRoll > 0.4 ? "Up to Date" : "Vulnerable",
                    components: [
                        {
                            name: "Java",
                            type: "Java",
                            currentVersion: "1.8.0_271",
                            patchLevel: "221",
                            targetVersion: "11.0.12"
                        }
                    ],
                });
            }
        });
    });

    return { applications, environments, servers };
};

// Singleton to hold state in memory for the demo
let mockStore = generateMockData();

export const getInventory = () => mockStore;

export const addApplication = (name: string, vastId: string, envs: any[]) => {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    const newApp: Application = { id, name, vastId };
    mockStore.applications.push(newApp);

    envs.forEach(env => {
        const envId = `${id}-${env.name.toLowerCase().replace(/\s+/g, '-')}`;

        // Check if env already exists (to avoid duplicates if called multiple times)
        if (!mockStore.environments.find(e => e.id === envId)) {
            mockStore.environments.push({
                id: envId,
                name: env.name,
                appId: id
            });
        }

        env.servers.forEach((serverHostname: string, index: number) => {
            if (!serverHostname) return;
            mockStore.servers.push({
                id: `${envId}-server-${index}-${Math.random().toString(36).substr(2, 9)}`,
                hostname: serverHostname,
                ip: `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${index + 1}`,
                appId: id,
                envId: envId,
                status: "Outdated",
                components: [{
                    name: "Java",
                    type: "Java",
                    currentVersion: "1.8.0.21",
                    patchLevel: "0",
                    targetVersion: "11.0.12"
                }]
            });
        });
    });
    return newApp;
};

export const updateApplication = (id: string, name: string, vastId: string) => {
    const app = mockStore.applications.find(a => a.id === id);
    if (app) {
        app.name = name;
        app.vastId = vastId;
        return true;
    }
    return false;
};

export const updateServerComponent = (serverId: string, componentName: string, newVersion: string) => {
    const server = mockStore.servers.find((s) => s.id === serverId);
    if (server) {
        const component = server.components.find((c) => c.name === componentName);
        if (component) {
            component.currentVersion = newVersion;
            server.status = "Up to Date";
            return true;
        }
    }
    return false;
};
