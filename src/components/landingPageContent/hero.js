import Utilities from '../../Utilities';
import './landingPageContent.scss';
import HeroImg from '../../assets/hero_img_1_mod.png';

const hero = () => {
	const heroTextElement = Utilities.createElementExt('p', 'hero__text');
	heroTextElement.append(
		Utilities.createElementExt('span', [], {}, 'Discover more than '),
		Utilities.createElementExt('a', 'hero__link', {href: '#recipes'}, '10,000 recipes'),
		Utilities.createElementExt('span', [], {}, ' in your hand with the best recipe. Help you to find the easiest way to cook.')
	);
	const bodyElement = Utilities.createElementExt('div', 'hero__text-content');
	bodyElement.append(
		Utilities.createElementExt('h1', 'hero__title', {}, 'Cooking made fun and easy: unleash your inner chef'), 
		heroTextElement,
		Utilities.createElementExt('button', ['btn','hero__button'], {}, 'Explore recipes')
	);
	const pictureElement = Utilities.createElementExt('div', 'hero__illustration');
	pictureElement.append(Utilities.createElementExt('img', 'hero__picture', {src: HeroImg}));
	const sectionElement = Utilities.createElementExt('section', 'hero', {landing: ''});
	sectionElement.append(bodyElement, pictureElement);
	return sectionElement;
};

export default hero;
