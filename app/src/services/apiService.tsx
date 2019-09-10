import fetch from 'fetch-retry';

interface callApiProp {
    headerData: object;
    bodyData: string;
    retry: boolean;
    withCredentials: boolean;
}

export const callApi = (endpoint: string, method = 'GET', data?: callApiProp) => {
    const { headerData = null, bodyData = null, retry = false, withCredentials = false } = data ? data : {};

    if (endpoint.startsWith('/')) {
        endpoint = `//${window.location.host}${endpoint}`;
    }

    let options = {
        method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=UTF-8',
            ...headerData
        },
        body: bodyData && method !== 'GET' ? JSON.stringify(bodyData) : undefined
    };

    if (withCredentials) {
        options = Object.assign({}, options, {
            credentials: 'include'
        });
    }

    if (retry) {
        options = Object.assign({}, options, {
            retries: 3,
            retryDelay: 1000,
            retryOn: [503, 504]
        });
    }

    return fetch(endpoint, options)
        .then(response => {
            const contentType = response.headers.get('content-type');
            return contentType && contentType.indexOf('application/json') !== -1
                ? response.json().then(json => {
                      return { json, response };
                  })
                : { json: null, response };
        })
        .then(({ json, response }) => {
            if (!response.ok) {
                return Promise.reject(json);
            }

            return json;
        });
};
