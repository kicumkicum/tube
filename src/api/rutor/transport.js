import * as http from 'zb/http/http';
import * as xhr from 'zb/http/xhr';


export default class Transport {
	/**
	 */
	constructor() {
		/**
		 * @type {string}
		 * @private
		 */
    this._baseUrl = 'http://192.168.1.69:8080/';
	}

	/**
	 * @param {string} action
	 * @param {Object} query GET params
	 * @return {Promise<Object>}
	 */
	request(action, query) {
		const url = this._baseUrl + action;

		return xhr
			.send(url, {method: http.Method.GET, query})
			.then((xhr) => JSON.parse(xhr.responseText));
	}

	requestRaw(action, query) {
    const url = this._baseUrl + action;

    return xhr
      .send(url, {method: http.Method.GET, query})
      .then((xhr) => xhr.responseText);
	}
};
