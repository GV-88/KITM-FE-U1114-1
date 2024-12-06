import Utilities from '../../Utilities';
import './landingPageContent.scss';

const aboutSection = () => {
	const aboutCardElement = Utilities.createElementExt('div', 'about-section__card');
	aboutCardElement.append(
		Utilities.createElementExt('h2', 'about-section__title', {}, 'About us'),
		Utilities.createElementExt('p', 'about-section__text', {}, `
			Our recipes are the heart and soul of our culinary community, and they reflect our commitment to providing you with memorable and delightful dining experiences.
		`),
		Utilities.createElementExt('button', ['btn','about-section__button'], {}, 'Learn more'),
	);
	const sectionElement = Utilities.createElementExt('section', 'about-section', {landing: ''});
	sectionElement.append(aboutCardElement);
	return sectionElement;
};

export default aboutSection;
