import Utilities from '../Utilities';

class ItemBlockList {
	constructor(itemBlockConstructor, sourceRef, onSearch, overwriteList) {
		this.isInitialised = false;
		this.isThumbnailDisplay = false;
		this.itemBlockConstructor = itemBlockConstructor;
		this.source = sourceRef;
		this.onSearchFn = onSearch;
		this.namesList = overwriteList ?? [];
		this.itemBlocks = [];
	}

	async fillContent() {
		for(let name of this.namesList) {
			const itemBlock = this.itemBlockConstructor(
				this.source.basicItemConstructor(name),
				this.source.getItem.bind(this.source),
				(q) => {
					this.onSearchFn(q);
				},
				() => {
					console.log('onExpanded', name);
				},
			);
			this.itemBlocks.push(itemBlock);
			await itemBlock.init(this.isThumbnailDisplay ? 1 : 0);
			this.listElement.appendChild(Utilities.createElementExt('li'))
				.appendChild(itemBlock.getElementRef());
		}
	}

	async init(cacheOnly) {
		this.listElement = Utilities.createElementExt('ul');
		this.containerElement = Utilities.createElementExt('div', ItemBlockList.className);
		this.addToggleControl(); //will hide using CSS when not needed
		this.containerElement.appendChild(this.listElement);
		if(!this.namesList.length) {
			this.namesList = await this.source.getList(cacheOnly);
		}
		await this.fillContent();
		this.isInitialised = true;
	}

	addToggleControl() {
		const inputGroupElement = Utilities.createElementExt('div', ItemBlockList.className + '__view-toggle');
		const inputElement = Utilities.createElementExt('input', [], {type: 'checkbox'});
		inputGroupElement
			.appendChild(Utilities.createElementExt('label'))
			.append(inputElement, document.createTextNode('thumbnails'));
		inputElement.addEventListener('change', (e) => this.toggleThumbnails(e.currentTarget.checked));
		this.containerElement.appendChild(inputGroupElement);
	}

	async updateList() {
		this.namesList = await this.source.getList();
		// console.log('updateList()', this.namesList);
		
		Utilities.clearChildren(this.listElement);
		this.itemBlocks = [];
		await this.fillContent();
	}

	async toggleThumbnails(condition) {
		for(const ib of this.itemBlocks) {
			if(condition) {
				ib.expandL1();
			} else {
				ib.collapseL1();
			}
		}
	}

	getElementRef() {
		return this.containerElement;
	}

	static className = 'items-list';
}

export default ItemBlockList;