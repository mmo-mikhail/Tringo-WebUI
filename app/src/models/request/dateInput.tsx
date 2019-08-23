export class DatesInput {
    dateFrom: Date | null;
    dateUntil: Date | null;
    uncertainDates: UncertainDates | null;
}

export class UncertainDates {
    monthIdx: number;
    duration: Duration
}

export type Duration = "Weekend" | "Week" | "TwoWeeks";