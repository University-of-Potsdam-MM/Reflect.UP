export interface AppointConfig {
    events: EventObject[];
    warnings: any[];
}

export interface EventObject {
    id: number;
    name: string;
    description: string;
    format: number;
    courseid: number;
    groupid: number;
    userid: number;
    repeatid: number;
    modulename: string;
    instance: number;
    eventtype: string;
    timestart: number;
    timeduration: number;
    visible: number;
    uuid: string;
    sequence: number;
    timemodified: number;
    subscriptionid: number;
    hexColor?: any;
}
