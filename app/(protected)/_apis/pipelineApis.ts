
const BackendUrl = "http://localhost:3001";

export const AddCollaborator = async (username: string, repository: string ) => {

    if (!username || !repository) {
        return { message: "Username or repository not provided", success: false }
    }

    const response = await fetch(`${BackendUrl}/api/actions/add-collaborator`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, repository  }),
    });
    return response.json();
};

export const AddSecret = async (username: string, repository: string , secretNames: string[] , secretValues: string[] ) => {

    if (secretNames.length !== secretValues.length) {
        return { message: "Length of secretNames and secretValues is not equal", success: false }
    }

    if (!username || !repository) {
        return { message: "Username or repository not provided", success: false }
    }

    const response = await fetch(`${BackendUrl}/api/actions/add-secret`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, repository , secretNames , secretValues }),
    });
    return response.json();
}



export const AcceptCollaboration = async () => {

    const response = await fetch(`${BackendUrl}/api/actions/auto-accept-invitation`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.json();
}

export const AddPipeline = async (username: string, repository: string ,  yamlContent: string ) => {

    const response = await fetch(`${BackendUrl}/api/actions/addPipeline`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, repository , yamlContent }),
    });
    return response.json();
}

