import Keys from 'zb/device/input/keys';
import CutePopup from '../cute-popup/cute-popup';

export default class Base extends CutePopup {
	/**
	 * @override
	 */
	constructor() {
		super();

		this.on(this.EVENT_CLOSE, this._onClose.bind(this));
	}

	/**
	 * @param {tube.popups.Base.StatusHandler=} opt_statusHandler
	 * @return {IThenable<*>}
	 */
	toPromise(opt_statusHandler) {
		return new Promise((resolve, reject) => {
			this.once(this.EVENT_CLOSE, (eventName, status) => {
				if (opt_statusHandler) {
					opt_statusHandler(status, resolve, reject);
				} else {
					this._statusHandler(status, resolve, reject);
				}
			});
		});
	}

	/**
	 * @override
	 */
	_processKey(zbKey, e) {
		if (zbKey === Keys.BACK) {
			this.close(tube.popups.Base.Status.CANCELLED);
			return true;
		}

		return super._processKey(zbKey, e);
	}

	/**
	 * @param {string} eventName
	 * @param {*} status
	 * @protected
	 */
	_onClose(eventName, status) {
		// Do nothing. Method for overwrite
	}

	/**
	 * @param {*} status
	 * @param {function(*)} resolve
	 * @param {function(*)} reject
	 * @protected
	 */
	_statusHandler(status, resolve, reject) {
		switch (status) {
			case tube.popups.Base.Status.FAILED:
			case tube.popups.Base.Status.CANCELLED:
				reject(status);
				break;
			default:
				resolve(status);
				break;
		}
	}
};


/**
 * @enum {string}
 */
Base.Status = {
	SUCCEEDED: 'succeeded',
	FAILED: 'failed',
	CANCELLED: 'cancelled'
};


/**
 * @typedef {function(*, function(*), function(*))}
 */
Base.StatusHandler;
