import Utilities from '../../Utilities';
import './landingPageContent.scss';

const listHeader = (customTitle) => {
	const titleElement = Utilities.createElementExt('h2', 'list-header__title', {}, 'Discover, create, share');
	const titleBlockElement = Utilities.createElementExt('div', 'list-header__title-block');
	titleBlockElement.appendChild(titleElement);
	const wrapperElement = Utilities.createElementExt('div', 'list-header', {landing: ''});
	wrapperElement.appendChild(titleBlockElement);
	if(customTitle) {
		titleElement.innerText = customTitle;
	} else {
		titleBlockElement.appendChild(Utilities.createElementExt('div', 'list-header__subtitle', {}, 'Check our most popular recipes of this week'));
		wrapperElement.appendChild(Utilities.createElementExt('button', ['btn', 'list-header__button'], {}, 'See all'));
	}
	return wrapperElement;
};

export default listHeader;
