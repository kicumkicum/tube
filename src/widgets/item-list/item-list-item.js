import {In, Out, render} from 'generated/cutejs/tt/widgets/item-list/item-list-item.jst';
import BaseListItem from 'ui/widgets/base-list/base-list-item';
import * as html from 'zb/html';
import Category from '../../models/category';
import Video from '../../models/video';


export default class ItemListItem extends BaseListItem {
	/**
	 * @override
	 */
	_createContainer() {
		const data = /** @type {Category|Video} */ (this._data);
		const type = data instanceof Category ? 'category' : 'video';
		const exported = render({
			type: type,
			title: data.title,
			coverUrl: data.coverUrl,
			duration: data.duration ? this._formatDuration(data.duration) : undefined,
			views: data.views ? this._formatViews(data.views) : undefined
		});

		this._container = html.findFirstElementNode(exported.root);
	}

	/**
	 * @param {number} time in seconds
	 * @return {string}
	 * @private
	 */
	_formatDuration(time) {
		const pad = (num) => (num < 10 ? '0' : '') + num;

		const seconds = time % 60;
		const minutes = Math.floor(time / 60);
		const hours = Math.floor(minutes / 60);

		const paddedSeconds = pad(seconds);
		const paddedMinutes = pad(minutes % 60);

		const parts = minutes < 60 ? [minutes, paddedSeconds] : [hours, paddedMinutes, paddedSeconds];

		return parts.join(':');
	}

	/**
	 * @param {number} views
	 * @return {string}
	 * @private
	 */
	_formatViews(views) {
		return String(views).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	}
};
