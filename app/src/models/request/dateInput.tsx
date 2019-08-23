export class DatesInput {
    constructor(
        private dateFrom: Date | null,
        private dateUntil: Date | null,
        private uncertainDates: UncertainDates | null
    ) { }
}

export class UncertainDates {
    constructor(
        private monthIdx: number,
        private duration: Duration
    ) { }
}

export type Duration = "Weekend" | "Week" | "TwoWeeks";