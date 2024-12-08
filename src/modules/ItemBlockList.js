import Utilities from '../Utilities';

class ItemBlockList {
	constructor(itemBlockConstructor, visualLimit, sourceRef, onSearch, overwriteList) {
		this.isInitialised = false;
		this.isThumbnailDisplay = false;
		this.isLimited = false;
		this.itemBlockConstructor = itemBlockConstructor;
		this.visualLimit = visualLimit;
		this.source = sourceRef;
		this.onSearchFn = onSearch;
		this.namesList = overwriteList ?? [];
		this.itemBlocks = [];
		this.sortedNamesList = [];
	}

	createItemBlock(name) {
		return this.itemBlockConstructor(
			this.source.basicItemConstructor(name),
			this.source.getItem.bind(this.source),
			this.onSearchFn,
			((current) => {
				// accordion behavior
				for(const itemBlock of this.itemBlocks) {
					if(itemBlock !== current) {
						itemBlock.collapseL2();
					}
				}
			}).bind(this),
		);
	}

	async addItemBlock(name, toTop) {
		let itemBlock = this.itemBlocks.find(block => block.getIdentifier() === name);
		if(!itemBlock) {
			itemBlock = this.createItemBlock(name);
			this.itemBlocks.push(itemBlock);
			await itemBlock.init(this.isThumbnailDisplay ? 1 : 0);
		}
		const itemBlockElement = itemBlock.getElementRef();
		let listItemElement = itemBlockElement.closest('li');
		if(listItemElement) {
			if(!toTop && listItemElement.parentElement === this.listElement) {
				return itemBlockElement;
			}
		} else {
			listItemElement = Utilities.createElementExt('li', [], {'data-title': Utilities.cleanString(name)});
			listItemElement.appendChild(itemBlockElement);
			if(!toTop) {
				this.listElement.append(listItemElement);
			}
		}
		if(toTop) {
			this.listElement.prepend(listItemElement);
		}
		return itemBlock;
	}

	async removeItemsFromBottom(num) {
		if(num <= 0 || !this.isInitialised) {
			return;
		}
		const listItems = Array.from(this.listElement.children);
		for(let i = 1; i <= num; i++) {
			Utilities.smoothRemove(this.listElement, listItems.at(i * -1));
			//TODO: remove from this.itemBlocks as well!!! (or maybe not necessary?)
		}
	}

	async fillContent(limit) {
		let count = 0;
		for(let name of this.namesList) {
			await this.addItemBlock(name, false);
			count++;
			if(limit && this.visualLimit && count >= this.visualLimit) {
				this.isLimited = true;
				if(this.showAllElement) {
					this.showAllElement.classList.remove('hidden');
				} else {
					this.showAllElement = Utilities.createElementExt('a', ItemBlockList.className+'__show-all', {}, 'show all');
					this.containerElement.appendChild(this.showAllElement);
					this.showAllElement.addEventListener('click', (e) => {
						e.preventDefault();
						Utilities.clearChildren(this.listElement);
						this.itemBlocks = [];
						this.fillContent();
						this.isLimited = false;
						e.target.classList.add('hidden');
					});
				}
				break;
			}
		}
	}

	async init(cacheOnly) {
		this.listElement = Utilities.createElementExt('ul');
		this.containerElement = Utilities.createElementExt('div', ItemBlockList.className);
		this.addToggleControl(); //will hide using CSS when not needed
		this.containerElement.appendChild(this.listElement);
		if(!this.namesList.length) {
			this.namesList = await this.source.getList(cacheOnly);
			this.sortedNamesList = this.namesList.map(n => n.toLowerCase()).toSorted().toReversed();
		}
		await this.fillContent(true);
		this.isInitialised = true;
	}

	addToggleControl() {
		const inputGroupElement = Utilities.createElementExt('div', [ItemBlockList.className + '__view-toggle', 'md-container']);
		const inputElement = Utilities.createElementExt('input', [], {type: 'checkbox'});
		inputGroupElement
			.appendChild(Utilities.createElementExt('label', 'input-wrapper-checkbox'))
			.append(inputElement, document.createTextNode('thumbnails'));
		inputElement.addEventListener('change', (e) => this.toggleThumbnails(e.currentTarget.checked));
		this.containerElement.appendChild(inputGroupElement);
	}

	async updateList() {
		this.namesList = await this.source.getList();
		this.sortedNamesList = this.namesList.map(n => n.toLowerCase()).toSorted().toReversed();
		// console.log('updateList()', this.namesList);
		
		Utilities.clearChildren(this.listElement);
		this.itemBlocks = [];
		await this.fillContent(true);
	}

	async toggleThumbnails(condition) {
		this.isThumbnailDisplay = condition;
		for(const ib of this.itemBlocks) {
			if(condition) {
				ib.expandL1();
			} else {
				ib.collapseL1();
			}
		}
	}

	async moveItemsToTop(searchstring) {
		if ((searchstring ?? '').trim() === '' || !this.listElement.isConnected) {
			return;
		}
		let anyMatch = false;
		for(let name of this.sortedNamesList.toSorted((a, b) => {
			const ia = a.indexOf(searchstring.toLowerCase());
			const ib = b.indexOf(searchstring.toLowerCase());
			const res1 = Math.sign((ib < 0 ? Infinity : ib) - (ia < 0 ? Infinity : ia));
			return res1 === 0 ? Number(a < b) : res1;
		})) {
			if(name.includes(searchstring.toLowerCase())) {
				anyMatch = true;
				await this.addItemBlock(name, true);
			}
		}
		if(anyMatch && this.isLimited && this.visualLimit && this.listElement.children.length > this.visualLimit) {
			this.removeItemsFromBottom(this.listElement.children.length - this.visualLimit);
		}
	}

	getElementRef() {
		return this.containerElement;
	}

	static className = 'items-list';
}

export default ItemBlockList;
