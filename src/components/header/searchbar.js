import Utilities from '../../Utilities';
import {interactiveIcon} from '../common/common';
import './header.scss';
import IconSearch from '../../assets/search.svg';

const searchbar = (onSimpleSearch, onAdvancedSearch) => {
	const inputElement = Utilities.createElementExt('input', 'searchbar__input', {type:'search', placeholder:'search', size:16});
	const iconElement = interactiveIcon(IconSearch);
	const buttonElement = Utilities.createElementExt('button', ['btn', 'searchbar__button'], {}, 'advanced search');
	const inputWrapperElement = Utilities.createElementExt('div', 'searchbar__input-wrapper');
	const allWrapperElement = Utilities.createElementExt('div', 'searchbar__wrapper');
	const containerElement = Utilities.createElementExt('div', 'searchbar');
	inputWrapperElement.append(inputElement, iconElement);
	allWrapperElement.append(inputWrapperElement, buttonElement);
	containerElement.append(allWrapperElement);
	containerElement.classList.add('searchbar--link-to-advanced');
	inputElement.addEventListener('focus', () => {
		containerElement.classList.add('searchbar--expanded');
	});
	inputElement.addEventListener('blur', () => {
		if (inputElement.value === '') {
			containerElement.classList.remove('searchbar--expanded');
		}
	});
	iconElement.addEventListener('click', () => {
		if (inputElement.value === '') {
			inputElement.focus();
		} else {
			containerElement.classList.remove('searchbar--expanded');
			onSimpleSearch(inputElement.value);
		}
	});
	inputElement.addEventListener('keydown', (e) => {
		if(e.key === 'Enter' && inputElement.value.trim() != '') {
			e.stopPropagation();
			containerElement.classList.remove('searchbar--expanded');
			onSimpleSearch(inputElement.value);
		}
	});
	buttonElement.addEventListener('click', () => {
		containerElement.classList.remove('searchbar--expanded');
		onAdvancedSearch(inputElement.value);
	});

	return containerElement;
};

export default searchbar;
