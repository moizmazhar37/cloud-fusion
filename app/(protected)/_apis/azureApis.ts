const BackendUrl = "http://localhost:3001";

export const GenerateAzureVar = async (directoryName: string, region: string, keyname: string, subscription_id: string, client_id: string, client_secret: string, tenant_id: string, size: string, image: string, username: string) => {

    if (!region || !keyname || !subscription_id || !client_id || !client_secret || !tenant_id || !size || !image || !username) {
        return { error: "region or keyname or subscription_id or client_id or client_secret or tenant_id or size or image or username not provided", success: false }
    }

    const response = await fetch(`${BackendUrl}/api/terraform/generate-azurevar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ directoryName, region, keyname, subscription_id, client_id, client_secret, tenant_id, size, image, username }),
    });

    return response.json();
}

export const GenerateAzureInstance = async (directoryName: string, keyName: string, vpcAddress: string, subnetAddress: string, rules: any) => {

    if (!directoryName || !keyName || !vpcAddress || !subnetAddress || !rules) {
        return { error: "directoryName or keyName or vpcAddress or subnetAddress or rules not provided", success: false }
    }

    const response = await fetch(`${BackendUrl}/api/terraform/generate-azure-instance`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ directoryName, keyName, vpcAddress, subnetAddress, rules }),
    });

    return response.json();
}

export const GetAzureData =  async (directoryName: string, keyName: string ) => {
    if (!directoryName || !keyName ) {
        return { error: "directoryName or keyName  not provided", success: false }
    }


    const response = await fetch(`${BackendUrl}/api/terraform/GetAzureData`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ directoryName, key:keyName }),
    });

    return response.json();
}
