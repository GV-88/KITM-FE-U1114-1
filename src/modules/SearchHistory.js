import Utilities from '../Utilities';
import Storage from './Storage';

class SearchHistory {
	constructor(id, strings) {
		this.isInitialised = false;
		this.id = id;
		this.strings = strings || [];
	}

	getId() {
		return this.id;
	}

	async init() {
		this.datalistElement = Utilities.createElementExt('datalist', [], {id: this.id});
		this.isInitialised = true;
	}

	getElementRef() {
		return this.datalistElement;
	}

	async update() {
		if (!this.isInitialised) {
			await this.init();
		}
		const searchHistory = await Storage.getMealSearches();
		if(searchHistory?.length) {
			Utilities.clearChildren(this.datalistElement);
			for(let str of searchHistory) {
				this.datalistElement.appendChild(Utilities.createElementExt('option', [], {value: str}));
			}
		}
	}

}

export default SearchHistory;
