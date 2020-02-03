import Video from './common/video';
import IVideo from './i-video';
import PopcornVideo from "./popcorn/video";
import RutorVideo from "./rutor/video";

export default {
  /**
   * @type {IVideo}
   */
  video: new Video(),
  popcorn: new PopcornVideo(),
};
