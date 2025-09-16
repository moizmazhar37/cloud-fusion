
const BackendUrl = "http://localhost:3001";

export const GenerateProcess = async () => {
  const response = await fetch(`${BackendUrl}/api/process/generate-process`);
  return response.json();
};

export const RunningConfig = async ( directoryName: string , aws_access_key: string, aws_secret_key: string, region: string, machine_name: string, ami: string, instance_type: string, user: string, storage: number , keyname: string) => {
  const response = await fetch(`${BackendUrl}/api/terraform/generate-var-file`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ directoryName, aws_access_key, aws_secret_key, region, machine_name, ami, instance_type, user, storage , keyname }),
  });
  return response.json();
}

interface SecurityGroup {
  name: string,
  description: string,
  port: number
}

export const GenerateAwsInstance = async ( directoryName: string, keyName: string , inbound: SecurityGroup[], outbound: SecurityGroup[] ) => {
  const response = await fetch(`${BackendUrl}/api/terraform/generate-aws-instance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ directoryName , keyName , inbound , outbound }),
  });
  return response.json();
};

export const EstablishProvider = async ( providerName: string, directoryName: string ) => {
  const response = await fetch(`${BackendUrl}/api/terraform/establish-provider`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ providerName, directoryName }),
  });
  return response.json();
};

export const GenerateExecutionPlan = async ( directoryName: string, command: string ) => {
  const response = await fetch(`${BackendUrl}/api/terraform/execute-commands`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ directoryName, command }),
  });
  return response.json();
};

export const CleanUp = async ( directoryName: string ) => {
  const response = await fetch(`${BackendUrl}/api/terraform/clean-up` , { 
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ directoryName }),
  });
  return response.json();
}

export const GetTerraformData = async ( directoryName: string , key: string ) => {
  const response = await fetch(`${BackendUrl}/api/aws/get-terraform-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ directoryName , key}),
  });
  return response.json();
};


