import Utilities from '../../Utilities';
import './itemBlock.scss';

const renderItemBlockContent = async function (dataObj) {
	const containerElement = Utilities.createElementExt('div', [], {}, dataObj.toString());
	return containerElement;
};

export default renderItemBlockContent;
