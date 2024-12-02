import Utilities from '../Utilities';

class Storage {

	//#region generic storage methods

	static async getListFromLocalStorage(key) {
		let values = localStorage.getItem(key);
		if (values === null) {
			values = [];
		} else {
			values = JSON.parse(values);
		}
		return values;
	}

	/**
   * For storing a list of primitive values; always refreshes newest and removes oldest if needed
   * @param {string} key identifier for the whole list
   * @param {*} val a unique primitive value to be added to the list
   * @param {number} maxCount optional: how many values to keep in storage
   * @returns removed values, if any
   */
	static async addToLocalStorageList(key, val, maxCount) {
		//assume the array sort order persists;
		//always put newly accessed values at the front, remove oldest to keep maxCount
		let removedValues = [];
		let valuesArray = await Storage.getListFromLocalStorage(key);
		valuesArray = valuesArray.filter((i) => i !== val);
		valuesArray.unshift(val);
		if (maxCount) {
			while (valuesArray.length > maxCount) {
				removedValues.push(valuesArray.pop());
			}
		}
		localStorage.setItem(key, JSON.stringify(valuesArray));
		return removedValues;
	}

	static async removeFromLocalStorageList(key, val) {
		let valuesSet = new Set(await Storage.getListFromLocalStorage(key));
		valuesSet.delete(val);
		localStorage.setItem(key, JSON.stringify(Array.from(valuesSet)));
	}

	//#endregion

	//// idea for future: extend basic storage class

	//#region methods specific to TheMealDB API
	
	static mealSearchesListName = 'TheMealDB_searches';
	static mealCategoriesListName = 'TheMealDB_categories';
	static mealAreasListName = 'TheMealDB_areas';
	static mealIngredientsListName = 'TheMealDB_ingredients';
	// static mealsListName = 'TheMealDB_meals';
	static mealPrefix = 'TheMealDB_meal_';
	static mealCategoryPrefix = 'TheMealDB_categories_';
	static mealFavoritesPrefix = 'TheMealDB_fav_';
	static mealFavoritesListName = 'TheMealDB_fav';
	static mealSearchesMaxStorage = 30;
	// static mealsMaxStorage = 20;
	static mealFavoritesMaxStorage = 20; //TODO: use same storage pool for all meals (challenge to implement)
	
	static async getMealSearches() {
		return Storage.getListFromLocalStorage(Storage.mealSearchesListName);
	}

	static addToMealSearches(val) {
		Storage.addToLocalStorageList(
			Storage.mealSearchesListName,
			val,
			Storage.mealSearchesMaxStorage
		);
	}

	static clearSearchHistory() {
		localStorage.removeItem(Storage.mealSearchesListName);
	}

	static async getMealIngredientNames() {
		return Storage.getListFromLocalStorage(Storage.mealIngredientsListName);
	}

	static cacheMealIngredientNames(namesList) {
		if(namesList?.length) {
			localStorage.setItem(Storage.mealIngredientsListName, JSON.stringify(namesList));
		}
	}

	static async getMealCategoryNames() {
		return Storage.getListFromLocalStorage(Storage.mealCategoriesListName);
	}

	static cacheMealCategoryNames(namesList) {
		if(namesList?.length) {
			localStorage.setItem(Storage.mealCategoriesListName, JSON.stringify(namesList));
		}
	}

	static async getMealAreas() {
		return Storage.getListFromLocalStorage(Storage.mealAreasListName);
	}

	static cacheMealAreas(namesList) {
		if(namesList?.length) {
			localStorage.setItem(Storage.mealAreasListName, JSON.stringify(namesList));
		}
	}

	static async getMeal(id) {
		let data = sessionStorage.getItem(Storage.mealPrefix + id);
		return data === null ? null : JSON.parse(data);
	}

	static saveMeal(data) {
		sessionStorage.setItem(
			Storage.mealPrefix + data.idMeal,
			JSON.stringify(data)
		);
	}

	static async getCategory(strCategory) {
		let data = sessionStorage.getItem(Storage.mealCategoryPrefix + Utilities.cleanString(strCategory));
		return data === null ? null : JSON.parse(data);
	}

	static saveCategory(data) {
		sessionStorage.setItem(
			Storage.mealCategoryPrefix + Utilities.cleanString(data?.strCategory),
			JSON.stringify(data)
		);
	}

	static async getFavMealsList() {
		return Storage.getListFromLocalStorage(Storage.mealFavoritesListName);
	}

	static async getAllFavMeals() {
		let values = [];
		const ids = await Storage.getFavMealsList();
		if (Array.isArray(ids)) {
			for (const id of ids) {
				let data = localStorage.getItem(Storage.mealFavoritesPrefix + id);
				if (data !== null) {
					values.push(JSON.parse(data));
				}
			}
		}
		return values;
	}

	static async addToFavMeals(data) {
		const entriesToRemove = await Storage.addToLocalStorageList(
			Storage.mealFavoritesListName,
			data.idMeal,
			Storage.mealFavoritesMaxStorage
		);
		for (const id of entriesToRemove) {
			localStorage.removeItem(Storage.mealFavoritesPrefix + id);
		}
		localStorage.setItem(
			Storage.mealFavoritesPrefix + data.idMeal,
			JSON.stringify(data)
		);
	}

	static async removeFromFavMeals(id) {
		Storage.removeFromLocalStorageList(Storage.mealFavoritesListName, id);
		localStorage.removeItem(Storage.mealFavoritesPrefix + id);
	}

	//#endregion
};

export default Storage;
