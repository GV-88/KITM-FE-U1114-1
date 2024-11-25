import ItemBlock from './ItemBlock';

class ItemBlockMealArea extends ItemBlock {
	constructor(initialData, dataGetter, onSearch, onExpanded) {
		super(initialData, dataGetter, onSearch, onExpanded);
	}

	availableActions = ['search'];

	identifierFieldName = 'title';

	specificClassName = 'item-block--area';

	isSufficientData() {
		return true;
	}

}

export default ItemBlockMealArea;
