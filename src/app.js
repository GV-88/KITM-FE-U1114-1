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

const mealsListObj = new MealsList(ingredientsLibrary, categoriesLibrary, areasLibrary, searchHistory, async (query, title) => {
	// await switchToBrowsingMode();
	// mealsListObj.submitFormFilter(query);
	await prepareMealsList(false, title);
	mealsListObj.displayResult(MealsApi.filterMeals(query));
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
	innerContainerElement.querySelector('.hero__link[href="#recipes"]').addEventListener('click', switchToBrowsingMode);
	loadLandingFeaturedMeals(3);
	await mealsListObj.setHeaderElement(listHeader());
	innerContainerElement.querySelector('.hero__button').addEventListener('click', () => switchToBrowsingMode());
	mealsListElement.querySelector('.list-header__button').addEventListener('click', () => switchToBrowsingMode());
};

const switchToBrowsingMode = async (preventDefault) => {
	if(state.pageMode === 'browsing') {
		return;
	}
	document.querySelectorAll('section[landing]').forEach(el => {
		Utilities.clearChildren(el);
		Utilities.smoothRemove(innerContainerElement, el);
	});
	state.pageMode = 'browsing';

	if(preventDefault === true) {
		return;
	}
	//default when switching from landing mode
	prepareMealsList(true, null);
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

const prepareMealsList = async (hasForm, title) => {
	switchToBrowsingMode(true);
	mealsListObj.clear();
	Utilities.toggleClassByCondition(document.querySelector('.searchbar'), 'searchbar--link-to-advanced', hasForm === false);
	if(title !== undefined) {
		await mealsListObj.setHeaderElement(title ? listHeader(title) : null);
	}
	if(hasForm ?? true) {
		await mealsListObj.addForm();
	}
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
			await prepareMealsList(true, null);
			if(val) {
				mealsListObj.prefillForm(val);
				mealsListObj.submitFormSearch(val);
			}
		},
		async (val) => {
			await prepareMealsList(true, null);
			if(val) {
				mealsListObj.prefillForm(val);
			}
		}
	));
	innerContainerElement = pageContainerElement.appendChild(Utilities.createElementExt('div', 'inner-container'));
	const footerElement = pageContainerElement.appendChild(await footer());
	await mealsListObj.init(false);
	mealsListElement = mealsListObj.getElementRef();
	buildLandingPageContent();
	headerElement.querySelector('.logo').addEventListener('click', switchToLandingMode);
	footerElement.querySelector('.logo').addEventListener('click', switchToLandingMode);
	headerElement.querySelector('.header__nav-link[href="#home"]').addEventListener('click', switchToLandingMode);
	headerElement.querySelector('.header__nav-link[href="#recipe"]').addEventListener('click', switchToBrowsingMode);
	headerElement.querySelector('.header__nav-link[href="#about"]').addEventListener('click', switchToLandingMode);
	footerElement.querySelector('.sitemap__link[href="#home"]').addEventListener('click', switchToLandingMode);
	footerElement.querySelector('.sitemap__link[href="#recipe"]').addEventListener('click', switchToBrowsingMode);
	footerElement.querySelector('.sitemap__link[href="#about"]').addEventListener('click', switchToLandingMode);
	footerElement.querySelectorAll('.sitemap__link[href^="#filter_c_"]').forEach(el => el.addEventListener('click', async (e) => {
		const q = e.currentTarget.href.split('filter_c_').at(-1);
		await prepareMealsList(false, e.currentTarget.innerText);
		mealsListObj.displayResult(MealsApi.filterMeals({category: q}));
	}));
	headerElement.querySelector('.searchbar__input').setAttribute('list', searchHistory.getId());
	await searchHistory.init();
	pageContainerElement.appendChild(searchHistory.getElementRef());
	searchHistory.update();
};


buildInitContent();
