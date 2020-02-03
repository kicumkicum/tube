import * as html from 'zb/html';
import Widget from 'zb/widgets/widget';


export default class StateManager {
	/**
	 * @param {Array<tube.services.StateManager.Item>} itemList
	 */
	constructor(itemList) {
		/**
		 * @type {Array<tube.services.StateManager.Item>}
		 * @private
		 */
		this._itemList = itemList;

		/**
		 * @type {Object<string, Array<tube.services.StateManager.Item>>}
		 * @private
		 */
		this._stateMap = {};

		/**
		 * @type {string|null}
		 * @private
		 */
		this._currentState = null;
	}

	/**
	 * @param {string} state
	 * @param {Array<tube.services.StateManager.Item>} visibleItemList
	 */
	registerState(state, visibleItemList) {
		if (this.isStateRegistered(state)) {
			throw Error('State already registered');
		}
		this._stateMap[state] = visibleItemList;
	}

	/**
	 * @param {string} state
	 * @return {boolean}
	 */
	isStateRegistered(state) {
		return !!this._stateMap[state];
	}

	/**
	 * @param {?string} state
	 */
	setState(state) {
		const visibleItemList = (state && this.isStateRegistered(state)) ? this._stateMap[state] : [];

		this._itemList.forEach((item) => {
			this._setItemVisible(item, visibleItemList.indexOf(item) !== -1);
		});

		this._currentState = state;
	}

	/**
	 * @return {string|null}
	 */
	getState() {
		return this._currentState;
	}

	/**
	 * @param {tube.services.StateManager.Item} item
	 * @param {boolean} isItemVisible
	 * @private
	 */
	_setItemVisible(item, isItemVisible) {
		if (item instanceof Widget) {
			item.setVisible(isItemVisible);
		} else if (item instanceof HTMLElement) {
			html.showHide(item, isItemVisible);
		}
	}
};


/**
 * @typedef {HTMLElement|Widget}
 */
StateManager.Item;
