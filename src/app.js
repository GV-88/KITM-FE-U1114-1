// import '@fontsource/inter';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './scss/style.scss';
import header from './components/header/header';
import footer from './components/footer/footer';
import hero from './components/landingPageContent/hero';
import listHeader from './components/landingPageContent/listHeader';
import Utilities from './Utilities';
import MealsList from './modules/MealsList';
import { AreasLibrary, CategoriesLibrary, IngredientsLibrary } from './modules/Api';

// this is not React, but let's pretend
const state = {
	pageMode: 'landing'
};

// these objects will be built and persist in memory during runtime
const ingredientsLibrary = new IngredientsLibrary();
const categoriesLibrary = new CategoriesLibrary();
const areasLibrary = new AreasLibrary();

const mealsListObj = new MealsList(ingredientsLibrary, categoriesLibrary, areasLibrary);
let mealsListElement;
let innerContainerElement;
const pageContainerElement = document.querySelector('body');

const buildLandingPageContent = async () => {
	innerContainerElement.append(
		hero(),
		mealsListElement, //moves if existing
	);
	await mealsListObj.setHeaderElement(listHeader());
	innerContainerElement.querySelector('.hero__button').addEventListener('click', switchToBrowsingMode);
	mealsListElement.querySelector('.list-header__button').addEventListener('click', switchToBrowsingMode);
};

const switchToBrowsingMode = async (prefillSearch) => {
	if(state.pageMode === 'browsing') {
		return;
	}
	document.querySelectorAll('section[landing]').forEach(el => {
		Utilities.clearChildren(el);
		Utilities.smoothRemove(innerContainerElement, el);
	});
	state.pageMode = 'browsing';
	await mealsListObj.addForm();
	if((prefillSearch ?? null) !== null) {
		mealsListObj.prefillForm(prefillSearch);
	}
};

const switchToLandingMode = () => {
	if(state.pageMode === 'landing') {
		return;
	}
	mealsListObj.clear();
	buildLandingPageContent();
	state.pageMode = 'landing';
};

const buildInitContent = async () => {
	const headerElement = pageContainerElement.appendChild(await header(
		(val) => { console.log('search: ' + val); },
		(val) => { switchToBrowsingMode(val); }
	));
	innerContainerElement = pageContainerElement.appendChild(Utilities.createElementExt('div', 'inner-container'));
	const footerElement = pageContainerElement.appendChild(await footer());
	await mealsListObj.init(false);
	mealsListElement = mealsListObj.getElementRef();
	buildLandingPageContent();
	headerElement.querySelector('.logo').addEventListener('click', switchToLandingMode);
	footerElement.querySelector('.logo').addEventListener('click', switchToLandingMode);
	Array.from(headerElement.querySelectorAll('.header__nav-link')).find(el => el.innerText === 'Home').addEventListener('click', switchToLandingMode);
};


buildInitContent();
