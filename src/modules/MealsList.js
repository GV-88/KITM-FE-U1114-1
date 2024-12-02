// Not just a list, but a whole browsing workspace,
// it will have its own interlinked search form

import Utilities from '../Utilities';
import SearchForm from './SearchForm';

class MealsList {
	constructor(ingredientsLib, categoriesLib, areasLib) {
		this.isInitialised = false;
		this.ingredientsLib = ingredientsLib; // should work as reference to object?
		this.categoriesLib = categoriesLib;
		this.areasLib = areasLib;
		this.meals = [];
		this.formObj = new SearchForm(
			this,
			async (result) => {
				this.clear();
				this.addMeals(await result);
			}, 
			this.ingredientsLib, 
			this.categoriesLib, 
			this.areasLib
		);
	}

	getElementRef() {
		return this.wrapperElement;
	}

	async init(includeForm) {
		this.wrapperElement = Utilities.createElementExt('section', 'meals-list', {workspace: ''});
		this.headerElement = this.wrapperElement.appendChild(
			Utilities.createElementExt('header', 'meals-list__header'));
		this.listElement = this.wrapperElement.appendChild(
			Utilities.createElementExt('div', 'meals-list__meals'));
		if(includeForm) {
			await this.addForm();
		}

		this.isInitialised = true;
	}

	async addForm() {
		if(this.headerElement.querySelector(`.${SearchForm.className}`)) {
			return;
		}
		if(!(this.formObj.isInitialised)) {
			await this.formObj.init();
		}
		Utilities.clearChildren(this.headerElement);
		this.headerElement.appendChild(this.formObj.getElementRef());
	}

	async setHeaderElement(el) {
		Utilities.clearChildren(this.headerElement);
		this.headerElement.appendChild(el);
	}

	prefillForm(val) {
		this.formObj.prefillTxtSearch(val);
	}

	addMeals(meals) {
		//TODO: 404 handling
		// console.log('addMeals', meals);
		for(const m of meals) {
			this.meals.push(m);
			this.listElement.appendChild(Utilities.createElementExt('span', [], {}, m?.title));
		}
	}

	async clear() {
		Utilities.clearChildren(this.listElement);
	}
}

export default MealsList;
