import Utilities from '../../Utilities';
import {logo, interactiveIcon} from '../common/common';
import searchbar from './searchbar';
import './header.scss';

const header = async function (onSimpleSearch, onAdvancedSearch) {
	const headerElement = Utilities.createElementExt('header', 'header');
	headerElement.appendChild(
		Utilities.createElementExt('div', [
			'header__block',
			'header__block--logo',
		])
	)
		.appendChild(logo());

	const navListElement = headerElement.appendChild(
		Utilities.createElementExt('nav', [
			'header__block',
			'header__block--nav',
		])
	).appendChild(Utilities.createElementExt('ul'));

	const menuLinks = [
		{title: 'Home', link: '#'},
		{title: 'Recipe', link: '#'},
		{title: 'Community', link: '#'},
		{title: 'About us', link: '#'},
	];
	for(const link of menuLinks) {
		navListElement.appendChild(Utilities.createElementExt('li')).appendChild(
			Utilities.createElementExt('a', 'header__nav-link', {href: link.link}, link.title)
		);
	}

	const buttonGroupElement = headerElement.appendChild(
		Utilities.createElementExt('div', ['header__block', 'header__block--buttons'])
	);
	buttonGroupElement.append(searchbar(onSimpleSearch, onAdvancedSearch), interactiveIcon('assets/user.svg'));

	return headerElement;
};

export default header;
