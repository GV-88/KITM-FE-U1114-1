import Utilities from '../../Utilities';
import './itemBlock.scss';

const mealRecipe = async function (dataObj) {
	const containerElement = Utilities.createElementExt('div', [], {}, dataObj.strInstructions);
	return containerElement;
};

export default mealRecipe;
