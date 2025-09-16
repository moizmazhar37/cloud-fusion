const DigitalOceanRegions = {
    "nyc1": "New York 1",
    "nyc2": "New York 2",
    "nyc3": "New York 3",
    "sfo1": "San Francisco 1",
    "sfo2": "San Francisco 2",
    "sfo3": "San Francisco 3",
    "ams2": "Amsterdam 2",
    "ams3": "Amsterdam 3",
    "sgp1": "Singapore 1",
    "lon1": "London 1",
    "fra1": "Frankfurt 1",
    "tor1": "Toronto 1",
    "blr1": "Bangalore 1",
    "syd1": "Sydney 1"
};

const DigitalOceanImages = [
    "ubuntu-23-04-x64",
    "ubuntu-22-04-x64",
    "ubuntu-20-04-x64",
    "ubuntu-18-04-x64",
    "ubuntu-16-04-x64",
    "ubuntu-14-04-x64"
];



const DigitalOceanDropdowns = {
    "Basic": {
        "1vCPU, 1GB RAM, 25GB SSD, 1TB Transfer": "s-1vcpu-1gb",
        "1vCPU, 2GB RAM, 50GB SSD, 2TB Transfer": "s-1vcpu-2gb",
        "2vCPU, 2GB RAM, 60GB SSD, 3TB Transfer": "s-2vcpu-2gb",
        "2vCPU, 4GB RAM, 80GB SSD, 4TB Transfer": "s-2vcpu-4gb",
        "4vCPU, 8GB RAM, 160GB SSD, 5TB Transfer": "s-4vcpu-8gb"
    },
    "Premium Intel": {
        "1vCPU, 1GB RAM, 35GB SSD, 1TB Transfer": "s-1vcpu-1gb-35gb-intel",
        "1vCPU, 2GB RAM, 70GB SSD, 2TB Transfer": "s-1vcpu-2gb-70gb-intel",
        "2vCPU, 2GB RAM, 90GB SSD, 3TB Transfer": "s-2vcpu-2gb-90gb-intel",
        "2vCPU, 4GB RAM, 120GB SSD, 4TB Transfer": "s-2vcpu-4gb-120gb-intel",
        "4vCPU, 8GB RAM, 160GB SSD, 5TB Transfer": "s-4vcpu-8gb-160gb-intel"
    },
    "Premium AMD": {
        "1vCPU, 1GB RAM, 25GB SSD, 1TB Transfer": "s-1vcpu-1gb-amd",
        "1vCPU, 2GB RAM, 50GB SSD, 2TB Transfer": "s-1vcpu-2gb-amd",
        "2vCPU, 2GB RAM, 60GB SSD, 3TB Transfer": "s-2vcpu-2gb-amd",
        "2vCPU, 4GB RAM, 80GB SSD, 4TB Transfer": "s-2vcpu-4gb-amd",
        "4vCPU, 8GB RAM, 160GB SSD, 5TB Transfer": "s-4vcpu-8gb-amd"
    }
};

const awsInfrastuctureProcess = [
    {
        name: 'Generaring Process',
        description: 'Generaring Process',
        status: 'loading',
        succuss: false,
        time: 0,
        result: "Creating Process Directory..."
    },
    {
        name: 'Setting up environment',
        description: 'Setting up environment',
        status: 'not-started',
        succuss: false,
        time: 0,
        result: "Environment for Infrastructure Provisioning ..."
    },
    {
        name: "Generating Configurations",
        description: "Generating Configurations",
        status: "not-started",
        success: false,
        time: 0,
        result: "Generating Configurations for AWS Instance..."
    },
    {
        name: "Establishing Provider",
        description: "Establishing Provider",
        status: "not-started",
        success: false,
        time: 0,
        result: "Establishing Connection with AWS..."
    },
    {
        name: "Generating Execution Plan",
        description: "Generating Execution Plan",
        status: "not-started",
        success: false,
        time: 0,
        result: "Working on Execution Plan... (May take a few minutes)"
    }, {
        name: "Applying Execution Plan",
        description: "Applying Execution Plan",
        status: "not-started",
        success: false,
        time: 0,
        result: "Applying Execution Plan... (May take a few minutes)"
    },
    {
        name: "Fetching VM Details",
        description: "Completed",
        status: "not-started",
        success: false,
        time: 0,
        result: ""
    },
    {
        name: "Cleaning Up",
        description: "Cleaning Up",
        status: "not-started",
        success: false,
        time: 0,
        result: ""
    },
    {
        name: "Completed",
        description: "Completed",
        status: "not-started",
        success: false,
        time: 0,
        result: ""
    },

]

export { DigitalOceanRegions, DigitalOceanImages, DigitalOceanDropdowns , awsInfrastuctureProcess};