export class Entrymodel {
    id: string;
    surname: string;
    color: string;
    startDate: Startdate;
    endDate: Enddate;
    info: string;
    status?: string;
    inbet?: Inbetween[];
    editing?: boolean;
    easterYear?: string;
}

export class Startdate{
    day: string;
    month: string;
    year: string;
}

export class Enddate{
    day: string;
    month: string;
    year: string;
}

export interface Inbetween{
    day?: string
    month?: string;
    year?: string;
}




