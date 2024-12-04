import searchBlock from '../components/searchBlock/searchBlock';
import Utilities from '../Utilities';
import { MealsApi } from './Api';
import ItemBlockList from './ItemBlockList';
import ItemBlockMealArea from './ItemBlockMealArea';
import ItemBlockMealCategory from './ItemBlockMealCategory';
import ItemBlockMealIngredient from './ItemBlockMealIngredient';

class SearchForm {
	constructor(resultsObj, resultsCallback, ingredientsLib, categoriesLib, areasLib) {		
		this.isInitialised = false;
		this.resultsCallback = resultsCallback.bind(resultsObj);
		this.ingredientsLib = ingredientsLib; // should work as reference to object?
		this.categoriesLib = categoriesLib;
		this.areasLib = areasLib;
	}

	async init() {
		this.ingredientsList = new ItemBlockList(
			(...args) => {return new ItemBlockMealIngredient(...args);},
			20,
			this.ingredientsLib,
			this.doFilter.bind(this)
		);
		this.categoriesList = new ItemBlockList(
			(...args) => {return new ItemBlockMealCategory(...args);},
			null,
			this.categoriesLib,
			this.doFilter.bind(this)
		);
		this.areasList = new ItemBlockList(
			(...args) => {return new ItemBlockMealArea(...args);},
			null,
			this.areasLib,
			this.doFilter.bind(this)
		);
		this.formElement = Utilities.createElementExt('form', SearchForm.className, {workspace: ''});
		this.formElement.append(
			await searchBlock('Search by name', 'text', 'searchstring', this.doSearch.bind(this)),
			await searchBlock('List by first letter', 'letter', 'firstLetter', this.doSearch.bind(this)),
			await searchBlock('List by category', 'list', 'category', this.doFilter.bind(this), this.categoriesList),
			await searchBlock('List by area', 'list', 'area', this.doFilter.bind(this), this.areasList),
			await searchBlock('List by ingredients', 'list', 'ingredient', this.doFilter.bind(this), this.ingredientsList),
			await searchBlock('Surprise me', 'random', null, this.doRandom.bind(this)),
		);
		this.isInitialised = true;
	}

	async doSearch(query) {
		this.resultsCallback(MealsApi.searchMeals(query));
	}

	async doFilter(query) {
		this.resultsCallback(MealsApi.filterMeals(query));
	}

	async doRandom() {
		this.resultsCallback(MealsApi.randomMeal());
	}

	getElementRef() {
		return this.formElement;
	}

	prefillTxtSearch(val) {
		this.formElement.querySelector('input').value = val;
	}

	static className = 'form--search';
}

export default SearchForm;
