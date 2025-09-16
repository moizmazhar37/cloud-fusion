
const BackendUrl = "http://localhost:3001";

export const CloneRepo = async (host: string, port: string, username: string, privateKey: string, repository: string, gitname: string, patToken: string) => {

    if (!host || !port || !username || !privateKey || !repository || !gitname || !patToken) {
        return { error: "Host or port or username or privateKey or repository or gitname or patToken not provided", success: false }
    }

    const response = await fetch(`${BackendUrl}/api/ssh/clone-repo`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ host, port, username, privateKey, repository, gitname, patToken }),
    });

    return response.json();
};

export const BuildRun = async (framework: string, host: string, port: string, username: string, privateKey: string, repository: string, installCommand: string, buildCommand: string, nodeVersion: number, applicationPort: number) => {

    if (framework === "" || host === "" || username === "" || privateKey === "" || repository === "" || installCommand === "" || buildCommand === "" || nodeVersion === 0 || applicationPort === 0) {
        return { message: "framework or host or port or username or privateKey or repository or installCommand or buildCommand or nodeVersion or applicationPort not provided", success: false }
    }

    const response = await fetch(`${BackendUrl}/api/ssh/build-run`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ framework, host, port, username, privateKey, repository, installCommand, buildCommand, nodeVersion, applicationPort }),
    });

    return response.json();
};

export const RunCommand = async (framework: string, host: string, port: string, repoPort: number, username: string, privateKey: string, repository: string) => {

    if (framework === "" || host === "" || username === "" || privateKey === "" || repository === "") {
        return { message: "framework or host or port or username or privateKey or repository or command not provided", success: false }
    }

    const response = await fetch(`${BackendUrl}/api/ssh/run-command`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ framework, host, port, repoPort, username, privateKey, repository }),
    });

    return response.json();
};

export const InstallDocker = async (host: string, port: string, username: string, privateKey: string, filename: string) => {

    if (host === "" || username === "" || privateKey === "") {
        return { message: "host or port or username or privateKey not provided", success: false }
    }

    const response = await fetch(`${BackendUrl}/api/ssh/install-docker`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ host, port, username, privateKey, filename }),
    });

    return response.json();
}

export const CopyDockerContent = async (host: string, port: string, username: string, privateKey: string, content: string, filename: string) => {

    if (host === "" || username === "" || privateKey === "" || content === "" || filename === "") {
        return { message: "host or port or username or privateKey or content or filename not provided", success: false }
    }

    const response = await fetch(`${BackendUrl}/api/ssh/copy-docker-content`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ host, port, username, privateKey, content, filename }),
    });

    return response.json();
}



export const RunDockerCommand = async (host: string, port: string, username: string, privateKey: string, dockerCommand: string) => {

    if (host === "" || username === "" || privateKey === "" || dockerCommand === "") {
        return { message: "host or port or username or privateKey or repository or dockerCommand not provided", success: false }
    }

    const response = await fetch(`${BackendUrl}/api/ssh/run-docker-command`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ host, port, username, privateKey, dockerCommand }),
    });

    return response.json();
}


export const DeployServices = async (host: string, port: string, username: string, privateKey: string, config: any, serviceName: string) => {

    if (host === "" || username === "" || privateKey === "" || config === "" || serviceName === "") {
        return { message: "host or port or username or privateKey or config or serviceName not provided", success: false }
    }

    const response = await fetch(`${BackendUrl}/api/ssh/deploy-services`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ host, port, username, privateKey, config, serviceName }),
    });

    return response.json();
}

export const ReverseProxy = async (host: string, port: string, username: string, privateKey: string, portNumber: number, domain : string) => {

    if (host === "" || username === "" || privateKey === "" || portNumber === 0 || domain === "") {
        return { message: "host or port or username or privateKey or portNumber or domain not provided", success: false }
    }

    const response = await fetch(`${BackendUrl}/api/ssh/reverse-proxy`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ host, port, username, privateKey, portNumber, domain }),
    });

    return response.json();
}



