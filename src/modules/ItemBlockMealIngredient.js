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

	appendData(srcObj) {
		this.dataObj = Object.assign(this.dataObj, srcObj);
	}

}

export default ItemBlockMealIngredient;
