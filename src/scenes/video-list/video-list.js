import AbstractList from '../abstract-list/abstract-list';


export default class VideoList extends AbstractList {
	/**
	 */
	constructor(app) {
		super(app);

		this._addContainerClass('s-video-list');

		this._exported.list.on(this._exported.list.EVENT_CLICK, (eventName, video) => {
			app.services.navigation.openPlayer(video);
		});
	}

	/**
	 * @override
	 */
	takeSnapshot() {
		const title = this._title;
		const dataList = this._dataList;

		return () => {
			this.setTitle(title);
			this.setDataList(dataList);
		};
	}
};
