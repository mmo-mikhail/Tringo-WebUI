import { put } from "redux-saga/effects";
import { fetchDestinationsSaga } from "../destinationSaga";
import * as actions from "../../actions/destinations";
import { IDestination } from "../../models/destination";

describe("fetchDestinationsSaga", () => {
	let fetchDestinationGenerator: any;

	beforeEach(() => {
		fetchDestinationGenerator = fetchDestinationsSaga();

		const callDescriptor = fetchDestinationGenerator.next().value;
		expect(callDescriptor).toMatchSnapshot();
	});

	it("should dispatch the fetchDestinationsSuccess action if it requests the data successfully", () => {
		interface IResponse {
			data: IDestination[];
		}

		const response: IResponse = {
			data: [],
		};

		const putDescriptor = fetchDestinationGenerator.next(response).value;
		expect(putDescriptor).toEqual(put(actions.fetchDestinationsSuccess(response.data)));
	});

	it("should dispatch the fetchDestinationsFail action if the response errors", () => {
		const error = new Error("Some error");
		const putDescriptor = fetchDestinationGenerator.throw(error).value;
		expect(putDescriptor).toEqual(put(actions.fetchDestinationsFail(error.message)));
	});
});