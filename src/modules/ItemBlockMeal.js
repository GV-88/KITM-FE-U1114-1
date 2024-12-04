import mealRecipe from '../components/itemBlock/mealRecipe';
import Utilities from '../Utilities';
import ItemBlock from './ItemBlock';

class ItemBlockMeal extends ItemBlock {
	constructor(initialData, dataGetter, onSearch, onExpanded) {
		super(initialData, dataGetter, onSearch, onExpanded);
	}

	availableActions = ['expand'];

	identifierFieldName = 'title';

	specificClassName = 'item-block--meal';

	isSufficientData(level) {
		switch (level) {
			case 1:
				return Boolean(this.dataObj.getThumbnailUrl());
			case 2:
				return Boolean(this.dataObj?.ingredients);
			default:
				return true;
		}
	}

	async addPreviewContent() {
		this.addPictureElement(this.containerElement, this.dataObj.getThumbnailUrl());
		const expandLinkElement = Utilities.createElementExt('a', ItemBlock.className + '__link', {}, 'View recipe');
		const bodyElement = Utilities.createElementExt('div', ItemBlock.className + '__body');
		if(this.titleElement) {
			bodyElement.appendChild(this.titleElement);
		}
		bodyElement.appendChild(expandLinkElement);
		expandLinkElement.addEventListener('click', (e) => {
			e.preventDefault();
			this.expandL2();
		}, {once: true});
		this.expandButtonElement.classList.add('hidden');
		this.containerElement.appendChild(bodyElement);
	}

	async removePreviewContent() {
		if(!(this.isExpanded)) {
			this.removePictureElement(this.containerElement);
		}
		if(this.titleElement) {
			//move the node to where it was initially
			this.containerElement.appendChild(this.titleElement);
		}
	}

	async addFullContent() {
		Utilities.clearChildren(this.containerElement);
		this.containerElement.appendChild(await mealRecipe(this.dataObj));
		// this.addPictureElement(this.containerElement, this.dataObj.getImageUrl(), true);
	}

	async removeFullContent() {
		Utilities.clearChildren(this.containerElement);
		if(this.isPreview) {
			this.addPreviewContent();
		}
	}

}

export default ItemBlockMeal;
