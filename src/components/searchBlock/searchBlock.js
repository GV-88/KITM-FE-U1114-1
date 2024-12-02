import Utilities from '../../Utilities';
import Storage from '../../modules/Storage';
import {interactiveIcon} from '../common/common';
import './SearchBlock.scss';

const searchBlock = async (label, type, queryFieldName, onSearch, listObj) => {
	const searchBlockElement = Utilities.createElementExt('div', 'search-block');
	searchBlockElement.appendChild(
		Utilities.createElementExt('div', 'search-block__label', {}, label));
	if(type === 'text') {
		searchBlockElement.classList.add('search-block--text');
		const inputElement = searchBlockElement.appendChild(
			Utilities.createElementExt('input', 'search-block__input', {type: 'text', name: queryFieldName})
		);
		const buttonElement = searchBlockElement.appendChild(
			Utilities.createElementExt('button', ['btn', 'search-block__button'], {type: 'submit', name: queryFieldName}, 'Search')
		);
		buttonElement.addEventListener('click', (e) => {
			e.preventDefault();
			onSearch({[queryFieldName]: inputElement.value});
		});
		
		const searchHistory = await Storage.getMealSearches();
		if(searchHistory?.length) {
			const datalistElement = Utilities.createElementExt('datalist', [], {id:'datalist-' + queryFieldName});
			for(let str of searchHistory) {
				datalistElement.appendChild(Utilities.createElementExt('option', [], {value: str}));
			}
			searchBlockElement.appendChild(datalistElement);
			inputElement.setAttribute('list', 'datalist-' + queryFieldName);
		}
	}
	if(type === 'list') {
		let isExpandedState = false;

		const fillInputOptions = async () => {
			if(listInputElement?.list) {
				return; //do this only once
			}
			if(!listObj.isInitialised) {
				await listObj.init(true); //with "true" only attempts to load the list from cache
			}
			if(listObj.namesList?.length) {
				const datalistElement = Utilities.createElementExt('datalist', [], {id:'datalist-' + queryFieldName});
				for(let str of listObj.namesList) {
					datalistElement.appendChild(Utilities.createElementExt('option', [], {value: str}));
				}
				searchBlockElement.appendChild(datalistElement);
				listInputElement.setAttribute('list', 'datalist-' + queryFieldName);
			}
		};

		const expandList = async () => {
			isExpandedState = undefined;
			toggleListButton.querySelector('img').src = 'assets/circle-chevron-down-solid.svg';
			listLabelElement.classList.add('hidden');
			//TODO: visually limit the list size
			if(!listObj.isInitialised) {
				await listObj.init();
			} else {
				await listObj.updateList(); //in case the actual init was cacheOnly
				fillInputOptions();
			}
			//DOM element lifecycle: is there risk of garbage-collection when removing and re-adding to DOM? 
			searchBlockElement.appendChild(listObj.getElementRef());
			isExpandedState = true;
		};

		const collapseList = () => {
			isExpandedState = undefined;
			toggleListButton.querySelector('img').src = 'assets/circle-chevron-right-solid.svg';
			listLabelElement.classList.remove('hidden');
			Utilities.smoothRemove(searchBlockElement, listObj.getElementRef());
			isExpandedState = false;
		};

		const toggleList = () => {
			if(isExpandedState) {
				collapseList();
			}else if(!isExpandedState) {
				expandList();
			}
		};

		searchBlockElement.classList.add('search-block--list');
		const listInputElement = Utilities.createElementExt('input', 'search-block__input', {type: 'text', name: queryFieldName});
		const listHeaderElement = Utilities.createElementExt('div','search-block__list-header');
		const toggleListButton = interactiveIcon('/assets/circle-chevron-right-solid.svg');
		const listLabelElement = Utilities.createElementExt('div', 'search-block__list-label', {}, 'show list');
		const buttonElement = searchBlockElement.appendChild(
			Utilities.createElementExt('button', ['btn', 'search-block__button'], {type: 'submit', name: queryFieldName}, 'List meals')
		);
		listHeaderElement.append( toggleListButton, listLabelElement);
		searchBlockElement.append(listInputElement, buttonElement, listHeaderElement);
		fillInputOptions();
		toggleListButton.addEventListener('click', toggleList);
		listLabelElement.addEventListener('click', toggleList);

		buttonElement.addEventListener('click', (e) => {
			e.preventDefault();
			onSearch({[queryFieldName]: listInputElement.value});
		});
	}
	if(type === 'letter') {
		searchBlockElement.classList.add('search-block--letter');
		const alphabetElement = searchBlockElement.appendChild(
			Utilities.createElementExt('div', 'search-block__alphabet')
		);
		for (let a of Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ')) {
			const letterElement = Utilities.createElementExt('span', 'search-block__letter', {'data-letter': a}, a);
			alphabetElement.appendChild(letterElement);
			letterElement.addEventListener('click', (e) => {
				onSearch({[queryFieldName]: e.currentTarget.innerText});
			});
		}
		searchBlockElement.appendChild(alphabetElement);

	}
	if(type === 'random') {
		searchBlockElement.classList.add('search-block--random');
		const buttonElement = searchBlockElement.appendChild(
			Utilities.createElementExt('button', ['btn', 'search-block__button'], {type: 'submit', name: queryFieldName}, 'Random')
		);
		buttonElement.addEventListener('click', (e) => {
			e.preventDefault();
			onSearch();
		});
	}
	return searchBlockElement;
};

export default searchBlock;
