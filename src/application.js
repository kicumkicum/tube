import BaseApplication from 'generated/base-application';
import VideoList from './scenes/video-list/video-list';
import CategoryList from './scenes/category-list/category-list';
import Player from './scenes/player/player';
import PlayerService from './services/player';
import Navigation from './services/navigation';
import api from './api/api';
import * as html from 'zb/html';
import Throbber from 'ui/widgets/throbber/throbber';


/**
 */
export default class Application extends BaseApplication {
	/**
	 */
	constructor() {
		super();

    this.api = {
      video: api.video,
      popcorn: api.popcorn,
    };

    /**
     * @type {{
     *    navigation: Navigation,
     *    player: PlayerService,
     *    throbber: Throbber
     * }}
     */
    this.services;

    window.app = this;
	}

	/**
	 * @override
	 */
	onReady() {
    super.onReady();

    this.addScene(new CategoryList(this), 'category-list');
    this.addScene(new VideoList(this), 'video-list');
    this.addScene(new Player(this), 'player');

    const throbber = this._createThrobber();
    const sceneOpener = this.getSceneOpener();

    const navigation = new Navigation({
      categoryList: /** @type {CategoryList} */(this._layerManager.getLayer(`category-list`)),
      videoList: /** @type {VideoList} */(this._layerManager.getLayer(`video-list`)),
      player: /** @type {Player} */(this._layerManager.getLayer(`player`)),
    }, sceneOpener, this._layerManager,  throbber, this);

    this.services = {
      navigation: navigation,
      player: new PlayerService(this, this.device),
      throbber: throbber
    };

  }

	/**
	 * @override
	 */
	home() {
		this.clearHistory();

    return this.services.navigation.openCategoryList();
		// const homeScene = this.getLayerManager().getLayer('category-list');
		// return this.getSceneOpener().open(homeScene, () => {
		// 	// Set home scene data here
		// });
	}

	isDevice(deviceType) {
	  return this.device.info.type() === deviceType;
  }

	/**
	 * @override
	 */
	onStart() {
		this.home();
	}

  _createThrobber() {
    const throbberContainer = html.div('a-throbber zb-fullscreen');
    const throbber = new Throbber({
      step: 58,
      width: 1392
    });

    throbberContainer.appendChild(throbber.getContainer());
    this._body.appendChild(throbberContainer);

    throbber.on(throbber.EVENT_START, () => {
      html.show(throbberContainer);
    });

    throbber.on(throbber.EVENT_STOP, () => {
      html.hide(throbberContainer);
    });

    return throbber;
  }
}
