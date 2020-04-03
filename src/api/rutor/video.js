import Transport from './transport';
import Category from '../../models/category'
import Video from '../../models/video'


/**
 * @implements {tube.api.IVideo}
 */
export default class RutorVideo {
	/**
	 */
	constructor() {
		/**
		 * @type {tube.api.popcorn.Transport}
		 * @private
		 */
		this._transport = new Transport();

		/**
		 * @type {Array<Category>}
		 * @private
		 */
		this._categoryList = [];
	}

	/**
	 * @override
	 */
	getCategoryList() {
		if (this._categoryList.length) {
			return /** @type {Promise<Array<Category>>} */ (Promise.resolve(this._categoryList));
		}


		this._transport.requestRaw(`categories/`)
			.then((body) => console.log(body));

		const categoryArray = [
			'action',
			'adventure',
			'animation',
			'comedy',
			'crime',
			'disaster',
			'documentary',
			'drama',
			'eastern',
			'family',
			'fan-film',
			'fantasy',
			'film-noir',
			'history',
			'holiday',
			'horror',
			'indie',
			'music',
			'mystery',
			'none',
			'road',
			'romance',
			'science-fiction',
			'short',
			'sports',
			'sporting-event',
			'suspense',
			'thriller',
			'tv-movie',
			'war',
			'western'
		];

		this._categoryList = categoryArray.map((categoryId) => {
			let categoryTitle = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
			categoryTitle = categoryTitle.replace(/-/g, ' ');

			return Category.fromData({
				id: categoryId,
				title: categoryTitle
			});
		});

		return /** @type {Promise<Array<Category>>} */ (Promise.resolve(this._categoryList));
	}

	/**
	 * @override
	 */
	getVideoList(category, offset, limit) {
		debugger
		const PAGE_SIZE = 50;
		const pageOffset = Math.floor(offset / PAGE_SIZE);
		const pageLimit = Math.ceil((offset + limit) / PAGE_SIZE) - pageOffset;

		let queue = Promise.resolve([]);
		const categoryId = category.id;

		for (let page = pageOffset + 1; page <= pageLimit; page++) {
			queue = queue.then((videoList) => {
				return this
					._getVideoListPage(page + pageOffset, categoryId)
					.then((part) => videoList.concat(part));
			});
		}

		return queue.then((videoList) => {
			return videoList
				.splice(offset - pageOffset * PAGE_SIZE, limit)
				.map((video) => {
					const videoMagnet = this._getVideoMagnet(video['torrents']);
					const extendFunction = () => {
						debugger
						return Promise.resolve()
							.then(() => {
                return this._transport
                  .request(`rutor/search/${video.title}`)
                  .then((items) => {
                    return items[0].src;
                  });
							})
							.then((videoMagnet) => this._getVideoUrl(videoMagnet))
							.then((videoUrl) => ({
								videoUrl: videoUrl
							}));
					};

					return Video.fromData({
						id: video['_id'],
						title: video['title'],
						coverUrl: (video['images'] && video['images']['poster']) || undefined
					}, extendFunction);
				});
		});
	}

	/**
	 * @param {number} page
	 * @param {string} categoryId
	 * @return {Promise<Array<Object>>}
	 * @private
	 */
	_getVideoListPage(page, categoryId) {
		return this._transport
			.request(`popcorn/movies/${page}`, {
				// 'sort': 'last added',
				// 'order': 1,
				'genre': categoryId
			})
			.then(null, () => []);
	}

	/**
	 * @param {Object} torrents
	 * @return {string}
	 * @private
	 */
	_getVideoMagnet(torrents) {
		// TODO: select required quality
		return torrents['en'] &&
      torrents['en']['720p'] &&
      torrents['en']['720p']['url'] &&
      torrents['en']['720p']['url'].split('&')[0];
	}

	/**
	 * @param {string} magnet
	 * @return {Promise<string>}
	 * @private
	 */
	_getVideoUrl(magnet) {

    // func(HASH, (file) => {
    //   const filePath = encodeURIComponent(file.path);
    //   const video = document.createElement(`video`);
    //   video.style.height = `300px`;
    //   video.style.width = `300px`;
    //   video.setAttribute(`controls`, `true`);
    //   video.innerHTML = `<source src="${`/download/${HASH}/${filePath}`}" type="video/mp4">`
    //   document.body.appendChild(video);
    //
    //   setTimeout(() => video.play(), 3000);
    //
    // });

		const hash = magnet.replace(`magnet:?xt=urn:btih:`, ``);
		// const hash = `1b66a51bec5defc0147b9df468a2add8e0987052`;

    return this._transport
      .request(`getMetadata/${hash}`)
      .then((response) => {
        const files = response['files'];
        const file = files.find((it) => it.path.endsWith(`.mp4`));
        if (!file) {
        	return Promise.reject();
				}

        return `${this._transport._baseUrl}download2/${hash}/${encodeURIComponent(file.path)}`
      });
    //
		return Promise.resolve(`http://vs.ifaced.ru/streams/bbb/bbb.mp4`);
		return this._transport
			.request(`load/${encodeURIComponent(magnet)}`, {})
			.then((response) => response['url']);
	}
};

const func = (hash, onclick) => {
  const createList = (files) => {
    const li = window.document.createElement('ul');
    files.forEach((file) => {
      const ul = window.document.createElement('li');
      ul.textContent = file.path;
      ul.addEventListener('click', () => {
        onclick(file);
      });

      li.appendChild(ul);
      document.body.appendChild(li);
    });
  };

  fetch(`/getMetadata/${hash}`)
    .then((response) => response.json())
    .then((response) => {
      const files = response['files'];
      return createList(files);
    })
    .catch((err) => console.error(err));
};
