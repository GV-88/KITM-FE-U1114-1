import { interactiveIcon } from '../components/common/common';
import Utilities from '../Utilities';
import IconSearch from '../assets/search.svg';
import IconCircleInfo from '../assets/circle-info-solid.svg';
import IconCircleChevronRight from '../assets/circle-chevron-right-solid.svg';

class ItemBlock {
	constructor(initialData, dataGetter, onSearch, onExpanded) {
		this.isInitialised = false;
		this.isPreview = 0;
		this.isExpanded = 0;
		this.dataObj = initialData;
		this.dataGetter = dataGetter;
		this.onSearch = onSearch;
		this.onExpanded = onExpanded;
	}

	availableActions = ['search', 'expand'];

	identifierFieldName = 'title';

	searchQueryFieldName = undefined;

	specificClassName = undefined;

	getIdentifier() {
		return this.dataObj?.title;
	}

	isSufficientData(level) {
		switch (level) {
			case 1:
				return Boolean(this.dataObj.getThumbnailUrl());
			case 2:
				return true;
			default:
				return true;
		}
	}

	appendData(srcObj) {
		this.dataObj = Object.assign(this.dataObj, srcObj);
	}

	async loadAndAppendData() {
		const srcObj = await this.dataGetter(this.dataObj[this.identifierFieldName]);
		if(srcObj) {
			this.appendData(srcObj);
			if(this.isInitialised) {
				this.titleElement.innerText = this.dataObj.title;
			}
		};
	}

	searchHandler() {
		if(typeof this.onSearch === 'function') {
			this.onSearch({ [this.searchQueryFieldName]: this.dataObj[this.identifierFieldName] }, this.dataObj.title);
		}
	};

	async init(expandLevel) {
		this.containerElement = Utilities.createElementExt('div', ItemBlock.className, {'data-title': Utilities.cleanString(this.dataObj.title)});
		await this.addInitialContent();
		if (this.specificClassName) {
			this.containerElement.classList.add(this.specificClassName);
		}
		if(expandLevel === 1) {
			await this.expandL1();
		}
		if(expandLevel === 2) {
			await this.expandL2();
		}
		this.isInitialised = true;
	}

	addPictureElement(parentElement, source, overwrite) {
		const imgSrc = source;
		if(this.pictureElement) {
			if(!(this.pictureElement?.src) || overwrite) {
				this.pictureElement.src = imgSrc;
			}
		} else {
			this.pictureElement = Utilities.createElementExt('img', ItemBlock.className+'__picture', {src: imgSrc});
		}
		if(!(this.pictureElement.isConnected) || this.pictureElement.parentElement !== parentElement) {
			parentElement.appendChild(this.pictureElement);
		}
	}

	removePictureElement(parentElement) {
		Utilities.smoothRemove(parentElement, this.pictureElement);
	}

	addSearchLink(parentElement) {
		const searchLinkWrapperElement = Utilities.createElementExt('label', ItemBlock.className+'__search-link');
		searchLinkWrapperElement.append(
			interactiveIcon(IconSearch),
			'List related meals'
		);
		parentElement.appendChild(searchLinkWrapperElement);
		searchLinkWrapperElement.addEventListener('click', this.searchHandler.bind(this));
	}

	removeSearchLink(parentElement) {
		Utilities.smoothRemove(parentElement, parentElement.querySelector(`.${ItemBlock.className}__search-link`));
	}

	async addInitialContent() {
		if(this.availableActions?.length ?? 0 > 0) {
			const buttonGroupElement = Utilities.createElementExt('div', ItemBlock.className+'__button-group');
			if(this.availableActions.includes('search')) {
				this.searchButtonElement = interactiveIcon(IconSearch);
				this.searchButtonElement.title = 'list meals';
				buttonGroupElement.appendChild(this.searchButtonElement);
				this.searchButtonElement.addEventListener('click', this.searchHandler.bind(this));
			}
			if(this.availableActions.includes('expand')) {
				this.expandButtonElement = interactiveIcon(IconCircleInfo);
				this.expandButtonElement.classList.add('interactive-icon--toggle-panel');
				this.expandButtonElement.title = 'more about this item';
				buttonGroupElement.appendChild(this.expandButtonElement);
				this.expandButtonElement.addEventListener('click', this.expandL2.bind(this), {once: true});
			}
			this.containerElement.appendChild(buttonGroupElement);
		}
		this.titleElement = Utilities.createElementExt('div', 'item-block__title', {}, this.dataObj.title);
		this.containerElement.append(this.titleElement);
	}

	async addPreviewContent() {
		this.addPictureElement(this.containerElement, this.dataObj.getThumbnailUrl());
	}

	async removePreviewContent() {
		if(!(this.isExpanded)) {
			this.removePictureElement(this.containerElement);
		}
	}

	async addFullContent() {
		this.addPictureElement(this.containerElement, this.dataObj.getImageUrl(), true);
	}

	async removeFullContent() {
		if(!this.isPreview) {
			this.removePictureElement(this.containerElement);
		}
	}

	async expandL1() {
		if(!this.isSufficientData(1)) {
			await this.loadAndAppendData();
		}
		if(!this.isSufficientData(1)) {
			console.log(`insufficient data for ${this.dataObj.title}`);
			return;
		}
		await this.addPreviewContent();
		this.containerElement.classList.add(ItemBlock.className + '--preview');
		this.isPreview = true;
	}

	async expandL2() {
		if(this.isExpanded) {
			return;
		}
		if(!this.isSufficientData(2)) {
			await this.loadAndAppendData();
		}
		if(!this.isSufficientData(2)) {
			console.log(`insufficient data for ${this.dataObj.title}`);
			// return;
			/* very interesting case with ingredients:
			when we don't have the description data with initial lazy load, this signals a need to request it;
			but then if successful request proves there is no description data, then it's OK, we can still show what we have
			*/
		}
		await this.addFullContent();
		this.containerElement.classList.add(ItemBlock.className + '--expanded');
		if(this.expandButtonElement) {
			this.expandButtonElement.querySelector('img').src = IconCircleChevronRight; //CSS transforms to expanded state
			this.expandButtonElement.title = 'collapse panel';
			this.expandButtonElement.addEventListener('click', this.collapseL2.bind(this), {once: true});
		}
		const parentElement = this.containerElement.closest('li');
		if(parentElement) {
			parentElement.classList.add('expanded');
		}
		this.isExpanded = true;
		setTimeout(() => {
			Utilities.scrollIntoViewIfNeeded(this.containerElement);
		}, 250);
		if(typeof this.onExpanded === 'function') {
			this.onExpanded(this);
		}
	}

	async collapseL1() {
		await this.removePreviewContent();
		this.containerElement.classList.remove(ItemBlock.className + '--preview');
		this.isPreview = false;
	}

	async collapseL2() {
		if(!this.isExpanded) {
			return;
		}
		await this.removeFullContent();
		this.containerElement.classList.remove(ItemBlock.className + '--expanded');
		if(this.expandButtonElement) {
			this.expandButtonElement.querySelector('img').src = IconCircleInfo;
			this.expandButtonElement.title = 'more about this item';
			this.expandButtonElement.addEventListener('click', this.expandL2.bind(this), {once: true});
		}
		const parentElement = this.containerElement.closest('li');
		if(parentElement) {
			parentElement.classList.remove('expanded');
		}
		this.isExpanded = false;
	}

	getElementRef() {
		return this.containerElement;
	}

	static className = 'item-block';
}

export default ItemBlock;
