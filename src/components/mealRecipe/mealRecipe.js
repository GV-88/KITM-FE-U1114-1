import Utilities from '../../Utilities';
import { MealDBItem } from '../../modules/Api';
import ItemBlockList from '../../modules/ItemBlockList';
import ItemBlockMealArea from '../../modules/ItemBlockMealArea';
import ItemBlockMealCategory from '../../modules/ItemBlockMealCategory';
import ItemBlockMealIngredient from '../../modules/ItemBlockMealIngredient';
import './mealRecipe.scss';

const mealRecipe = async function (dataObj, ingredientsLib, categoriesLib, onSearch) {

	//title, picture, category, area, ingredients, instructions, YouTube

	const ingredientsList = new ItemBlockList(
		(...args) => {return new ItemBlockMealIngredient(...args);},
		null,
		ingredientsLib,
		onSearch,
		dataObj.ingredients.map(i => i.ingredient)
	);

	const categoryBlock = dataObj.strCategory ? new ItemBlockMealCategory(
		categoriesLib.basicItemConstructor(dataObj.strCategory),
		categoriesLib.getItem.bind(categoriesLib),
		onSearch
	) : null;

	const areaBlock = dataObj.strArea ? new ItemBlockMealArea(
		new MealDBItem(dataObj.strArea),
		null,
		onSearch
	) : null;

	const titleElement = Utilities.createElementExt('h3', 'meal-recipe__title', {}, dataObj.title);
	const pictureElement = Utilities.createElementExt('img', 'meal-recipe__picture', {src: dataObj.getImageUrl()});
	const instructionsElement = Utilities.createElementExt('div', 'meal-recipe__instructions');
	const sourceElement = dataObj.strSource ? Utilities.createElementExt(
		'a', 'meal-recipe__source', {href: dataObj.strSource, target: '_blank'}, 'source'
	) : null;

	instructionsElement.append(...(Utilities.stringToParagraphs(dataObj.strInstructions)));

	const containerElement = Utilities.createElementExt('div', 'meal-recipe', 
		{'data-id': dataObj.id, 'data-title': Utilities.cleanString(dataObj.title)});

	await ingredientsList.init();
	const ingredientsElement = ingredientsList.getElementRef();
	ingredientsElement.classList.add('meal-recipe__ingredients');

	//hack: inject additional elements into component DOM
	ingredientsElement.querySelectorAll('li').forEach((el) => {
		const rcpIngredient = dataObj.ingredients.find((i) => Utilities.cleanString(i.ingredient) === el.dataset.title);
		if(rcpIngredient) {
			el.appendChild(Utilities.createElementExt('div', 'meal-recipe__measure', {}, rcpIngredient.measure));
		}
	});

	await categoryBlock.init();
	await areaBlock.init();

	for(let el of [
		pictureElement,
		titleElement,
		categoryBlock.getElementRef(),
		areaBlock.getElementRef(),
		ingredientsElement,
		instructionsElement,
		sourceElement]) {
		if(el) {
			containerElement.appendChild(el);
		}
	}

	return containerElement;
};

export default mealRecipe;
