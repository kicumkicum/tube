import Base from '../base/base';
import {In, Out, render} from 'generated/cutejs/tt/popups/simple/simple.jst';
import Layer from 'zb/layers/layer';
import {TemplateOptions} from 'cutejs-lib/cute-library';


export default class Simple extends Base {
	/**
	 * @override
	 */
	constructor(params) {
		super();

		/**
		 * @type {
		 *     function(In, TemplateOptions): Out
		 * }
		 * @protected
		 */
		this._template = render;

		/**
		 * @type {In}
		 * @protected
		 */
		this._templateIn = params;

		/**
		 * @type {Out}
		 * @protected
		 */
		this._templateOut;
	}

	/**
	 * @override
	 */
	_onRender() {
		super._onRender();

		this._addContainerClass('p-simple');

		this._templateOut.buttons.forEach((button) => {
			button.on(button.EVENT_CLICK, (eventName, data) => this.close(data.status));
		});
	}

	/**
	 * @param {Simple.Input} params
	 * @param {Layer=} opt_layer
	 * @return {Simple}
	 */
	static open(params, opt_layer) {
		const popup = new Simple(params);
		popup.render();

		(opt_layer || window.app).showChildLayerInstance(popup);

		return popup;
	}

	/**
	 * @param {Simple.Input} params
	 * @param {Layer=} opt_layer
	 * @param {Base.StatusHandler=} opt_statusHandler
	 * @return {IThenable<Base.Status>}
	 */
	static asPromise(params, opt_layer, opt_statusHandler) {
		const popup = Simple.open(params, opt_layer);

		return /** @type {IThenable<Base.Status>} */ (popup.toPromise(opt_statusHandler));
	}

	/**
	 * @param {Array<string>} title
	 * @param {string=} opt_okTitle
	 * @param {Array<string>=} opt_message
	 * @param {Layer=} opt_layer
	 * @return {IThenable<Base.Status>}
	 */
	static alert(title, opt_okTitle, opt_message, opt_layer) {
		/** @type {Simple.Input} */
		const params = {
			title: title,
			message: opt_message,
			buttons: [{
				title: opt_okTitle || 'OK',
				status: Base.Status.SUCCEEDED
			}]
		};

		return Simple.asPromise(params, opt_layer);
	}

	/**
	 * @param {Array<string>} title
	 * @param {string=} opt_yesTitle
	 * @param {string=} opt_noTitle
	 * @param {Array<string>=} opt_message
	 * @param {Layer=} opt_layer
	 * @return {IThenable<Base.Status>}
	 */
	static confirm(title, opt_yesTitle, opt_noTitle, opt_message, opt_layer) {
		/** @type {Simple.Input} */
		const params = {
			title: title,
			message: opt_message,
			buttons: [{
				title: opt_yesTitle || 'Yes',
				status: Base.Status.SUCCEEDED
			}, {
				title: opt_noTitle || 'No',
				status: Base.Status.CANCELLED
			}]
		};

		return Simple.asPromise(params, opt_layer);
	}
};


/**
 * @typedef {{
 *     title: string,
 *     status: Base.Status
 * }}
 */
Simple.Button;


/**
 * @typedef {{
 *     title: Array<string>,
 *     message: (Array<string>|undefined),
 *     buttons: Array<Simple.Button>
 * }}
 */
Simple.Input;
