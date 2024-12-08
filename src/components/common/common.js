import Utilities from '../../Utilities';
import './common.scss';
import Logo from '../../assets/logo.svg';

export function interactiveIcon(imgSrc) {
	const iconElement = Utilities.createElementExt('span', 'interactive-icon');
	iconElement.appendChild(Utilities.createElementExt('img', [], {src: imgSrc})); 
	return iconElement;
};

export function logo() {
	const logoElement = Utilities.createElementExt('div', 'logo');
	logoElement.append(
		Utilities.createElementExt('img', 'logo__graphic', {src: Logo}), 
		Utilities.createElementExt('span', 'logo__title', {}, 'Recipedia'));
	return logoElement;
};
