import fetchPresentismoData from '$lib/server/db';
import {getDepartamentoHost} from '$lib/utils';
export async function load() {
	return {
		records: await fetchPresentismoData(),
		hostname: getDepartamentoHost()
	};
}
