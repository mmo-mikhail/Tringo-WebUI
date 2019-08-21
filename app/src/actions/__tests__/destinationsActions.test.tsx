import { destinationActionType } from "../actionTypes";
import { fetchDestinationsStart, fetchDestinationsSuccess, fetchDestinationsFail }
	from "../destinations";
import { IDestination } from "../../models/destination";

describe("Destinaton Actions", () => {
	describe("fetchDestinationsStart", () => {
		it("should return the correct type", () => {
			const expectedResult = {
				type: destinationActionType.FETCH_DESTINATION_START,
			};

			expect(fetchDestinationsStart()).toEqual(expectedResult);
		});
	});

	describe("fetchDestinationsSuccess", () => {
		const testDestinations: IDestination[] = [
			{
				lat: 4322.34,
				lng: 5436.789,
				price: 5432.21,
				cityName: "CityNameTest"
			},
		];

		it("should return the correct type", () => {
			const expectedResult = {
				type: destinationActionType.FETCH_DESTINATION_SUCCESS,
				destinations: testDestinations,
			};

			expect(fetchDestinationsSuccess(testDestinations)).toEqual(expectedResult);
		});
	});

	describe("fetchDestinationsFail", () => {
		it("should return the correct type", () => {
			const testError = "error";

			const expectedResult = {
				type: destinationActionType.FETCH_DESTINATION_FAIL,
				error: testError,
			};

			expect(fetchDestinationsFail(testError)).toEqual(expectedResult);
		});
	});
});