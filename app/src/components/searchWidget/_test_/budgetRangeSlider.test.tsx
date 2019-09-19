import BudgetRangerSlider from 'components/searchWidget/budgetRangeSlider';
import * as React from 'react';
import {shallow, mount} from 'enzyme';
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

describe('budgetRangeSlider Resposne', () => {
// mock props
    const sliderProps = {
        min: 100,
        max: 1000,
        step: 1,
        className: "sliderClassName",
        onChange: jest.fn()
    };

    it('should not be null', () => {
        let wrapper = shallow(<BudgetRangerSlider {...sliderProps} />);
        expect(wrapper != null);
    });


    it('should return widget-row widget-row-fill class ', () => {
        const wrapper = mount(<BudgetRangerSlider {...sliderProps} />);
        expect(wrapper.hasClass('widget-row widget-row-fill'));
    });

    it('should have a max prop equal to 1000', () => {
        const wrapper = mount(<BudgetRangerSlider {...sliderProps} />);
        expect(wrapper.prop('max')).toEqual(sliderProps.max);
    });

    it('should have a min prop equal to 100', () => {
        const wrapper = mount(<BudgetRangerSlider {...sliderProps} />);
        expect(wrapper.prop('min')).toEqual(sliderProps.min);
    });

    it('should have a step of 1', () => {
        const wrapper = mount(<BudgetRangerSlider {...sliderProps} />);
        expect(wrapper.prop('step')).toEqual(sliderProps.step);
    });

});
