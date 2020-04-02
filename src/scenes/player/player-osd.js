import Player from '../../services/player';
import StateManager from '../../services/state-manager';
import PlayerProgress from '../../widgets/player-progress/player-progress';
import Timeout from 'zb/timeout';
import IVideo from 'zb/device/interfaces/i-video';
import Keys from 'zb/device/input/keys';
import EventPublisher from 'zb/events/event-publisher';


export default class PlayerOsd extends EventPublisher {
	/**
	 * @override
	 * @param {PlayerOsd.ItemMap} itemMap
	 */
	constructor(itemMap) {
		super();

		/**
		 * @const {number}
		 */
		this.CONTROLS_SHOW_TIME = 5 * 1000;

		/**
		 * Fired with: {?PlayerOsd.State} newState, {?PlayerOsd.State} oldState
		 * @const {string}
		 */
		this.EVENT_STATE_CHANGED = 'state-changed';

		/**
		 * @type {StateManager}
		 * @private
		 */
		this._stateManager = this._createStateManager(itemMap);
		this._setState(null);

		/**
		 * @type {Timeout}
		 * @private
		 */
		this._controlsTimer = new Timeout(this.hideControls.bind(this), this.CONTROLS_SHOW_TIME);

		/**
		 * @type {?Player}
		 * @private
		 */
		this._player = null;

		this._onPlayerStateChange = this._onPlayerStateChange.bind(this);
		this.on(this.EVENT_STATE_CHANGED, this._onOsdStateChanged.bind(this));
	}

	/**
	 */
	beforeDOMShow() {
		this.showControls();
	}

	/**
	 */
	afterDOMHide() {
		this.hideControls();
	}

	/**
	 * @param {Keys} zbKey
	 * @param {KeyboardEvent|WheelEvent=} opt_e
	 * @return {boolean} True if Key handled, false if not
	 */
	processKey(zbKey, opt_e) {
		const keys = Keys;

		if (this._isControlsVisible() || this._isEmpty()) {
			const isEnter = zbKey === keys.ENTER;
			const isUp = zbKey === keys.UP;
			const isDown = zbKey === keys.DOWN;
			const isLeft = zbKey === keys.LEFT;
			const isRight = zbKey === keys.RIGHT;
			const isNavigation = isUp || isDown || isLeft || isRight;
			const isOnlyControlsShow = this._isEmpty() && (isEnter || isNavigation);

			this.showControls();

			return isOnlyControlsShow;
		}

		return false;
	}

	/**
	 * @param {?Player} player
	 */
	setPlayer(player) {
		if (this._player) {
			this._player.off(this._player.EVENT_PLAY, this._onPlayerStateChange);
			this._player.off(this._player.EVENT_PAUSE, this._onPlayerStateChange);
			this._player.off(this._player.EVENT_STOP, this._onPlayerStateChange);
			this._player.off(this._player.EVENT_ENDED, this._onPlayerStateChange);
		}

		this._player = player;

		if (this._player) {
			this._player.on(this._player.EVENT_PLAY, this._onPlayerStateChange);
			this._player.on(this._player.EVENT_PAUSE, this._onPlayerStateChange);
			this._player.on(this._player.EVENT_STOP, this._onPlayerStateChange);
			this._player.on(this._player.EVENT_ENDED, this._onPlayerStateChange);
		}
	}

	/**
	 */
	showControls() {
		switch (this._getPlayerState()) {
			case IVideo.State.INITED:
			case IVideo.State.UNINITED:
			case IVideo.State.DEINITED:
			case IVideo.State.PAUSED:
			case IVideo.State.STOPPED:
			case IVideo.State.ERROR:
			case null:
				this._controlsTimer.stop();
				break;
			default:
				this._controlsTimer.restart();
				break;
		}

		this._setState(PlayerOsd.State.CONTROLS);
	}

	/**
	 */
	hideControls() {
		this._setState(null);
	}

	/**
	 * @param {PlayerOsd.ItemMap} itemMap
	 * @return {StateManager}
	 * @private
	 */
	_createStateManager(itemMap) {
		const itemList = Object.keys(itemMap).map((key) => itemMap[key]);

		const stateManager = new StateManager(itemList);

		stateManager.registerState(PlayerOsd.State.CONTROLS, [
			itemMap.title,
			itemMap.shadow,
			itemMap.progress,
			itemMap.helpBar
		]);

		return stateManager;
	}

	/**
	 * @param {?PlayerOsd.State} newState
	 * @private
	 */
	_setState(newState) {
		const oldState = this._stateManager.getState();

		if (newState === oldState) {
			return;
		}

    this._stateManager.setState(newState);
    this._fireEvent(this.EVENT_STATE_CHANGED, newState, oldState);
	}

	/**
	 * @return {boolean}
	 * @private
	 */
	_isControlsVisible() {
		return this._stateManager.getState() === PlayerOsd.State.CONTROLS;
	}

	/**
	 * @return {boolean}
	 * @private
	 */
	_isEmpty() {
		return this._stateManager.getState() === null;
	}

	/**
	 * @return {IVideo.State|null}
	 * @private
	 */
	_getPlayerState() {
		return this._player ? this._player.getState() : null;
	}

	/**
	 * @private
	 */
	_onPlayerStateChange() {
		switch (this._getPlayerState()) {
			case IVideo.State.INITED:
			case IVideo.State.UNINITED:
			case IVideo.State.DEINITED:
			case IVideo.State.PLAYING:
			case IVideo.State.PAUSED:
			case IVideo.State.STOPPED:
			case IVideo.State.ERROR:
				if (this._isControlsVisible() || this._isEmpty()) {
					this.showControls();
				}
				break;
		}
	}

	/**
	 * @param {string} eventName
	 * @param {PlayerOsd.State|null} newState
	 * @param {PlayerOsd.State|null} oldState
	 * @private
	 */
	_onOsdStateChanged(eventName, newState, oldState) {
		if (oldState === PlayerOsd.State.CONTROLS) {
			this._controlsTimer.stop();
		}
	}
};


/**
 * @enum {string}
 */
PlayerOsd.State = {
	CONTROLS: 'controls'
};


/**
 * @typedef {{
 *     title: HTMLElement,
 *     shadow: HTMLElement,
 *     progress: PlayerProgress,
 *     helpBar: HTMLElement
 * }}
 */
PlayerOsd.ItemMap;
