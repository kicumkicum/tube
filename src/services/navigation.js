import Category from '../models/category';
import Video from '../models/video';
import LayerManager from 'zb/layer-manager';
import SceneOpener from 'zb/scene-opener';
import DynamicList from 'ui/data/dynamic-list';
import Throbber from 'ui/widgets/throbber/throbber';


export default class Navigation {
	/**
	 * @param {tube.services.Navigation.Scenes} scenes
	 * @param {zb.SceneOpener} opener
	 * @param {zb.LayerManager} layerManager
	 * @param {zb.ui.widgets.Throbber} throbber
	 */
	constructor(scenes, opener, layerManager, throbber, app) {
		this._app = app;
		/**
		 * @type {tube.services.Navigation.Scenes}
		 * @private
		 */
		this._scenes = scenes;

		/**
		 * @type {zb.SceneOpener}
		 * @private
		 */
		this._opener = opener;

		/**
		 * @type {zb.LayerManager}
		 * @private
		 */
		this._layerManager = layerManager;

		/**
		 * @type {zb.ui.widgets.Throbber}
		 * @private
		 */
		this._throbber = throbber;
	}

	/**
	 * @return {IThenable}
	 */
	openHome() {
		const currentLayer = this._layerManager.getCurrentLayer();
		if (currentLayer === this._scenes.categoryList) {
			return Promise.reject();
		} else {
			return this.openCategoryList();
		}
	}

	/**
	 * @param {Category} category
	 * @return {IThenable}
	 */
	openVideoList(category) {
		const dataList = new DynamicList(
			(from, to) => {
				const offset = from;
				const limit = to - from + 1;
				return this._app.api.popcorn.getVideoList(category, offset, limit);
			}, {
				startFrom: 0,
				startLoadingOnItemsLeft: 10,
				bufferSize: 200,
				initialBufferSize: 50,
				frameSize: 50
			}
		);

		const promise = dataList
			.preload()
			.then(() => this._opener.open(this._scenes.videoList))
			.then(() => {
				this._scenes.videoList.setTitle(category.title);
				this._scenes.videoList.setDataList(dataList);
			});

		this._wait(promise);

		return promise;
	}

	/**
	 * @return {IThenable}
	 */
	openCategoryList() {
		const dataList = new DynamicList(
			(from, to) => {
				const offset = from;
				const limit = to - from;
				return this._app.api.popcorn.getCategoryList(offset, limit);
			}, {
				startFrom: 0,
				startLoadingOnItemsLeft: 10,
				bufferSize: 200,
				initialBufferSize: 50,
				frameSize: 50
			}
		);

		const promise = dataList
			.preload()
			.then(() => this._opener.open(this._scenes.categoryList))
			.then(() => {
				this._scenes.categoryList.setDataList(dataList);
			});

		this._wait(promise);

		return promise;
	}

	/**
	 * @param {Video} video
	 * @return {IThenable}
	 */
	openPlayer(video) {
		const promise = video
			.extend()
			.then(() => {
				return this
					._opener.open(this._scenes.player)
					.then(() => {
						const videoUrl = /** @type {string} */ (video.videoUrl);
						this._scenes.player.setData(video.title, videoUrl);
					});
			});

		this._wait(promise);

		return promise;
	}

	/**
	 * @param {IThenable} promise
	 * @return {IThenable}
	 * @private
	 */
	_wait(promise) {
		const currentLayer = this._layerManager.getCurrentLayer();
		if (currentLayer) {
			currentLayer.wait(promise);
		}
		this._throbber.wait(promise);
		return promise;
	}
};


/**
 * @typedef {{
 *     categoryList: tube.scenes.CategoryList,
 *     videoList: tube.scenes.VideoList,
 *     player: tube.scenes.Player
 * }}
 */
Navigation.Scenes;
