import { Record } from "immutable";
import IBaseModel from "./BaseModelInterface";
import { Destination } from "./destination";
import _ from "lodash";

export interface IDestinations {
	destinations: Destination[] | null;
}

export interface IDestinationsStore extends IDestinations, IBaseModel { }

const defaultValues: IDestinationsStore = {
	destinations: null,
	isLoading: false,
	error: null,
};

export class DestinationsState extends Record(defaultValues) {
	constructor(js?: any) {
		const additionalFields: IBaseModel = {
			isLoading: false,
			error: null,
		};

		js ? super(_.merge(js, additionalFields)) : super();
	}
}