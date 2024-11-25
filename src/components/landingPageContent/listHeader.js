import Utilities from '../../Utilities';
import './landingPageContent.scss';

const listHeader = () => {
	const titleBlockElement = Utilities.createElementExt('div', 'list-header__title-block');
	titleBlockElement.append(
		Utilities.createElementExt('h2', 'list-header__title', {}, 'Discover, create, share'),
		Utilities.createElementExt('div', 'list-header__subtitle', {}, 'Check our most popular recipes of this week'),
	);
	const wrapperElement = Utilities.createElementExt('div', 'list-header', {landing: ''});
	wrapperElement.append(
		titleBlockElement,
		Utilities.createElementExt('button', ['btn', 'list-header__button'], {}, 'See all'),
	);
	return wrapperElement;
};

export default listHeader;
