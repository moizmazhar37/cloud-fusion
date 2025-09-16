
interface SecurityGroup {
    name: string,
    description: string,
    port: number
}


interface AWSSelectorProps {
    setForm: React.Dispatch<React.SetStateAction<any>>,
    form: any,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    page: number,
    setSecurityGroups: React.Dispatch<React.SetStateAction<SecurityGroup[]>>,
    securityGroups: SecurityGroup[],
    setSecurityGroup: React.Dispatch<React.SetStateAction<SecurityGroup>>,
    securityGroup: SecurityGroup,
    outboundrules: SecurityGroup[],
    setOutboundRules: React.Dispatch<React.SetStateAction<SecurityGroup[]>>
}

interface FusionSelectorProps {
    setForm: React.Dispatch<React.SetStateAction<any>>,
    form: any,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    page: number,
    setSecurityGroups: React.Dispatch<React.SetStateAction<SecurityGroup[]>>,
    securityGroups: SecurityGroup[],
    setSecurityGroup: React.Dispatch<React.SetStateAction<SecurityGroup>>,
    securityGroup: SecurityGroup,
    outboundrules: SecurityGroup[],
    setOutboundRules: React.Dispatch<React.SetStateAction<SecurityGroup[]>>
    Images: any,
    Flavor: any,
    Network: any,
}

interface NotifyProps {
    type: string,
    message: string,
    description: string
}

export type { SecurityGroup, AWSSelectorProps, NotifyProps, FusionSelectorProps }
