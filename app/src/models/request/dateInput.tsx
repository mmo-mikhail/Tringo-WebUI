export class DatesInput {
    constructor(
        public dateFrom: Date | null,
        public dateUntil: Date | null,
        public uncertainDates: UncertainDates | null,
        public clicked: boolean | undefined,
        public clickedu: boolean | undefined
    ) {}
}

export class UncertainDates {
    constructor(public monthIdx: number, public duration: Duration) {}
}

export enum Duration {
    Weekend = 1,
    Week = 2,
    TwoWeek = 4
}
