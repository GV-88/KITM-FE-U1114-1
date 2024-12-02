import { interactiveIcon } from '../components/common/common';
import Utilities from '../Utilities';

class ItemBlock {
	constructor(initialData, dataGetter, onSearch, onExpanded) {
		this.isInitialised = false;
		this.currentExpandLevel = 0;
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
		// console.log(this.dataObj, srcObj);
		this.dataObj = Object.assign(this.dataObj, srcObj);
	}

	async loadAndAppendData() {
		// console.log('loadAndAppendData()', this.dataObj);
		console.log('loadAndAppendData()', this.dataGetter);
		const srcObj = await this.dataGetter(this.dataObj[this.identifierFieldName]);
		console.log('srcObj', srcObj);		
		if(srcObj) { this.appendData(srcObj); };
	}

	addPictureElement(source, overwrite) {
		const imgSrc = source;
		if(this.pictureElement) {
			if(!(this.pictureElement?.src) || overwrite) {
				this.pictureElement.src = imgSrc;
			}
		} else {
			this.pictureElement = Utilities.createElementExt('img', 'item-block__picture', {src: imgSrc});
		}
		if(!(this.pictureElement.isConnected)) {
			this.containerElement.prepend(this.pictureElement);
		}
	}

	removePictureElement() {
		Utilities.smoothRemove(this.containerElement, this.pictureElement);
	}

	async init(expandLevel) {
		if(expandLevel) {
			this.currentExpandLevel = expandLevel;
		}

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
				this.expandButtonElement.addEventListener('click', this.expandL2.bind(this), {once: true});
			}
			this.containerElement.appendChild(buttonGroupElement);
		}
		const titleElement = Utilities.createElementExt('div', 'item-block__title', {}, this.dataObj.title);
		// this.contentElement = Utilities.createElementExt('div', 'item-block__content');
		this.containerElement.append(titleElement);
		if (this.specificClassName) {
			this.containerElement.classList.add(this.specificClassName);
		}

		switch (this.currentExpandLevel) {
			case 1:
				this.expandL1();
				break;
			case 2:
				this.expandL2();
				break;
			default:
				break;
		}

		this.isInitialised = true;
	}

	// renderL1content

	async expandL1() {
		if(!this.isSufficientData(1)) {
			await this.loadAndAppendData();
		}
		this.currentExpandLevel = Math.max(this.currentExpandLevel, 1);
		this.containerElement.classList.add(ItemBlock.className + '--expanded-1');
		this.containerElement.classList.add(ItemBlock.className + '--preview'); //?
		this.addPictureElement(this.dataObj.getThumbnailUrl());
	}

	async expandL2() {
		if(!this.isSufficientData(2)) {
			await this.loadAndAppendData();
		}
		this.currentExpandLevel = 2;
		this.containerElement.classList.add(ItemBlock.className + '--expanded-2');
		this.expandButtonElement.querySelector('img').src = 'assets/circle-chevron-down-solid.svg';
		this.expandButtonElement.addEventListener('click', this.collapseL2.bind(this), {once: true});
		this.addPictureElement(this.dataObj.getImageUrl(), true);
		const parentElement = this.containerElement.closest('li');
		if(parentElement) {
			parentElement.classList.add('expanded');
		}
		this.onExpanded();
	}

	collapseL1() {
		this.containerElement.classList.remove(ItemBlock.className + '--expanded-1');
		this.containerElement.classList.remove(ItemBlock.className + '--preview'); //?
		if(!(this.containerElement.classList.contains(ItemBlock.className + '--expanded-2'))) {
			this.currentExpandLevel = 0;
			this.removePictureElement();
		}
	}

	collapseL2() {
		this.containerElement.classList.remove(ItemBlock.className + '--expanded-2');
		this.expandButtonElement.querySelector('img').src = 'assets/circle-info-solid.svg';
		this.expandButtonElement.addEventListener('click', this.expandL2.bind(this), {once: true});
		if(this.containerElement.classList.contains(ItemBlock.className + '--expanded-1')) {
			this.currentExpandLevel = 1;
		} else {
			this.currentExpandLevel = 0;
			this.removePictureElement();
		}
		const parentElement = this.containerElement.closest('li');
		if(parentElement) {
			parentElement.classList.remove('expanded');
		}
	}

	getElementRef() {
		return this.containerElement;
	}

	static className = 'item-block';
}

export default ItemBlock;
