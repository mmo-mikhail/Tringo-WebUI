import BudgetRangeSlider, { SliderProps, StepBracket } from '../budgetRangeSlider';

describe('budget range slider class', () => {
    let slider: BudgetRangeSlider;
    beforeAll(() => {
        const clickFn = jest.fn();
        const sliderProps: SliderProps = {
            min: 0,
            max: 1000,
            step: 1,
            className: 'some class',
            onChange: clickFn
        };
        slider = new BudgetRangeSlider(sliderProps);
        slider.priceBrackets = new Array<StepBracket>();
        slider.priceBrackets.push(
            { lowerLabelBound: 0, upperLabelBound: 1000, stepping: 20 },
            { lowerLabelBound: 1000, upperLabelBound: 1600, stepping: 100 }
        );
    });

    it('calculates correct max value', () => {
        let maxValue = slider.maxVal();
        expect(maxValue).toBe(56);
    });

    describe.each`
        val   | expected
        ${1}  | ${20}
        ${50} | ${1000}
        ${51} | ${1100}
    `('countLabel numeric value', ({ val, expected }) => {
        test(`returns ${expected}`, () => {
            let lblVal = slider.countLabel(val);
            expect(lblVal).toBe(expected);
        });
    });
});
