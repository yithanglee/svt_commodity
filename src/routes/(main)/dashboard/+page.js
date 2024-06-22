/** @type {import('./$types').PageLoad} */
import { PHX_HTTP_PROTOCOL, PHX_ENDPOINT } from '$lib/constants';
import { buildQueryString, postData, genInputs } from '$lib/index.js';
	
export const load = async ({ fetch, params, parent }) => {
	var url = PHX_HTTP_PROTOCOL + PHX_ENDPOINT;

    let inputs = await genInputs(url, 'User')

    return {inputs: inputs,
        chartData: []
    };
};