
const BackendUrl = "http://localhost:3001";

export const ConfigureAnsible = async (
    public_ip: string,
    user: string,
    sshKey: string
) => {

    const response = await fetch(`${BackendUrl}/api/ansible/ansible-config`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ public_ip, user, sshKey }),
        });
    return response.json();
};

export const GenerateAnsiblePlaybook = async (
    folderName: string,
    packages: any
) => {
    const response = await fetch(`${BackendUrl}/api/ansible/create-ansible-playbook`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ folderName, packages })
        });
    return response.json();
};

export const RunAnsiblePlaybook = async (
    folderName: string
) => {
    const response = await fetch(`${BackendUrl}/api/ansible/execute-ansible-playbook`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ folderName })
        });
    return response.json();
}
