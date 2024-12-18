class Utilities {
	static createElementExt(tag, classList, attributes, text) {
		let element = document.createElement(tag);
		if (Array.isArray(classList) && classList.length > 0) {
			element.classList.add(...classList);
		} else if (typeof classList === 'string' && classList.length > 0) {
			element.classList.add(classList);
		}
		if (attributes) {
			for (const key in attributes) {
				element.setAttribute(key, attributes[key]);
			}
		}
		if (text) {
			element.appendChild(document.createTextNode(text));
		}
		return element;
	}

	/**
   * Toggles disabled attribute based on specified condition
   * @param {HTMLElement} element
   * @param {boolean} condition true to enable, false to disable
   */
	static setDisabledAttribute(element, condition) {
		if (!condition) {
			element.setAttribute('disabled', '');
		} else {
			element.removeAttribute('disabled');
		}
	}

	static toggleClassByCondition(element, cssClass, condition) {
		if (condition) {
			element.classList.add(cssClass);
		} else {
			element.classList.remove(cssClass);
		}
	}

	static toggleIconFill(element, condition) {
		if (condition) {
			element.classList.replace('fa-regular', 'fa-solid');
		} else {
			element.classList.replace('fa-solid', 'fa-regular');
		}
	}

	static clearChildren(element) {
		while (element.firstChild) {
			element.removeChild(element.firstChild);
		}
	}

	static smoothRemove(parent, child) {
		if (parent && parent.contains(child ?? null)) {
			parent.removeChild(child);
		}
	}

	/**
   * a primitive implementation of non-standard https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoViewIfNeeded
   * @param {HTMLElement} element
   */
	static scrollIntoViewIfNeeded(element) {
		if(!element) {
			return;
		}
		const viewport = window.visualViewport;
		const rect = element.getBoundingClientRect();
		if (rect.height <= viewport.height) {
			if(rect.top < viewport.offsetTop) {
				element.scrollIntoView(true);
			} else if(rect.bottom > viewport.offsetTop + viewport.height) {
				element.scrollIntoView(false);
			}
		} else {
			const visualCenter = viewport.offsetTop + viewport.height * 0.5;
			if(rect.top > visualCenter || rect.bottom < visualCenter ) {
				element.scrollIntoView(true);
			}
		}
	}

	/**
	 * Leaves only alphanumeric characters in a string, lowercase
	 * @param {string} str 
	 * @returns {string} 
	 */
	static cleanString(str) {
		if (str == '') return 'x';
		return str.replaceAll(/[^a-z^\d]/gi, '').toLowerCase();
	}

	static stringToParagraphs(str, classList) {
		return str ? str.split(/\n|\r/).filter(i => i.match(/\S/i)).map(i => Utilities.createElementExt('p', classList, {}, i)) : [];
	}
};

export default Utilities;
