import BaseList from 'ui/widgets/base-list/base-list';
import ItemListItem from './item-list-item';


export default class ItemList extends BaseList {
	/**
	 */
	constructor() {
		super({
			itemClass: ItemListItem,
			isVertical: true,
			options: {
				padding: 3,
				loadOnLeft: 1,
				lineSize: 4
			}
		});

		this._container.classList.add('w-item-list');
	}
};
