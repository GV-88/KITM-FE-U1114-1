import searchBlock from '../components/searchBlock/searchBlock';
import Utilities from '../Utilities';
import ItemBlockList from './ItemBlockList';
import ItemBlockMealArea from './ItemBlockMealArea';
import ItemBlockMealCategory from './ItemBlockMealCategory';
import ItemBlockMealIngredient from './ItemBlockMealIngredient';

class SearchForm {
	constructor(resultsCallback, ingredientsLib, categoriesLib, areasLib) {
		this.isInitialised = false;
		this.resultsCallback = resultsCallback;
		this.ingredientsLib = ingredientsLib; // should work as reference to object?
		this.categoriesLib = categoriesLib;
		this.areasLib = areasLib;
	}

	async doSearch(query) {
		console.log('doSearch', query);
		//TODO: API calls here
		this.resultsCallback();
	}

	async init() {
		this.ingredientsList = new ItemBlockList(
			(...args) => {new ItemBlockMealIngredient(...args);},
			this.ingredientsLib,
			this.doSearch
		);
		this.categoriesList = new ItemBlockList(
			(...args) => {new ItemBlockMealCategory(...args);},
			this.categoriesLib,
			this.doSearch
		);
		this.areasList = new ItemBlockList(
			(...args) => {new ItemBlockMealArea(...args);},
			this.areasList,
			this.doSearch
		);
		this.formElement = Utilities.createElementExt('form', SearchForm.className, {workspace: ''});
		this.formElement.append(
			searchBlock('Search by name', 'text', 'searchstring', this.doSearch),
			searchBlock('List by first letter', 'letter', 'firstLetter', this.doSearch),
			searchBlock('List by category', 'list', 'category', null, this.categoriesList),
			searchBlock('List by area', 'list', 'area', null, this.areasList),
			searchBlock('List by ingredients', 'list', 'ingredient', null, this.ingredientsLib),
			searchBlock('Surprise me', 'random', null),
		);
		this.isInitialised = true;
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
