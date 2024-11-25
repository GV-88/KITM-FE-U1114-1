import ItemBlock from './ItemBlock';

class ItemBlockMealCategory extends ItemBlock {
	constructor(initialData, dataGetter, onSearch, onExpanded) {
		super(initialData, dataGetter, onSearch, onExpanded);
	}

	availableActions = ['search', 'expand'];

	identifierFieldName = 'title';

	specificClassName = 'item-block--category';

	isSufficientData(level) {
		switch (level) {
			case 1:
				return Boolean(this.dataObj?.getThumbnailUrl());
			case 2:
				return Boolean(this.dataObj?.strCategoryDescription);
			default:
				return true;
		}
	}

	appendData(srcObj) {
		this.dataObj = Object.assign(this.dataObj, srcObj);
	}

}

export default ItemBlockMealCategory;
