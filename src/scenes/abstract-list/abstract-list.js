import AbstractCuteScene from 'cutejs/layers/abstract-scene';
import {In, Out, render} from 'generated/cutejs/tt/scenes/abstract-list/abstract-list.jst';
// import 'tube.widgets.helpBarItemFactory';
import * as html from 'zb/html';
import DynamicList from 'ui/data/dynamic-list';
import {helpBarItemFactory} from '../../widgets/help-bar/help-bar-item-factory';


/**
 * @abstract
 */
export default class AbstractList extends AbstractCuteScene {
	/**
	 */
	constructor(app) {
		super();

		this._addContainerClass('s-abstract-list');

		/**
		 * @type {Out}
		 * @protected
		 */
		this._exported;

		/**
		 * @type {string}
		 * @protected
		 */
		this._title = '';

		/**
		 * @type {?DynamicList}
		 * @protected
		 */
		this._dataList = null;

		this._app = app;

		this._createHelpBar();

		this.setDefaultWidget(this._exported.helpBar);
	}

	/**
	 * @override
	 */
	processKey(zbKey, opt_event) {
		if (super.processKey(zbKey, opt_event)) {
			return true;
		}
		return this._exported.helpBar.processHelpBarKey(zbKey, opt_event);
	}

	/**
	 * @param {string} title
	 */
	setTitle(title) {
		this._title = title;
		html.text(this._exported.title, title);
	}

	/**
	 * @param {DynamicList} dataList
	 */
	setDataList(dataList) {
		this._dataList = dataList;
		this._exported.list.setSource(null);
		this._exported.list.setSource(dataList);
	}

	/**
	 * @override
	 */
	_renderTemplate() {
		return render(this._getTemplateData(), this._getTemplateOptions());
	}

	/**
	 * @protected
	 */
	_createHelpBar() {
		this._exported.helpBar.setItems([
			helpBarItemFactory.red('Home', () => {
				this._app.services.navigation.openHome();
			}),
			helpBarItemFactory.back('Back')
		]);
	}
};
