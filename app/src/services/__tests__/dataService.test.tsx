import { airportLocation, mapLocationData } from 'services/dataService';
import { OptionType } from 'components/searchWidget/Autocomplete';


describe('map LocationData', () => {
    let data: airportLocation[];
    
    beforeAll(() => {
        data = [
            {
                TsaAirportCode: 'MELALL',
                City: 'Melbourne',
                Airport: 'Tullamarine',
                AirportCode: 'MEL',
                Country: 'Australia',
                IsMetro: true,
                HasMetro: false,
                NearKeyword: 'Blah',
                CityAirportName: 'Blah Blah'
            },
            {
                TsaAirportCode: 'LONALL',
                City: 'London',
                Airport: 'Heathrow',
                AirportCode: 'LON',
                Country: 'England',
                IsMetro: true,
                HasMetro: false,
                NearKeyword: 'Blah',
                CityAirportName: 'Blah Blah'
            }];
    });
    
    let result: OptionType[];
    beforeEach(() => {
        const inputValue = 'Mel';
        result = mapLocationData(data, inputValue);
    });
    
    
    
    it('should contain only one item in returned object', () => {
        // arrange
        const length = 1;
        //act
        // assert
        expect(result).toHaveLength(length);
    });
    
    it('should contain only Mel airport in returned object', () => {
        // arrange
        const airportCode = 'MEL';
        //act
        // assert
        expect(result[0].value).toBe(airportCode);
        expect(result[0].optionLabel!.toUpperCase()).toContain(airportCode.toUpperCase());
    });
    
    
});
