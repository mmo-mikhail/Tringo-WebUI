import SearchWidgetWrapper from '../searchWidgetWrapper';
import { Budget, FlightDestinationRequest, MapArea } from '../../../models/request/flightDestinationRequest';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import { DatesInput } from '../../../models/request/dateInput';

configure({ adapter: new Adapter() });
describe('search widget wrapper class', () => {
    const SearchWidgetWrapperProps = {
        onChange: (model: FlightDestinationRequest, selectedAirportLabel: string | null) => void true,
        initialModel: new FlightDestinationRequest(
            'Mel',
            MapArea.createRandom(),
            new Budget(200, 2000),
            new DatesInput(10)
        )
    };
    const SearchWidgetWrapperState = {
        datesState: 10,
        budgetMin: 300,
        budgetMax: 1200,
        budgetStep: 100
    };

    it('should not be null', () => {
        let wrapper = shallow(<SearchWidgetWrapper {...SearchWidgetWrapperProps} {...SearchWidgetWrapperState} />);
        expect(wrapper != null);
    });

    it('should change props according to input data', () => {
        let wrapper = mount(<SearchWidgetWrapper {...SearchWidgetWrapperProps} {...SearchWidgetWrapperState} />);
        // expect((wrapper.prop('budgetMax'))).toEqual(SearchWidgetWrapperState.budgetMax)
        expect(wrapper.prop('budgetMax')).toEqual(SearchWidgetWrapperState.budgetMax);
    });

    it('should change state according to input data', () => {
        let wrapper = mount(<SearchWidgetWrapper {...SearchWidgetWrapperProps} {...SearchWidgetWrapperState} />);
        // expect((wrapper.prop('budgetMax'))).toEqual(SearchWidgetWrapperState.budgetMax)
        expect(wrapper.state('budgetMax')).toEqual(2000);
    });

    it('should render based on input data', () => {
        const wrapper = mount(<SearchWidgetWrapper {...SearchWidgetWrapperProps} {...SearchWidgetWrapperState} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
