import { interactiveIcon } from '../components/common/common';
import Utilities from '../Utilities';

class ItemBlock {
	constructor(initialData, dataGetter, onSearch, onExpanded) {
		this.isInitialised = false;
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
				return Boolean(this.dataObj?.getThumbnailUrl());
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
		const srcObj = await this.dataGetter(this.initialData[this.identifierFieldName]);
		if(srcObj) { this.appendData(srcObj); };
	}

	async addThumbnail() {
		if(!this.isSufficientData(1)) {
			await this.loadAndAppendData();
		}
		const imgSrc = this.dataObj?.getThumbnailUrl();
		if(this.pictureElement) {
			if(!(this.pictureElement?.src)) {
				this.pictureElement.src = imgSrc;
				this.containerElement.classList.add(ItemBlock.className + '--preview');
			}
		} else {
			this.contentElement.prepend(Utilities.createElementExt('img', 'item-block__picture', {src: imgSrc}));
			this.containerElement.classList.add(ItemBlock.className + '--preview');
		}
	}

	removeThumbnail() {
		Utilities.smoothRemove(this.containerElement, this.pictureElement);
		this.containerElement.classList.remove(ItemBlock.className + '--preview');
	}

	async init() {
		this.containerElement = Utilities.createElementExt('div', ItemBlock.className, {'data-title': this.dataObj.title});
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
				this.searchButtonElement.addEventListener('click', this.expandL2);
			}
			this.containerElement.appendChild(buttonGroupElement);
		}
		const titleElement = Utilities.createElementExt('div', 'item-block__title', {}, this.dataObj.title);
		this.contentElement = Utilities.createElementExt('div', 'item-block__content');
		this.containerElement.append(titleElement);
		if (this.specificClassName) {
			this.containerElement.classList.add(this.specificClassName);
		}
		this.isInitialised = true;
	}

	expandL1() {
		
	}

	expandL2() {
		this.containerElement.classList.add(ItemBlock.className + '--expanded-2');
		this.expandButtonElement.querySelector('img').src = 'assets/circle-chevron-down-solid.svg';
		this.onExpanded();
	}

	collapseL1() {

	}

	collapseL2() {
		this.containerElement.classList.remove(ItemBlock.className + '--expanded-2');
		this.expandButtonElement.querySelector('img').src = 'assets/circle-info-solid.svg';
	}

	getElementRef() {
		return this.containerElement;
	}

	static className = 'item-block';
}

export default ItemBlock;
