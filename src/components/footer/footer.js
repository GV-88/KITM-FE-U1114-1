import Utilities from '../../Utilities';
import { logo } from '../common/common';
import './footer.scss';

const footer = async function () {
	const footerElement = Utilities.createElementExt('footer', 'footer');
	footerElement.appendChild(
		Utilities.createElementExt('div', [
			'footer__block',
			'footer__block--logo',
		])
	)
		.appendChild(logo());

	const sitemapElement = footerElement.appendChild(
		Utilities.createElementExt('div', [
			'footer__block',
			'footer__block--sitemap',
			'sitemap'
		])
	).appendChild(Utilities.createElementExt('ul'));

	const sitemap = [
		{
			title: 'Menu',
			links: [
				{title: 'Home', link: '#home'},
				{title: 'Recipe', link: '#recipe'},
				{title: 'Community', link: '#'},
				{title: 'About us', link: '#about'},
			]
		},
		{
			title: 'Categories',
			links: [
				{title: 'Breakfast', link: '#filter_c_breakfast'},
				{title: 'Lunch', link: '#filter_c_lunch'},
				{title: 'Dinner', link: '#filter_c_dinner'},
				{title: 'Dessert', link: '#filter_c_dessert'},
				{title: 'Drink', link: '#filter_c_drink'},
			]
		},
		{
			title: 'Social',
			links: [
				{title: 'Instagram', link: '#'},
				{title: 'Twitter', link: '#'},
				{title: 'Youtube', link: '#'},
				{title: 'Facebook', link: '#'},
			]
		}
	];
	for(const group of sitemap) {
		const groupElement = sitemapElement.appendChild(Utilities.createElementExt('li'));
		groupElement.appendChild(Utilities.createElementExt('h5', 'sitemap__group-title', {}, group.title));
		const innerListElement = groupElement.appendChild(Utilities.createElementExt('ul', 'sitemap__links'));
		for(const link of group.links) {
			innerListElement.appendChild(Utilities.createElementExt('li')).appendChild(
				Utilities.createElementExt('a', 'sitemap__link', {href: link.link}, link.title)
			);
		}
	}

	const formElement = footerElement.appendChild(
		Utilities.createElementExt('form', ['footer__block', 'footer__block--form', 'form', 'form--signup'])
	);
	formElement.append(
		Utilities.createElementExt('h4', 'form__title', {}, 'Sign up for our newsletter'),
		Utilities.createElementExt('input', 'form__input', {type: 'email', placeholder: 'Your email address'}),
		Utilities.createElementExt('button', ['btn','form__button'], {}, 'Submit'),
	);

	return footerElement;
};

export default footer;
