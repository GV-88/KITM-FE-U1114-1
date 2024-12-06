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
import aboutSection from './components/landingPageContent/aboutSection';
import listHeader from './components/landingPageContent/listHeader';
import Utilities from './Utilities';
import MealsList from './modules/MealsList';
import SearchHistory from './modules/SearchHistory';
import { AreasLibrary, CategoriesLibrary, IngredientsLibrary, MealsApi } from './modules/Api';

// this is not React, but let's pretend
const state = {
	pageMode: 'landing'
};

// these global objects will be built and persist in memory during runtime
const ingredientsLibrary = new IngredientsLibrary();
const categoriesLibrary = new CategoriesLibrary();
const areasLibrary = new AreasLibrary();
const searchHistory = new SearchHistory('datalist-searchstring');

const mealsListObj = new MealsList(ingredientsLibrary, categoriesLibrary, areasLibrary, searchHistory, async (q) => {
	await switchToBrowsingMode();
	mealsListObj.submitFormFilter(q);
});
let mealsListElement;
let innerContainerElement;
const pageContainerElement = document.querySelector('body');

const buildLandingPageContent = async () => {
	innerContainerElement.append(
		hero(),
		mealsListElement, //moves if existing
		aboutSection()
	);
	loadLandingFeaturedMeals(3);
	await mealsListObj.setHeaderElement(listHeader());
	innerContainerElement.querySelector('.hero__button').addEventListener('click', () => switchToBrowsingMode());
	mealsListElement.querySelector('.list-header__button').addEventListener('click', () => switchToBrowsingMode());
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
	mealsListObj.clear();
	await mealsListObj.addForm();
	if(typeof (prefillSearch ?? null) === 'string') {
		mealsListObj.prefillForm(prefillSearch);
	}
	document.querySelector('.searchbar').classList.remove('searchbar--link-to-advanced');
};

const switchToLandingMode = () => {
	if(state.pageMode === 'landing') {
		return;
	}
	mealsListObj.clear();
	buildLandingPageContent();
	state.pageMode = 'landing';
	document.querySelector('.searchbar').classList.add('searchbar--link-to-advanced');
};

const loadLandingFeaturedMeals = async (number) => {
	//ideal await strategy: requests sent out sequentially with delay inbetween,
	// local operations such as content rendering can work during delay
	
	const delay = (ms) => {
		return new Promise((resolve) => setTimeout(resolve, ms));
	};

	const delayedRequest = async (ms) => {
		await delay(ms);
		mealsListObj.addMeals(await MealsApi.randomMeal());
	};

	for(let i = 0; i < number; i++) {
		await delayedRequest(i === 0 ? 0 : 500);
	}
};

const buildInitContent = async () => {
	const headerElement = pageContainerElement.appendChild(await header(
		async (val) => {
			await switchToBrowsingMode(val);
			if(val) {
				mealsListObj.submitFormSearch(val);
			}
		},
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
	Array.from(headerElement.querySelectorAll('.header__nav-link')).find(el => el.innerText === 'Recipe').addEventListener('click', switchToBrowsingMode);
	headerElement.querySelector('.searchbar__input').setAttribute('list', searchHistory.getId());
	await searchHistory.init();
	pageContainerElement.appendChild(searchHistory.getElementRef());
	searchHistory.update();
};


buildInitContent();
