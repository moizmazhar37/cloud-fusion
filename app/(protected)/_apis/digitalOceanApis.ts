


const BackendUrl = "http://localhost:3001";

export const GenerateProcess = async () => {
    const response = await fetch(`${BackendUrl}/api/process/generate-process`);
    return response.json();
};

export const EstablishProvider = async (providerName: string, directoryName: string) => {
    const response = await fetch(`${BackendUrl}/api/terraform/establish-provider`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ providerName, directoryName }),
    });
    return response.json();
}


export const RunningConfig = async (directoryName: string, key_name :string , token: string, region: string, machine_name: string, size: string, storage: number, image: string, backups: boolean, monitoring: boolean) => {
    const response = await fetch(`${BackendUrl}/api/terraform/generate-var-file-DO`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ directoryName ,key_name, token, region, machine_name, size, storage, image, backups, monitoring }),
    });
    return response.json();
}
export const GenerateDigitalOceanInstance = async (directoryName: string, keyName: string) => {
    const response = await fetch(`${BackendUrl}/api/terraform/generate-digitalocean-instance`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ directoryName, keyName }),
    });
    return response.json();
}

export const GetDOData = async ( directoryName: string , key: string ) => {
    const response = await fetch(`${BackendUrl}/api/terraform/GetDOData`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ directoryName, key }),
    });
    return response.json();
}
