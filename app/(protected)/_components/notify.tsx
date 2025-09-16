import { NotifyProps } from '@/app/Interfaces/awsInterfaces';
import { notification } from 'antd';

function Notify ({ type, message, description }: NotifyProps){
    notification.open({
        message: message,
        description: description,
        duration: 0,
        placement: 'bottomRight',
    });
}

export default Notify;
