import { Record } from 'immutable';
import IBaseModel from '../BaseModelInterface';
import { IDestination } from './destination';
import _ from 'lodash';

export interface IDestinations {
    destinations: IDestination[] | null;
}

export interface IDestinationsStore extends IDestinations, IBaseModel {}

const defaultValues: IDestinationsStore = {
    destinations: null,
    isLoading: false,
    error: null
};

export class DestinationsState extends Record(defaultValues) implements IDestinationsStore {
    constructor(js?: any) {
        const additionalFields: IBaseModel = {
            isLoading: false,
            error: null
        };

        js ? super(_.merge(js, additionalFields)) : super();
    }
}
