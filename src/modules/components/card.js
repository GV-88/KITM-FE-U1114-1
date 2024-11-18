import utilities from '../../utilities';
// import api from '../api';
// import storage from '../storage';

// callback hell?
const card = function (initialData, isFavorite, behaviorType, getDetailsFn, onClickFn, onFavoriteFn) {
	// let isFavoriteLocal = isFavorite ?? false;

	const pictureElement = utilities.createElementExt('img', 'card__picture', {
		src: initialData.strMealThumb,
		title: initialData.strMeal,
	});
	const titleElement = utilities.createElementExt('h3', 'card__title', { title: initialData.strMeal }, initialData.strMeal);

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

	const quickDetailsElement = utilities.createElementExt('div', 'card__quickdetails');
	for(const def of quickDetails) {
		const detailElement = utilities.createElementExt('div', ['card__quickdetail', `card__quickdetail--${def.slug}`]);
		detailElement.append(
			utilities.createElementExt('i', ['quickdetail__icon', 'fa-solid', `fa-${def.icon}`]),
			utilities.createElementExt('span', 'quickdetail__text', {}, def.displayFormatter(def.propertyGetter(initialData)))
		);
		quickDetailsElement.appendChild(detailElement);
	}


	// const favElement = utilities.createElementExt('i', ['card__fav', 'fav__icon', isFavoriteLocal ? 'fa-solid' : 'fa-regular', 'fa-star'], { 'data-id': initialData.idMeal });

	const detailsElement = utilities.createElementExt('div', 'card__details', {
		'data-id': initialData.idMeal,
	});

	const gotoItemElement = utilities.createElementExt('a', 'card__link', { 'data-id': initialData.idMeal }, 'View recipe');

	const textContentElement = utilities.createElementExt('div', 'card__content');

	textContentElement.append(titleElement, quickDetailsElement, gotoItemElement);

	const interactiveIconsElement = utilities.createElementExt('div', 'card__interactive-icons');
	// interactiveIconsElement.append(favElement);

	const cardElement = utilities.createElementExt('div', ['card', 'card--movie'], { 'data-id': initialData.idMeal });
	cardElement.append(pictureElement, textContentElement, detailsElement, interactiveIconsElement);

	const collapsePhase1 = async () => {
		cardElement.classList.remove('card--expanded');
		utilities.smoothRemove(interactiveIconsElement, interactiveIconsElement.querySelector('.card__collapse-button'));
		utilities.clearChildren(cardElement.querySelector('.card__details'));
	};

	const expand = () => {
		cardElement.classList.add('card--expanded');
		const collapseBtnElement = interactiveIconsElement.appendChild(
			utilities.createElementExt('i', [
				'card__collapse-button',
				'fa-solid',
				// 'fa-xmark',
				'fa-down-left-and-up-right-to-center',
			])
		);
		utilities.scrollIntoViewIfNeeded(cardElement);
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
		const detailsContent = await getDetailsFn(initialData.idMeal);
		if (detailsContent instanceof Node) {
			utilities.clearChildren(detailsElement);
			detailsElement.append(detailsContent);
			expand();
			cardElement.classList.remove('card--busy');
		} else {
			setTimeout(() => {
				cardElement.classList.remove('card--busy');
			}, 1000);
		}
	};

	// favElement.addEventListener('click', async (e) => {
	//   e.stopPropagation();
	//   if (isFavoriteLocal) {
	//     await storage.removeFromFavMovies(initialData.imdbID);
	//     isFavoriteLocal = false;
	//   } else {
	//     await storage.addToFavMovies(initialData);
	//     isFavoriteLocal = true;
	//   }
	//   utilities.toggleIconFill(favElement, isFavoriteLocal);

	//   onFavoriteFn();
	// });

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
