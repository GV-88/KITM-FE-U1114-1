import AjaxService from './AjaxService';
import Storage from './Storage';

// TheMealDB API is built... Interestingly...


export class MealDBItem {
	constructor(title, id) {
		this.title = title;
		this.id = id;
	}
	getImageUrl() { return null; }
	getThumbnailUrl() { return this.getImageUrl(); }
}

export class Meal extends MealDBItem {
	constructor(parsedJsonObject) {
		super(parsedJsonObject?.strMeal, parsedJsonObject.idMeal);
		//destructuring assignment
		({
			strMealThumb: this.strMealThumb,
		} = parsedJsonObject);
	}
	getImageUrl() { return this.strMealThumb; }
	getThumbnailUrl() { return this.strMealThumb + '/preview'; }
}

export class MealRecipe extends Meal {
	constructor(parsedJsonObject) {
		super(parsedJsonObject);
		//destructuring assignment
		({
			strCategory: this.strCategory,
			strArea: this.strArea,
			strInstructions: this.strInstructions,
			strYoutube: this.strYoutube,
		} = parsedJsonObject);
		this.ingredients = [];
		for(let i = 1; i <= 20; i++) {
			if(parsedJsonObject['strIngredient' + i]) {
				this.ingredients.push({ingredient: parsedJsonObject['strIngredient' + i], measure: parsedJsonObject['strMeasure' + i]});
			}
		}
	}
}

export class IngredientBasic extends MealDBItem {
	constructor(title, id) {
		super(title, id);
	}
	//works with spaces in file name
	getImageUrl() { return `https://www.themealdb.com/images/ingredients/${encodeURIComponent(this.title)}.png`; }
	getThumbnailUrl() { return Array.from(this.getImageUrl()).splice(-4, 0, '-Small').join(''); }
}

export class Ingredient extends IngredientBasic {
	constructor(parsedJsonObject) {
		super(parsedJsonObject?.strIngredient, parsedJsonObject.idIngredient);
		//destructuring assignment
		({
			strDescription: this.strDescription,
			strType: this.strType,
		} = parsedJsonObject);
	}
}

export class CategoryBasic extends MealDBItem {
	constructor(title, id) {
		super(title, id);
	}
	getImageUrl() { return this?.strCategoryThumb ?? `https://www.themealdb.com/images/category/${encodeURIComponent(this.title)}.png`; }
	getThumbnailUrl() { return this.getImageUrl; }
}

export class Category extends CategoryBasic {
	constructor(parsedJsonObject) {
		super(parsedJsonObject?.strCategory, parsedJsonObject.idCategory);
		//destructuring assignment
		({
			strCategoryThumb: this.strCategoryThumb,
			strCategoryDescription: this.strCategoryDescription,
		} = parsedJsonObject);
	}
}

export class MealsApi {
	static parseMealRecipes(arr) {
		return (arr ?? []).map(item => new MealRecipe(item));
	}
	static parseMealPreviews(arr) {
		return (arr ?? []).map(item => new Meal(item));
	}
	static parseIngredients(arr) {
		return (arr ?? []).map(item => new Ingredient(item));
	}
	static parseCategories(arr) {
		return (arr ?? []).map(item => new Category(item));
	}

	static async searchMeals(query) {
		let endpoint = query?.id ? 'lookup' : 'search';
		if(query?.searchstring) { Storage.addToMealSearches(query.searchstring); }
		return AjaxService.get(endpoint, query).then((data) => MealsApi.parseMealRecipes(data?.meals), () => null);
	};

	static async FilterMeals(query) {
		return AjaxService.get('filter', query).then((data) => MealsApi.parseMealPreviews(data?.meals), () => null);
	};

	static getAllIngredients() {
		return AjaxService.get('list', {ingredient: 'list'}).then(
			(data) => {
				let ingredients = [];
				if(data?.meals) {
					ingredients = MealsApi.parseIngredients(data?.meals);
					Storage.cacheMealIngredientNames(ingredients.map(i => i?.title));
				}
				return ingredients;
			},
			() => null
		);
	}

	static getAllCategories() {
		return AjaxService.get('categories').then(
			(data) => {
				let categories = [];
				if (data?.categories) {
					categories = MealsApi.parseCategories(data?.categories);
					Storage.cacheMealCategoryNames(categories.map(i => i?.title));
				}
				return categories;
			},
			() => null
		);
	}

	static async getCategoryList() {
		let list = await Storage.getMealCategoryNames();
		if (list === null) {
			return AjaxService.get('list', {category: 'list'}).then(
				(data) => {
					list = data?.meals ? data.meals.map(i => i?.strCategory) : [];
					Storage.cacheMealCategoryNames(list);
					return list;
				},
				() => null
			);
		}
		return list;
	}
	
	static getAreaList() {
		return AjaxService.get('list', {area: 'list'}).then((data) => data?.meals ? data.meals.map(areaData => areaData?.strArea) : [], () => null);
	}

	// static async getIngredientList() {
	// 	let list = await Storage.getMealIngredientNames();
	// 	if (list === null) {
	// 		return MealsApi.getAllIngredients().then( (ingredients) => ingredients.map(i => i?.title), () => null);
	// 	}
	// 	return list;
	// }
};

export class LazyLoadingLibrary {
	constructor() {
		this.library = undefined;
		this.list = undefined;
	}

	listingFieldName = undefined;

	basicItemConstructor = (title, id) => {
		return new MealDBItem(title, id);
	};

	async libraryLoader() {
		throw new Error('not implemented');
	}

	async listLoader() {
		throw new Error('not implemented');
	}

	makeListFromLibrary() {
		this.list = this.library.map(i => i[this.listingFieldName]);
	}

	async loadLibrary() {
		this.library = await this.libraryLoader();
		this.makeListFromLibrary();
	}

	async getLibrary() {
		if(!this.library) {
			await this.loadLibrary();
			return this.library;
		}
		return this.library;
	}

	async getList(cacheOnly) {
		if(this.list?.length) {
			return this.list;
		}
		this.list = await this.listLoader();
		if (this.list?.length && !cacheOnly) {
			await this.loadLibrary();
			return this.list;
		}
		return this.list;
	}

	async getItem(identifier) {
		if(!this.library) {
			await this.loadLibrary();
			return this.library.find((obj) => obj[this.listingFieldName] === identifier);
		}
		return this.library.find((obj) => obj[this.listingFieldName] === identifier);
	}
}

export class IngredientsLibrary extends LazyLoadingLibrary {
	listingFieldName = 'title';

	basicItemConstructor = (title, id) => {
		return new IngredientBasic(title, id);
	};

	async libraryLoader() {
		return MealsApi.getAllIngredients;
	}

	async listLoader() {
		return Storage.getMealIngredientNames;
	}
}

export class CategoriesLibrary extends LazyLoadingLibrary {
	listingFieldName = 'title';

	basicItemConstructor = (title, id) => {
		return new CategoryBasic(title, id);
	};

	async libraryLoader() {
		return MealsApi.getAllCategories;
	}

	async listLoader() {
		return MealsApi.getCategoryList;
	}
}

export class AreasLibrary extends LazyLoadingLibrary {
	async listLoader() {
		return MealsApi.getAreaList;
	}
}
