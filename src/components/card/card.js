import Utilities from '../../Utilities';
// import * from '../Api';
// import Storage from '../Storage';

// callback hell?
const card = function (initialData, isFavorite, behaviorType, getDetailsFn, onClickFn, onFavoriteFn) {
	// let isFavoriteLocal = isFavorite ?? false;

	const pictureElement = Utilities.createElementExt('img', 'card__picture', {
		src: initialData.strMealThumb,
		title: initialData.title,
	});
	const titleElement = Utilities.createElementExt('h3', 'card__title', { title: initialData.title }, initialData.title);

	//TODO: class syntax & move to more fitting module
	const quickDetails = [
		{
			slug: 'preptime',
			propertyGetter: (obj) => {return null;},
			displayFormatter: (val) => {return val ? `${val} Mins` : 'N/A';},
			icon: 'clock',
		},
		{
			slug: 'serving',
			propertyGetter: (obj) => {return null;},
			displayFormatter: (val) => {return val ? `${val} Serving` : 'N/A';},
			icon: 'circle-user',
		},
		{
			slug: 'difficulty',
			propertyGetter: (obj) => {return null;},
			displayFormatter: (val) => {return val ? `${val}` : 'N/A';},
			icon: 'char-simple',
		},
	];

	const quickDetailsElement = Utilities.createElementExt('div', 'card__quickdetails');
	for(const def of quickDetails) {
		const detailElement = Utilities.createElementExt('div', ['card__quickdetail', `card__quickdetail--${def.slug}`]);
		detailElement.append(
			Utilities.createElementExt('i', ['quickdetail__icon', 'fa-solid', `fa-${def.icon}`]),
			Utilities.createElementExt('span', 'quickdetail__text', {}, def.displayFormatter(def.propertyGetter(initialData)))
		);
		quickDetailsElement.appendChild(detailElement);
	}


	// const favElement = Utilities.createElementExt('i', ['card__fav', 'fav__icon', isFavoriteLocal ? 'fa-solid' : 'fa-regular', 'fa-star'], { 'data-id': initialData.id });

	const detailsElement = Utilities.createElementExt('div', 'card__details', {
		'data-id': initialData.id,
	});

	const gotoItemElement = Utilities.createElementExt('a', 'card__link', { 'data-id': initialData.id }, 'View recipe');

	const textContentElement = Utilities.createElementExt('div', 'card__content');

	textContentElement.append(titleElement, quickDetailsElement, gotoItemElement);

	const interactiveIconsElement = Utilities.createElementExt('div', 'card__interactive-icons');
	// interactiveIconsElement.append(favElement);

	const cardElement = Utilities.createElementExt('div', ['card', 'card--meal'], { 'data-id': initialData.id });
	cardElement.append(pictureElement, textContentElement, detailsElement, interactiveIconsElement);

	const collapsePhase1 = async () => {
		cardElement.classList.remove('card--expanded');
		Utilities.smoothRemove(interactiveIconsElement, interactiveIconsElement.querySelector('.card__collapse-button'));
		Utilities.clearChildren(cardElement.querySelector('.card__details'));
	};

	const expand = () => {
		cardElement.classList.add('card--expanded');
		const collapseBtnElement = interactiveIconsElement.appendChild(
			Utilities.createElementExt('i', [
				'card__collapse-button',
				'fa-solid',
				// 'fa-xmark',
				'fa-down-left-and-up-right-to-center',
			])
		);
		Utilities.scrollIntoViewIfNeeded(cardElement);
		collapseBtnElement.addEventListener('click', collapse, { once: true });
	};

	const collapse = async (e) => {
		e.stopPropagation();
		await collapsePhase1();
		setTimeout(
			gotoItemElement.addEventListener('click', loadDetailsAndExpand, {
				once: true,
			}),
			100
		);
	};

	const loadDetailsAndExpand = async () => {
		cardElement.classList.add('card--busy');
		const detailsContent = await getDetailsFn(initialData.id);
		if (detailsContent instanceof Node) {
			Utilities.clearChildren(detailsElement);
			detailsElement.append(detailsContent);
			expand();
			cardElement.classList.remove('card--busy');
		} else {
			setTimeout(() => {
				cardElement.classList.remove('card--busy');
			}, 1000);
		}
	};

	switch (behaviorType) {
		case 'expand':
			gotoItemElement.addEventListener('click', loadDetailsAndExpand, {
				once: true,
			});
			break;
		case 'autoLoad':
			loadDetailsAndExpand();
			break;
		case 'callback':
			cardElement.addEventListener('click', onClickFn);
			break;
		default:
			break;
	}

	return cardElement;
};

export default card;
