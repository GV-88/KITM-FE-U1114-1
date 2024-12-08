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
		//not very wise to construct strings every time, maybe should keep parsed array of strings in data object
		this.containerElement.append(
			Utilities.createElementExt('div', ItemBlock.className + '__type', {}, this.dataObj.strType),
			...(Utilities.stringToParagraphs(this.dataObj.strDescription, ItemBlock.className + '__description'))
		);
		super.addSearchLink(this.containerElement);
	}

	removeFullContent() {
		super.removeFullContent();
		this.containerElement.querySelectorAll('.' + ItemBlock.className + '__description').forEach(el => this.containerElement.removeChild(el));
		Utilities.smoothRemove(this.containerElement, this.containerElement.querySelector('.' + ItemBlock.className + '__type'));
		super.removeSearchLink(this.containerElement);
	}

}

export default ItemBlockMealIngredient;
