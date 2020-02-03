import Category from '../models/category';
import Video from '../models/video';


/**
 * @interface
 */
export default class IVideo {
	/**
	 * @param {number} offset
	 * @param {number} limit
	 * @return {IThenable<Array<Category>>}
	 */
	getCategoryList(offset, limit) {}

	/**
	 * @param {Category} category
	 * @param {number} offset
	 * @param {number} limit
	 * @return {IThenable<Array<Video>>}
	 */
	getVideoList(category, offset, limit) {}
};
