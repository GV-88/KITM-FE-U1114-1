import { interactiveIcon } from '../components/common/common';
import Utilities from '../Utilities';

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
		if(srcObj) { this.appendData(srcObj); };
	}

	async init(expandLevel) {
		this.containerElement = Utilities.createElementExt('div', ItemBlock.className, {'data-title': this.dataObj.title});
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
			this.pictureElement = Utilities.createElementExt('img', 'item-block__picture', {src: imgSrc});
		}
		if(!(this.pictureElement.isConnected) || this.pictureElement.parentElement !== parentElement) {
			parentElement.prepend(this.pictureElement);
		}
	}

	removePictureElement(parentElement) {
		Utilities.smoothRemove(parentElement, this.pictureElement);
	}

	async addInitialContent() {
		if(this.availableActions?.length ?? 0 > 0) {
			const buttonGroupElement = Utilities.createElementExt('div', 'item-block__button-group');
			if(this.availableActions.includes('search')) {
				this.searchButtonElement = interactiveIcon('assets/search.svg');
				this.searchButtonElement.title = 'list meals';
				buttonGroupElement.appendChild(this.searchButtonElement);
				this.searchButtonElement.addEventListener('click', () => {
					this.onSearch({[this.searchQueryFieldName]: this.dataObj[this.identifierFieldName] });
				});
			}
			if(this.availableActions.includes('expand')) {
				this.expandButtonElement = interactiveIcon('assets/circle-info-solid.svg');
				this.expandButtonElement.title = 'more about this item';
				buttonGroupElement.appendChild(this.expandButtonElement);
				this.expandButtonElement.addEventListener('click', this.expandL2.bind(this), {once: true});
			}
			this.containerElement.appendChild(buttonGroupElement);
		}
		const titleElement = Utilities.createElementExt('div', 'item-block__title', {}, this.dataObj.title);
		this.containerElement.append(titleElement);
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
		await this.addPreviewContent();
		this.containerElement.classList.add(ItemBlock.className + '--preview');
		this.isPreview = true;
	}

	async expandL2() {
		if(!this.isSufficientData(2)) {
			await this.loadAndAppendData();
		}
		await this.addFullContent();
		this.containerElement.classList.add(ItemBlock.className + '--expanded');
		if(this.expandButtonElement) {
			this.expandButtonElement.querySelector('img').src = 'assets/circle-chevron-down-solid.svg';
			this.expandButtonElement.addEventListener('click', this.collapseL2.bind(this), {once: true});
		}
		const parentElement = this.containerElement.closest('li');
		if(parentElement) {
			parentElement.classList.add('expanded');
		}
		this.isExpanded = true;
		this.onExpanded();
	}

	async collapseL1() {
		await this.removePreviewContent();
		this.containerElement.classList.remove(ItemBlock.className + '--preview');
		this.isPreview = false;
	}

	async collapseL2() {
		await this.removeFullContent();
		this.containerElement.classList.remove(ItemBlock.className + '--expanded');
		if(this.expandButtonElement) {
			this.expandButtonElement.querySelector('img').src = 'assets/circle-info-solid.svg';
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
