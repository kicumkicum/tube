import AbstractList from '../abstract-list/abstract-list';


export default class CategoryList extends AbstractList {
	/**
	 */
	constructor(app) {
		super(app);

		this._addContainerClass('s-category-list');

		this.setTitle('Categories');

		this._exported.list.on(this._exported.list.EVENT_CLICK, (eventName, category) => {
			app.services.navigation.openVideoList(category);
		});
	}

	/**
	 * @override
	 */
	takeSnapshot() {
		const dataList = this._dataList;

		return () => {
			this.setDataList(dataList);
		};
	}
};
