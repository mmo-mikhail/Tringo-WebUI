import { PriceTagMarker } from 'components/markers/priceTagMarker';
import * as React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
describe('marker Resposne', () => {
    // mock data for priceTagMarker arguments
    const MarkerProps = {
        key: 1,
        lat: 2,
        lng: 3,
        fromCode: 'mel',
        fromLabel: 'Melbourne',
        destinations: [
            {
                destination: 'Lon',
                airportName:'London Airport',
                destinationCode: 'London',
                destinationCountryName:'UK',
                priority: 2,
                dateOut: new Date(2019, 10, 1),
                dateBack: new Date(2019, 10, 16),
                price: 100
            }
        ],
        onMouseEnter: () => {},
        onMouseLeave: () => {},
        customOnClick: () => {},
        forbidExpand: true,
        showAirportName: true
    };

    it('should not be null', () => {
        let wrapper = mount(<PriceTagMarker {...MarkerProps} />);
        expect(wrapper != null);
    });

    it('should return an anchor tag', () => {
        let wrapper = mount(<PriceTagMarker {...MarkerProps} />);
        expect(wrapper.findWhere(el => el.hasClass('price-marker')).type()).toBe('a');
    });

    it('should have price-marker class ', () => {
        const wrapper = mount(<PriceTagMarker {...MarkerProps} />);
        expect(wrapper.hasClass('price-marker'));
    });

    it('should have a flight price of 100 ', () => {
        const wrapper = mount(<PriceTagMarker {...MarkerProps} />);
        expect(
            wrapper.containsMatchingElement(
                <div className="price-text">
                    <span className="from-text">from </span>${MarkerProps.destinations[0].price}*
                </div>
            )
        ).toBeTruthy();
    });

    it('should render based on input data', () => {
        const wrapper = mount(<PriceTagMarker {...MarkerProps} />);

        expect(
            wrapper.containsMatchingElement(<div className="city-text">{MarkerProps.destinations[0].destination}</div>)
        ).toBeTruthy();
    });
});
