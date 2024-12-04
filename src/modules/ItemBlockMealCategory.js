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
		this.containerElement.appendChild(Utilities.createElementExt('p', ItemBlock.className + '__description', {}, this.dataObj.strCategoryDescription));
	}

	removeFullContent() {
		super.removeFullContent();
		Utilities.smoothRemove(this.containerElement, this.containerElement.querySelector('.' + ItemBlock.className + '__description'));
	}

}

export default ItemBlockMealCategory;
