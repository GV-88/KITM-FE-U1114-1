import Utilities from '../Utilities';

class ItemBlockList {
	constructor(itemBlockConstructor, sourceRef, onSearch, overwriteList) {
		this.isInitialised = false;
		this.itemBlockConstructor = itemBlockConstructor;
		this.source = sourceRef;
		this.onSearchFn = onSearch;
		this.namesList = overwriteList ?? [];
	}

	async fillContent() {
		for(let name of this.namesList) {
			const itemBlock = this.itemBlockConstructor(
				this.source.basicItemConstructor(name),
				this.source.getItem,
				(q) => {
					console.log('search', q);
					this.onSearchFn(q);
				},
				() => {console.log('onExpanded', name); },
			);
			await itemBlock.init();
			this.listElement.appendChild(Utilities.createElementExt('li'))
				.appendChild(itemBlock.getElementRef());
		}
	}

	async init(cacheOnly) {
		this.listElement = Utilities.createElementExt('ul', ItemBlockList.className);
		if(!this.namesList.length) {
			this.namesList = await this.source.getList(cacheOnly);
		}
		await this.fillContent();
		this.isInitialised = true;
	}

	async updateList() {
		this.namesList = await this.source.getList();
		Utilities.clearChildren(this.listElement);
		await this.fillContent();
	}

	getElementRef() {
		return this.listElement;
	}

	static className = 'items-list';
}

export default ItemBlockList;
