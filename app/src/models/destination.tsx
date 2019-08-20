import { Record } from "immutable";
import IBaseModel from "./BaseModelInterface";
import _ from "lodash";

export interface IDestination {
	lat?: number;
	lng?: number;
	price?: number;
	cityName?: string;
}

export interface IDestinationStore extends IDestination, IBaseModel { }

const defaultValues: IDestinationStore = {
	lat: undefined,
	lng: undefined,
	price: undefined,
	cityName: undefined,
	isLoading: false,
	error: null,
};

export default class Destination extends Record(defaultValues) {
	constructor(js?: any ) {
		const additionalFields: IBaseModel = {
			isLoading: false,
			error: null,
		};

		js ? super(_.merge(js, additionalFields)) : super();
	}
}