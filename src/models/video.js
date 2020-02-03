export default class Video {
	/**
	 * @param {Video.Data} data
	 * @param {Video.ExtendFunction} extendFunction
	 */
	constructor(data, extendFunction) {
		/**
		 * @type {number}
		 */
		this.id = data.id;

		/**
		 * @type {string}
		 */
		this.title = data.title;

		/**
		 * @type {string}
		 */
		this.coverUrl = data.coverUrl.replace(`w500`, `w300`);

		/**
		 * @type {number|undefined}
		 */
		this.duration = data.duration;

		/**
		 * @type {number|undefined}
		 */
		this.views = data.views;

		/**
		 * @type {string|undefined}
		 */
		this.videoUrl;

		/**
		 * @type {Video.ExtendFunction}
		 * @private
		 */
		this._extendFunction = extendFunction;

		/**
		 * @type {?IThenable<{
		 *     videoUrl: string
		 * }>}
		 * @private
		 */
		this._extendPromise = null;
	}

	/**
	 * @return {IThenable<Video>}
	 */
	extend() {
		if (!this._extendPromise) {
			this._extendPromise = this
				._extendFunction()
				.then((data) => {
					this.videoUrl = data.videoUrl;
					return this;
				});
		}

		return this._extendPromise;
	}
};


/**
 * @param {Video.Data} data
 * @param {Video.ExtendFunction} extendFunction
 * @return {Video}
 */
Video.fromData = function(data, extendFunction) {
	return new Video(data, extendFunction);
};


/**
 * @param {Array<Video.Data>} dataArray
 * @param {Video.ExtendFunction} extendFunction
 * @return {Array<Video>}
 */
Video.fromDataArray = function(dataArray, extendFunction) {
	return dataArray.map((data) => Video.fromData(data, extendFunction));
};


/**
 * @typedef {{
 *     id: number,
 *     title: string,
 *     coverUrl: string,
 *     duration: (number|undefined),
 *     views: (number|undefined)
 * }}
 */
Video.Data;


/**
 * @typedef {function(): IThenable<{
 *     videoUrl: string
 * }>}
 */
Video.ExtendFunction;
