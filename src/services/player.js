import AbstractPlayer from './abstract-player';
import IDevice from 'zb/device/interfaces/i-device';
import IVideo, {State} from 'zb/device/interfaces/i-video';
import IViewPort from 'zb/device/interfaces/i-view-port';
import {AspectRatio, Transferring} from 'zb/device/aspect-ratio/aspect-ratio';
import {Common} from 'zb/device/aspect-ratio/proportion';
import Keys from 'zb/device/input/keys';
import Rect from 'zb/geometry/rect';

export default class Player extends AbstractPlayer {
	/**
	 * @param {tube.Application} app
	 * @param {IDevice} device
	 */
	constructor(app, device) {
		const player = device.createVideo(Rect.createByClientRect(app.getBody().getBoundingClientRect()));
		super(player);

		/**
		 * @type {tube.Application}
		 * @private
		 */
		this._app = app;

		/**
		 * @type {IViewPort}
		 * @private
		 */
		this._viewport = player.getViewport();
		this._viewport.setFullScreen(true);

		/**
		 * @type {Array<AspectRatio>}
		 * @private
		 */
		this._aspectRatioList = this._createAspectRatioList();

		if (this._aspectRatioList.length) {
			this.on(this.EVENT_LOADED_META_DATA, () => {
				this._viewport.setAspectRatio(this._aspectRatioList[0]);
			});
		}
	}

	/**
	 * @param {boolean} isVisible
	 */
	setVisible(isVisible) {
		if (isVisible) {
			this._app.showVideo();
		} else {
			this._app.hideVideo();
		}
	}

	/**
	 */
	show() {
		this.setVisible(true);
	}

	/**
	 */
	hide() {
		this.setVisible(false);
	}

	/**
	 * @param {Keys} zbKey
	 * @param {(KeyboardEvent|WheelEvent)=} opt_e
	 * @return {boolean}
	 */
	processKey(zbKey, opt_e) {
		const keys = Keys;

		switch (zbKey) {
			case keys.PLAY:
			case keys.PAUSE:
			case keys.PLAY_PAUSE:
				this.togglePlayPause();
				return true;
			case keys.VOLUME_DOWN:
				return this._volumeDown();
			case keys.VOLUME_UP:
				return this._volumeUp();
			case keys.MUTE:
				return this._toggleMuted();
			default:
				return false;
		}
	}

	/**
	 */
	togglePlayPause() {
		switch (this.getState()) {
			case State.PAUSED:
			case State.STOPPED:
				this.resume();
				break;
			case State.PLAYING:
			case State.SEEKING:
				this.pause();
				break;
		}
	}

	/**
	 */
	toggleAspectRatio() {
		if (this._viewport.hasAspectRatioFeature()) {
			this._viewport.toggleAspectRatio(this._aspectRatioList);
		}
	}

	/**
	 * @return {Array<AspectRatio>}
	 * @private
	 */
	_createAspectRatioList() {
		const Proportion = Common;

		return [
				new AspectRatio(Proportion.AUTO, Transferring.LETTERBOX),
				new AspectRatio(Proportion.AUTO, Transferring.STRETCH),
				new AspectRatio(Proportion.X16X9, Transferring.LETTERBOX),
				new AspectRatio(Proportion.X4X3, Transferring.LETTERBOX)
			]
			.filter((ratio) => this._viewport.isAspectRatioSupported(ratio));
	}

	/**
	 * @return {boolean}
	 * @private
	 */
	_volumeDown() {
		if (this._app.isDeviceSamsung()) {
			return false;
		}

		this.volumeDown();
		return true;
	}

	/**
	 * @return {boolean}
	 * @private
	 */
	_volumeUp() {
		if (this._app.isDeviceSamsung()) {
			return false;
		}

		this.volumeUp();
		return true;
	}

	/**
	 * @return {boolean}
	 * @private
	 */
	_toggleMuted() {
		if (this._app.isDeviceSamsung()) {
			return false;
		}

		this.setMuted(!this.getMuted());
		return true;
	}
};
