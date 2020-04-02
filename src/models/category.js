export default class Category {
	/**
	 * @param {Category.Data} data
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
 * @param {Category.Data} data
 * @return {Category}
 */
Category.fromData = function(data) {
	return new Category(data);
};


/**
 * @param {Array<Category.Data>} dataArray
 * @return {Array<Category>}
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
