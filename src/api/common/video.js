import IVideo from '../i-video';
import Transport from './transport';
import Category from '../../models/category';
import Video from '../../models/video';


/**
 * @implements {IVideo}
 */
export default class VideoApi {
	/**
	 */
	constructor() {
		/**
		 * @type {Transport}
		 * @private
		 */
		this._transport = new Transport();
	}

	/**
	 * @override
	 */
	getCategoryList(offset, limit) {
		return this._transport
			.request('getCategoryList', {
				'offset': offset,
				'limit': limit
			})
			.then((response) => {
				let items = [];
				if (response['response'] && response['response']['items']) {
					items = response['response']['items'];
				}

				return items.map((category) => Category.fromData({
					id: category['id'],
					title: category['title'],
					coverUrl: category['coverUrl']
				}));
			});
	}

	/**
	 * @override
	 */
	getVideoList(category, offset, limit) {
		return this._transport
			.request('getVideoList', {
				'category_id': category.id,
				'offset': offset,
				'limit': limit
			})
			.then((response) => {
				let items = [];
				if (response['response'] && response['response']['items']) {
					items = response['response']['items'];
				}

				return items.map((video) => {
					const videoUrl = video['videoUrl'];
					return Video.fromData({
						id: video['id'],
						title: video['title'],
						coverUrl: video['coverUrl'],
						duration: parseInt(video['duration'], 10),
						views: parseInt(video['views'], 10)
					}, () => {
						const promise = /** @type {Promise<{videoUrl: string}>} */ (Promise.resolve({
							videoUrl: videoUrl
						}));
						return promise;
					});
				});
			});
	}
};
