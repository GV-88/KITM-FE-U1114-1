import Utilities from '../../Utilities';
import {interactiveIcon} from '../common/common';
import './header.scss';

const searchbar = (onSimpleSearch, onAdvancedSearch) => {
	const inputElement = Utilities.createElementExt('input', 'searchbar__input', {type:'search', placeholder:'search', size:16});
	const iconElement = interactiveIcon('assets/search.svg');
	const buttonElement = Utilities.createElementExt('button', ['btn', 'searchbar__button'], {}, 'advanced search');
	const inputWrapperElement = Utilities.createElementExt('div', 'searchbar__input-wrapper');
	const allWrapperElement = Utilities.createElementExt('div', 'searchbar__wrapper');
	const containerElement = Utilities.createElementExt('div', 'searchbar');
	inputWrapperElement.append(inputElement, iconElement);
	allWrapperElement.append(inputWrapperElement, buttonElement);
	containerElement.append(allWrapperElement);
	iconElement.addEventListener('click', () => {
		if (inputElement.value === '') {
			inputElement.focus();
			containerElement.classList.add('searchbar--expanded');
		} else {
			onSimpleSearch(inputElement.value);
		}
	});
	inputElement.addEventListener('blur', () => {
		if (inputElement.value === '') {
			containerElement.classList.remove('searchbar--expanded');
		}
	});
	buttonElement.addEventListener('click', () => {onAdvancedSearch(inputElement.value);});
	return containerElement;
};

export default searchbar;
