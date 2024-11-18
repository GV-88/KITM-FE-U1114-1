//TODO: class syntax

const storage = {
	getListFromLocalStorage: async function (key) {
		let values = localStorage.getItem(key);
		if (values === null) {
			values = [];
		} else {
			values = JSON.parse(values);
		}
		return values;
	},
	/**
   * For storing a list of primitive values; always refreshes newest and removes oldest if needed
   * @param {string} key identifier for the whole list
   * @param {*} val a unique primitive value to be added to the list
   * @param {number} maxCount optional: how many values to keep in storage
   * @returns removed values, if any
   */
	addToLocalStorageList: async function (key, val, maxCount) {
		//assume the array sort order persists;
		//always put newly accessed values at the front, remove oldest to keep maxCount
		let removedValues = [];
		let valuesArray = await this.getListFromLocalStorage(key);
		valuesArray = valuesArray.filter((i) => i !== val);
		valuesArray.unshift(val);
		if (maxCount) {
			while (valuesArray.length > maxCount) {
				removedValues.push(valuesArray.pop());
			}
		}
		localStorage.setItem(key, JSON.stringify(valuesArray));
		return removedValues;
	},
	removeFromLocalStorageList: async function (key, val) {
		let valuesSet = new Set(await this.getListFromLocalStorage(key));
		valuesSet.delete(val);
		localStorage.setItem(key, JSON.stringify(Array.from(valuesSet)));
	},
	mealSearchesListName: 'TheMealDB_searches',
	mealDetailsPrefix: 'TheMealDB_details_',
	mealFavoritesPrefix: 'TheMealDB_fav_',
	mealFavoritesListName: 'TheMealDB_fav',
	mealSearchesMaxStorage: 30,
	mealFavoritesMaxStorage: 20,
	getMealSearches: async function () {
		return this.getListFromLocalStorage(this.mealSearchesListName);
	},
	addToMealSearches: function (val) {
		this.addToLocalStorageList(
			this.mealSearchesListName,
			val,
			this.mealSearchesMaxStorage
		);
	},
	clearSearchHistory: function () {
		localStorage.removeItem(this.mealSearchesListName);
	},
	getMealDetails: async function (id) {
		let data = sessionStorage.getItem(this.mealDetailsPrefix + id);
		return data === null ? null : JSON.parse(data);
	},
	saveMealDetails: function (data) {
		sessionStorage.setItem(
			this.mealDetailsPrefix + data.idMeal,
			JSON.stringify(data)
		);
	},
	getFavMealsList: async function () {
		return this.getListFromLocalStorage(this.mealFavoritesListName);
	},
	getAllFavMeals: async function () {
		let values = [];
		const ids = await this.getFavMealsList();
		if (Array.isArray(ids)) {
			for (const id of ids) {
				let data = localStorage.getItem(this.mealFavoritesPrefix + id);
				if (data !== null) {
					values.push(JSON.parse(data));
				}
			}
		}
		return values;
	},
	addToFavMeals: async function (data) {
		const entriesToRemove = await this.addToLocalStorageList(
			this.mealFavoritesListName,
			data.idMeal,
			this.mealFavoritesMaxStorage
		);
		for (const id of entriesToRemove) {
			localStorage.removeItem(this.mealFavoritesPrefix + id);
		}
		localStorage.setItem(
			this.mealFavoritesPrefix + data.idMeal,
			JSON.stringify(data)
		);
	},
	removeFromFavMeals: async function (id) {
		this.removeFromLocalStorageList(this.mealFavoritesListName, id);
		localStorage.removeItem(this.mealFavoritesPrefix + id);
	},
};

export default storage;
