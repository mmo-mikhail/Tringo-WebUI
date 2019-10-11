import { put } from 'redux-saga/effects';

import axios from 'utils/axious';
import * as destinationAction from 'actions/destinations';
import {
    IFlightsRequestAction,
    BaseFlightDestinationRequest,
    FlightDestinationRequest,
    MapArea
} from 'models/request/flightDestinationRequest';
import { IDestination } from '../models/response/destination';

interface ResposneIntf {
    data: IDestination[];
}

interface StorageDataIntf {
    response: ResposneIntf;
    expiresAt: number;
}

const filterByArea = (destinations: IDestination[], searchArea: MapArea): IDestination[] => {
    //Extend Search Area
    const extendLevel = 1.1;
    searchArea.nw.lat += extendLevel;
    searchArea.nw.lng -= extendLevel;
    searchArea.se.lat -= extendLevel;
    searchArea.se.lat += extendLevel;

    return destinations.filter(d => {
        if (d.lat > searchArea.nw.lat || d.lat < searchArea.se.lat) return false;

        return searchArea.se.lng >= searchArea.nw.lng
            ? d.lng >= searchArea.nw.lng && d.lng <= searchArea.se.lng
            : d.lng >= searchArea.nw.lng;
    });
};

const filterData = (model: FlightDestinationRequest, destinations: IDestination[]): IDestination[] => {
    if (model.budget) {
        destinations = destinations.filter(d => model.budget!.min < d.price && d.price <= model.budget!.max);
    }
    return filterByArea(destinations, model.searchArea);
};

async function tryGetFromCache(
    req: BaseFlightDestinationRequest,
    lifetimeSec: number,
    factory: (req: BaseFlightDestinationRequest) => Promise<ResposneIntf>
): Promise<ResposneIntf> {
    const storage = sessionStorage || window.sessionStorage;
    if (!storage) {
        return factory(req);
    }
    const key = `${req.departureAirportId}_${req.dates.monthidx}`;

    const value = storage.getItem(key);
    if (value) {
        const keyItem: StorageDataIntf = JSON.parse(value);
        if (keyItem && Date.now() < keyItem.expiresAt) {
            return Promise.resolve(keyItem.response);
        }
    }

    const promise = factory(req);
    promise.then((result: ResposneIntf) => {
        const valueObj: StorageDataIntf = {
            response: result,
            expiresAt: Date.now() + lifetimeSec * 1000
        };
        storage.setItem(key, JSON.stringify(valueObj));
    });
    return promise;
}
const respCacheLifeTimeSecs = parseInt(process.env.REACT_APP_RESPONSE_CACHE_LIFETIME_SECS || '');

export function* fetchDestinationsSaga(action: IFlightsRequestAction) {
    if (!action.model.departureAirportId) {
        yield put(destinationAction.fetchDestinationsClear(action.model));
    }

    try {
        const reqObj = new BaseFlightDestinationRequest(action.model.departureAirportId, action.model.dates);

        const response = yield tryGetFromCache(reqObj, respCacheLifeTimeSecs, () =>
            axios.post('/api/v1/flights/GetAllLowestPrices', reqObj)
        );

        var filteredData = filterData(action.model, response.data);

        yield put(destinationAction.fetchDestinationsSuccess(filteredData));
    } catch (error) {
        yield put(destinationAction.fetchDestinationsFail(error.message));
    }
}
