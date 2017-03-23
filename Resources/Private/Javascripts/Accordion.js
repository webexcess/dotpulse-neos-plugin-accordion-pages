function Accordion(accordionContainerClass) {
	if (typeof accordionContainerClass != 'string') {
		return;
	}

	var accordions = document.querySelectorAll(accordionContainerClass);
	var isItemOpen = false;

	(function init() {
		setPanelDefaultHeight();

		[].forEach.call(accordions, function (accordion) {
			// open first element if no other is active
			if (accordion.hasAttribute('data-open-first')) {
				if (accordion.querySelectorAll('.accordion-item-active').length <= 0) {
					accordion.querySelector('.accordion-item').classList.add('accordion-item-active');
				}
			}

			[].forEach.call(accordion.querySelectorAll('.accordion-title'), function (accordionTitle) {
				if (!accordionTitle.parentNode.classList.contains('accordion-item-active')) {
					accordionTitle.nextElementSibling.style.maxHeight = 0;
				} else {
					accordionTitle.nextElementSibling.style.maxHeight = accordionTitle.nextElementSibling.getAttribute('data-default-height');
				}

				accordionTitle.addEventListener('click', function (event) {
					isItemOpen = event.target.parentNode.classList.contains('accordion-item-active');

					if (accordion.hasAttribute('data-close-others')) {
						[].forEach.call(accordion.querySelectorAll('.accordion-item-active'), function (accordionActiveItem) {
							accordionActiveItem.classList.remove('accordion-item-active');
							accordionActiveItem.querySelector('.accordion-content').style.maxHeight = 0;
						});
					}

					if (!isItemOpen) {
						event.target.parentNode.classList.add('accordion-item-active');
						accordionTitle.nextElementSibling.style.maxHeight = accordionTitle.nextElementSibling.getAttribute('data-default-height');
					} else {
						event.target.parentNode.classList.remove('accordion-item-active');
						event.target.nextElementSibling.style.maxHeight = 0;
					}
				});
			});
		});
	})();

	window.addEventListener('resize', setPanelDefaultHeight, false);

	function setPanelDefaultHeight() {
		[].forEach.call(document.querySelectorAll('.accordion-content'), function (accordionContent) {
			accordionContent.setAttribute('data-default-height', window.getComputedStyle(accordionContent.children[0]).height);
		});
	}
}
