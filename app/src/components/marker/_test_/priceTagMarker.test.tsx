import PriceTagMarker from 'components/marker/priceTagMarker';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
describe('marker Resposne', () => {
    // mock data for priceTagMarker arguments
    const MarkerProps = {
        key: 1,
        lat: 2,
        lng: 3,
        price: 100,
        fromCode: 'mel',
        fromLabel: 'Melbourne',
        destination: 'Lon',
        destinationCode: 'London',
        priority: 2,
        dateOut: new Date(2019, 10, 1),
        dateBack: new Date(2019, 10, 16)
    };

    it('should not be null', () => {
        let wrapper = shallow(<PriceTagMarker {...MarkerProps} />);
        expect(wrapper != null);
    });

    it('should return a span', () => {
        let wrapper = shallow(<PriceTagMarker {...MarkerProps} />);
        expect(wrapper.type()).toBe('span');
    });

    it('should have price-marker class ', () => {
        const wrapper = mount(<PriceTagMarker {...MarkerProps} />);
        expect(wrapper.hasClass('price-marker '));
    });

    it('should have a flight price of 100 ', () => {
        const wrapper = mount(<PriceTagMarker {...MarkerProps} />);
        expect(wrapper.containsMatchingElement(<div className="price-text">${Number('100')}</div>)).toBeTruthy();
    });

    it('should render based on input data', () => {
        const wrapper = mount(<PriceTagMarker {...MarkerProps} />);
        expect(
            wrapper.containsMatchingElement(
                <span>
                    <a role="button" className="price-marker" href="#searchWidgetModal" data-toggle="modal">
                        <div className="city-text">{'Lon'}</div>
                        <div className="price-text">${Number('100')}</div>
                    </a>
                </span>
            )
        ).toBeTruthy();
    });
});
