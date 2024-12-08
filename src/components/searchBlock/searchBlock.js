import Utilities from '../../Utilities';
import {interactiveIcon} from '../common/common';
import './SearchBlock.scss';
import IconCircleChevronRight from '../../assets/circle-chevron-right-solid.svg';

const searchBlock = async (type, queryFieldName, label, inputPlaceholder, onSearch, listObj, datalistId) => {
	const searchBlockElement = Utilities.createElementExt('div', 'search-block');
	if(queryFieldName) {
		searchBlockElement.dataset['queryfieldname'] = queryFieldName;
	}
	const labelElement = searchBlockElement.appendChild(
		Utilities.createElementExt('div', 'search-block__label', {}, label));
	labelElement.innerHTML = label;
	if(type === 'text') {

		const inputHandler = (e) => {
			Utilities.setDisabledAttribute(buttonElement, e.target.value.trim() !== '');
		};

		searchBlockElement.classList.add('search-block--text');
		const inputElement = searchBlockElement.appendChild(
			Utilities.createElementExt('input', 'search-block__input', {type: 'text', name: queryFieldName, placeholder: inputPlaceholder})
		);
		const buttonElement = searchBlockElement.appendChild(
			Utilities.createElementExt('button', ['btn', 'search-block__button'], {type: 'submit', disabled: ''}, 'Search')
		);
		inputElement.addEventListener('input', inputHandler);
		inputElement.setAttribute('list', datalistId);
		buttonElement.addEventListener('click', (e) => {
			e.preventDefault();
			onSearch({[queryFieldName]: inputElement.value});
		});
	}
	if(type === 'list') {
		let isExpandedState = false;

		const inputHandler = (e) => {
			Utilities.setDisabledAttribute(buttonElement, e.target.value.trim() !== '');
			if(isExpandedState) {
				listObj.moveItemsToTop(e.target.value);
			}
		};

		const fillInputOptions = async () => {
			if(inputElement?.list) {
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
				inputElement.setAttribute('list', 'datalist-' + queryFieldName);
			}
		};

		const expandList = async () => {
			isExpandedState = undefined;
			listLabelElement.classList.add('hidden');
			listHeaderElement.classList.add('expanded');
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
			listLabelElement.classList.remove('hidden');
			listHeaderElement.classList.remove('expanded');
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
		const inputElement = Utilities.createElementExt('input', 'search-block__input', {type: 'text', name: queryFieldName, placeholder: inputPlaceholder});
		const listHeaderElement = Utilities.createElementExt('div','search-block__list-header');
		const toggleListButton = interactiveIcon(IconCircleChevronRight);
		toggleListButton.classList.add('interactive-icon--toggle-panel');
		const listLabelElement = Utilities.createElementExt('div', 'search-block__list-label', {}, 'show list');
		const buttonElement = searchBlockElement.appendChild(
			Utilities.createElementExt('button', ['btn', 'search-block__button'], {type: 'submit', disabled: ''}, 'List meals')
		);
		listHeaderElement.append( toggleListButton, listLabelElement);
		searchBlockElement.append(inputElement, buttonElement, listHeaderElement);
		fillInputOptions();
		toggleListButton.addEventListener('click', toggleList);
		listLabelElement.addEventListener('click', toggleList);

		inputElement.addEventListener('input', inputHandler);
		buttonElement.addEventListener('click', (e) => {
			e.preventDefault();
			onSearch({[queryFieldName]: inputElement.value});
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
			Utilities.createElementExt('button', ['btn', 'search-block__button'], {type: 'submit'}, 'Random')
		);
		buttonElement.addEventListener('click', (e) => {
			e.preventDefault();
			onSearch();
		});
	}
	return searchBlockElement;
};

export default searchBlock;
