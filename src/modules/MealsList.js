// Not just a list, but a whole browsing workspace,
// it will have its own interlinked search form

import Utilities from '../Utilities';
import { MealsApi } from './Api';
import ItemBlockMeal from './ItemBlockMeal';
import SearchForm from './SearchForm';

class MealsList {
	constructor(ingredientsLib, categoriesLib, areasLib, searchHistoryRef, onFilterFn) {
		this.isInitialised = false;
		this.ingredientsLib = ingredientsLib; // should work as reference to object?
		this.categoriesLib = categoriesLib;
		this.areasLib = areasLib;
		this.searchHistoryRef = searchHistoryRef;
		this.onFilterFn = onFilterFn;
		this.meals = [];
		this.itemBlocks = [];
		this.formObj = new SearchForm(
			this,
			this.displayResult,
			this.ingredientsLib, 
			this.categoriesLib, 
			this.areasLib,
			this.searchHistoryRef.getId()
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
		const inputElement = this.formObj.getElementRef().querySelector('.search-block__input[name="searchstring"]');
		if(inputElement) {
			inputElement.focus();
		}
	}

	async setHeaderElement(el) {
		Utilities.clearChildren(this.headerElement);
		if(el) {
			this.headerElement.appendChild(el);
		}
	}

	prefillForm(val) {
		this.formObj.prefillTxtSearch(val);
	}

	submitFormSearch(val) {
		this.prefillForm(val);
		this.formObj.doSearch({'searchstring' : val});
	}

	submitFormFilter(query) {
		this.formObj.doFilter(query);
	}


	async setPlaceholderContent(className, text, clear) {
		if(clear !== false) {
			await this.clear();
		}
		this.listElement.appendChild(Utilities.createElementExt('div', className || 'meals-list__placeholder', {}, text));
	}

	async addMeals(meals) {
		if(meals === null) {
			this.setPlaceholderContent('meals-list__404', 'No results', true);
			return;
		}
		
		for(const m of meals) {
			this.meals.push(m);
			const itemBlock = new ItemBlockMeal(
				m,
				async () => {
					const data = await MealsApi.searchMeals({id: m.id});
					return data[0]; //TODO: error handling
				},
				// this.formObj.doFilter.bind(this.formObj),
				this.onFilterFn,
				((current) => {
					// accordion behavior
					for(const itemBlock of this.itemBlocks) {
						if(itemBlock !== current) {
							itemBlock.collapseL2();
						}
					}
				}).bind(this),
				this.ingredientsLib,
				this.categoriesLib
			);
			this.itemBlocks.push(itemBlock);
			await itemBlock.init(1);
			this.listElement.appendChild(itemBlock.getElementRef());
		}
	}

	async displayResult(result) {
		this.clear();
		try {
			await this.addMeals(await result);
			Utilities.scrollIntoViewIfNeeded(this.listElement);
		} catch (error) {
			console.error(error);
			this.setPlaceholderContent('meals-list__error', 'Something went wrong...', true);
		}
		this.searchHistoryRef.update();
	}

	async clear() {
		Utilities.clearChildren(this.listElement);
	}
}

export default MealsList;
