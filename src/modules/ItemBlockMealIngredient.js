import Utilities from '../Utilities';
import ItemBlock from './ItemBlock';

class ItemBlockMealIngredient extends ItemBlock {
	constructor(initialData, dataGetter, onSearch, onExpanded) {
		super(initialData, dataGetter, onSearch, onExpanded);
	}

	availableActions = ['search', 'expand'];

	identifierFieldName = 'title';

	searchQueryFieldName = 'ingredient';

	specificClassName = 'item-block--ingredient';

	isSufficientData(level) {
		switch (level) {
			case 1:
				return Boolean(this.dataObj.getThumbnailUrl());
			case 2:
				return Boolean(this.dataObj?.strDescription);
			default:
				return true;
		}
	}

	async addFullContent() {
		await super.addFullContent();
		this.containerElement.append(
			Utilities.createElementExt('div', ItemBlock.className + '__type', {}, this.dataObj.strType),
			Utilities.createElementExt('p', ItemBlock.className + '__description', {}, this.dataObj.strDescription)
		);
	}

	removeFullContent() {
		super.removeFullContent();
		Utilities.smoothRemove(this.containerElement, this.containerElement.querySelector('.' + ItemBlock.className + '__description'));
		Utilities.smoothRemove(this.containerElement, this.containerElement.querySelector('.' + ItemBlock.className + '__type'));
	}

}

export default ItemBlockMealIngredient;
