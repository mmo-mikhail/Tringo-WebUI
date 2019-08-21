import { fromJS } from "immutable";
import destinationsReducer from "../destinationsReducer";
import { fetchDestinationsStart, fetchDestinationsSuccess, fetchDestinationsFail } from "../../actions/destinations";
import { IDestination } from "../../models/destination";
import { DestinationsState } from "../../models/destinations";

describe("destinationReducer", () => {
	const initialState = new DestinationsState();

	let state: DestinationsState;

	beforeEach(() => {
		state = fromJS(initialState);
	});

	it("should return the initial state", () => {
		const expectedResult = state;
		expect(destinationsReducer(undefined, {})).toEqual(expectedResult);
	});

	it("should handle fetchDestinationsStart correctly", () => {
		const expectedResult = state.set("error", null).set("isLoading", true);
		expect(destinationsReducer(state, fetchDestinationsStart())).toEqual(expectedResult);
	});

	it("should handle fetchDestinationsSuccess correctly", () => {
		const testDestinations: IDestination[] = [
			{
				lat: 12.34,
				lng: 56.789,
				price: 12.21,
				cityName: "SydneyTest"
			},
		];

		const expectedResult = state.set("destinations", testDestinations).set("isLoading", false);
		expect(destinationsReducer(state, fetchDestinationsSuccess(testDestinations))).toEqual(expectedResult);
	});

	it("should handle fetchDestinationsFail correctly", () => {
		const error = "Test error";
		const expectedResult = state.set("error", error).set("isLoading", false);
		expect(destinationsReducer(state, fetchDestinationsFail(error))).toEqual(expectedResult);
	});
});