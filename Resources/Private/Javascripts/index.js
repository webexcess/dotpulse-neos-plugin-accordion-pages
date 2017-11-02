import Gator from 'gator';
import scroller from './Scroller.js';
import './PushState.js';

let accordion = [];

Element.prototype.accordionPages = function (options) {
	accordion[accordion.length] = new AccordionPages(this, options);
	return this;
};

Object.defineProperty(Object.prototype, 'accordionPages', {
	value: function (options) {
		AccordionPages.cleanArray(this).forEach(element => {
			accordion[accordion.length] = new AccordionPages(element, options);
		});
		return this;
	}
});

class AccordionPages {
	constructor(container, properties) {
		let opt = properties || {};
		let that = this;

		this.element = container;
		this.properties = opt;
		this.items = AccordionPages.cleanArray(container.children);

		this.nohash = container.hasAttribute('data-nohash');
		this.closeOthers = container.hasAttribute('data-close-others');

		this.hashItemId = getPushState().hash;

		this.setPanelDefaultHeight();
		this.itemClick();

		this.openByHash();
		this.openFirstItem();
		this.openFirstActiveItem();

		Gator(window).on(['resize', 'load'], () => {
			setTimeout(() => {
				that.resize();
			}, 100);
		})
	}

	static cleanArray(DirtyArray) {
		return Array.prototype.slice.call(DirtyArray);
	}

	setPanelDefaultHeight() {
		this.items.forEach(item => {
			let itemContent = item.querySelector('.accordion-content');
			// let defaultHeight = Math.ceil(window.getComputedStyle(itemContent.children[0]).height.replace('px', ''));
			// let defaultHeight = parseInt(getComputedStyle(itemContent.children[0]).height);
			let defaultHeight = parseInt(getComputedStyle(itemContent.children[0]).height);
			let defaultMarginTop = parseInt(getComputedStyle(itemContent.children[0]).marginTop);
			let defaultMarginBottom = parseInt(getComputedStyle(itemContent.children[0]).marginBottom);
			let calculatedHeight = defaultHeight + defaultMarginTop + defaultMarginBottom;
			let actualHeight = parseInt(itemContent.style.maxHeight || 0);
			calculatedHeight ++;
			itemContent.setAttribute('data-default-height', calculatedHeight);
			if (actualHeight) {
				itemContent.style.maxHeight = calculatedHeight + 'px';
			}
		});
	}

	openByHash() {
		if (this.hashItemId) {
			let itemContainer = this.element.querySelector('#' + this.hashItemId);
			if (itemContainer) {
				itemContainer.querySelector('.accordion-title').click();
			}
		}
	}

	openFirstItem() {
		if (this.element.hasAttribute('data-open-first')) {
			if (this.element.querySelectorAll('.accordion-item-init-active').length <= 0 && !this.hashItemId) {
				this.element.querySelector('.accordion-title').click();
			}
		}
	}

	openFirstActiveItem() {
		let firstItem = this.element.querySelector('.accordion-item-init-active');
		if (firstItem && !this.hashItemId) {
			firstItem.querySelector('.accordion-title').click();
			firstItem.classList.remove('accordion-item-init-active');
		}
	}

	itemClick() {
		Gator(this.element).on('click', '.accordion-title', event => {
			let itemContainer = event.target.parentNode;
			let isItemOpen = itemContainer.classList.contains('accordion-item-active');

			if (this.closeOthers && !this.nohash) {
				setPushState({hash: itemContainer.id});
			}

			// close all accordionItems if attribute 'data-close-others' is set
			if (this.closeOthers) {
				this.items.forEach(item => {
					AccordionPages.closeItem(item);
				});
			}

			if (!isItemOpen) {
				AccordionPages.openItem(itemContainer);
			} else {
				AccordionPages.closeItem(itemContainer);
				setPushState();
			}
		});
	}

	resize() {
		this.setPanelDefaultHeight();
	}

	static openItem(item) {
		item.classList.add('accordion-item-active');
		item.querySelector('.accordion-content').style.maxHeight = item.querySelector('.accordion-content').getAttribute('data-default-height') + 'px';
		setTimeout(function () {
			scroller(item);
		}, 500);
	}

	static closeItem(item) {
		item.classList.remove('accordion-item-active');
		item.querySelector('.accordion-content').style.maxHeight = 0;
	}
}

module.exports = AccordionPages;
