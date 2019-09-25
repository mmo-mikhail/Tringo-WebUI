import { Record } from 'immutable';
import IBaseModel from '../BaseModelInterface';
import _ from 'lodash';

export interface IDepartureAirport {
    lat: number | null;
    lng: number | null;
}

export interface IDepartureAirportStore extends IDepartureAirport, IBaseModel {
}

const defaultValues: IDepartureAirportStore = {
    lat: null,
    lng: null,
    isLoading: false,
    error: null
};

export class DepartureAirportState extends Record(defaultValues) implements IDepartureAirportStore {
    constructor(js?: any) {
        const additionalFields: IBaseModel = {
            isLoading: false,
            error: null
        };
        
        js ? super(_.merge(js, additionalFields)) : super();
    }
}
