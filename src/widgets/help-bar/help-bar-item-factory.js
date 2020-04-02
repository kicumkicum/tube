import Keys from 'zb/device/input/keys';
import HelpBarItem, {Options} from "ui/widgets/help-bar/help-bar-item";

export const helpBarItemFactory = {
  /**
   * @param {Options} options
   * @param {function()=} opt_callback
   * @return {HelpBarItem}
   */
  item(options, opt_callback) {
		const item = new HelpBarItem(options);

		if (typeof opt_callback === 'function') {
			item.on(item.EVENT_CLICK, opt_callback);
		}

		return item;
	},
	/**
	 * @param {string} label
	 * @param {function()=} opt_callback
	 * @return {HelpBarItem}
	 */
	red(label, opt_callback) {
		const options = {
			cssClass: '_red',
			label: label,
			keys: [Keys.RED]
		};

		return helpBarItemFactory.item(options, opt_callback);
	},


	/**
	 * @param {string} label
	 * @param {function()=} opt_callback
	 * @return {HelpBarItem}
	 */
	green(label, opt_callback) {
		const options = {
			cssClass: '_green',
			label: label,
			keys: [Keys.GREEN]
		};

		return helpBarItemFactory.item(options, opt_callback);
	},


	/**
	 * @param {string} label
	 * @param {function()=} opt_callback
	 * @return {HelpBarItem}
	 */
	yellow(label, opt_callback) {
		const options = {
			cssClass: '_yellow',
			label: label,
			keys: [Keys.YELLOW]
		};

		return helpBarItemFactory.item(options, opt_callback);
	},


	/**
	 * @param {string} label
	 * @param {function()=} opt_callback
	 * @return {HelpBarItem}
	 */
	blue(label, opt_callback) {
		const options = {
			cssClass: '_blue',
			label: label,
			keys: [Keys.BLUE]
		};

		return helpBarItemFactory.item(options, opt_callback);
	},


	/**
	 * @param {string} label
	 * @param {function()=} opt_callback
	 * @return {HelpBarItem}
	 */
	play(label, opt_callback) {
		const options = {
			cssClass: '_play',
			label: label,
			keys: [Keys.PLAY]
		};

		return helpBarItemFactory.item(options, opt_callback);
	},


	/**
	 * @param {string} label
	 * @param {function()=} opt_callback
	 * @return {HelpBarItem}
	 */
	pause(label, opt_callback) {
		const options = {
			cssClass: '_pause',
			label: label,
			keys: [Keys.PAUSE]
		};

		return helpBarItemFactory.item(options, opt_callback);
	},


	/**
	 * @param {string} label
	 * @param {function()=} opt_callback
	 * @return {HelpBarItem}
	 */
	back(label, opt_callback) {
		const options = {
			cssClass: '_back',
			label: label,
			keys: [Keys.BACK, Keys.EXIT]
		};

		return helpBarItemFactory.item(options, opt_callback /*|| app.back.bind(app)*/);
	},
};
