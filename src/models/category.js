export default class Category {
	/**
	 * @param {tube.models.Category.Data} data
	 */
	constructor(data) {
		/**
		 * @type {string}
		 */
		this.id = data.id;

		/**
		 * @type {string}
		 */
		this.title = data.title;

		/**
		 * @type {string|undefined}
		 */
		this.coverUrl = data.coverUrl;
	}
};


/**
 * @param {tube.models.Category.Data} data
 * @return {tube.models.Category}
 */
Category.fromData = function(data) {
	return new Category(data);
};


/**
 * @param {Array<tube.models.Category.Data>} dataArray
 * @return {Array<tube.models.Category>}
 */
Category.fromDataArray = function(dataArray) {
	return dataArray.map(Category.fromData);
};


/**
 * @typedef {{
 *     id: string,
 *     title: string,
 *     coverUrl: (string|undefined)
 * }}
 */
Category.Data;
