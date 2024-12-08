import Utilities from '../Utilities';
import ItemBlock from './ItemBlock';

class ItemBlockMealCategory extends ItemBlock {
	constructor(initialData, dataGetter, onSearch, onExpanded) {
		super(initialData, dataGetter, onSearch, onExpanded);
	}

	availableActions = ['search', 'expand'];

	identifierFieldName = 'title';

	searchQueryFieldName = 'category';

	specificClassName = 'item-block--category';

	isSufficientData(level) {
		switch (level) {
			case 1:
				return Boolean(this.dataObj.getThumbnailUrl());
			case 2:
				return Boolean(this.dataObj?.strCategoryDescription);
			default:
				return true;
		}
	}

	async addFullContent() {
		await super.addFullContent();
		//not very wise to construct strings every time, maybe should keep parsed array of strings in data object
		this.containerElement.append(...(Utilities.stringToParagraphs(this.dataObj.strCategoryDescription, ItemBlock.className + '__description')));
		super.addSearchLink(this.containerElement);
	}

	removeFullContent() {
		super.removeFullContent();
		this.containerElement.querySelectorAll('.' + ItemBlock.className + '__description').forEach(el => this.containerElement.removeChild(el));
		super.removeSearchLink(this.containerElement);
	}

}

export default ItemBlockMealCategory;
