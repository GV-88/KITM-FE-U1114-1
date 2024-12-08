import searchBlock from '../components/searchBlock/searchBlock';
import Utilities from '../Utilities';
import { MealsApi } from './Api';
import ItemBlockList from './ItemBlockList';
import ItemBlockMealArea from './ItemBlockMealArea';
import ItemBlockMealCategory from './ItemBlockMealCategory';
import ItemBlockMealIngredient from './ItemBlockMealIngredient';

class SearchForm {
	constructor(resultsObj, resultsCallback, ingredientsLib, categoriesLib, areasLib, searchHistoryListId) {		
		this.isInitialised = false;
		this.resultsCallback = resultsCallback.bind(resultsObj);
		this.ingredientsLib = ingredientsLib; // should work as reference to object?
		this.categoriesLib = categoriesLib;
		this.areasLib = areasLib;
		this.searchHistoryListId = searchHistoryListId;
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
			await searchBlock('text', 'searchstring', 'Search by <b>name</b>', 'name', this.doSearch.bind(this), null, this.searchHistoryListId),
			await searchBlock('letter', 'firstLetter', 'List by <b>first letter</b>', null, this.doSearch.bind(this)),
			await searchBlock('list', 'category', 'List by <b>category</b>', 'category', this.doFilter.bind(this), this.categoriesList),
			await searchBlock('list', 'area', 'List by <b>area</b>', 'area', this.doFilter.bind(this), this.areasList),
			await searchBlock('list', 'ingredient', 'List by <b>ingredients</b>', 'ingredient', this.doFilter.bind(this), this.ingredientsList),
			await searchBlock('random', null, 'Surprise me', null, this.doRandom.bind(this)),
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
		const inputElement = this.formElement.querySelector('input[name="searchstring"]');
		inputElement.value = val;
		inputElement.dispatchEvent(new Event('input'));
	}

	static className = 'form--search';
}

export default SearchForm;
