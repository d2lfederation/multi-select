import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import 'd2l-colors/d2l-colors.js';
import 'd2l-typography/d2l-typography-shared-styles.js';
import 'd2l-icons/d2l-icon.js';
import 'd2l-icons/tier1-icons.js';
import 'd2l-offscreen/d2l-offscreen.js';
import 'd2l-tooltip/d2l-tooltip.js';
import './localize-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = `<dom-module id="d2l-multi-select-list-item">
	<template strip-whitespace="">
		<style>
			:host {
				cursor: pointer;
				display: inline-block;
				outline: none;
				position: relative;
			}

			.d2l-multi-select-list-item-wrapper {
				@apply --d2l-body-compact-text;
				-moz-user-select: none;
				-ms-user-select: none;
				-webkit-user-select: none;

				align-items: center;
				background-color: var(--d2l-color-sylvite);
				border: 1px solid var(--d2l-color-gypsum);
				border-radius: 0.25rem;
				cursor: pointer;
				display: flex;
				line-height: normal;
				outline: none;
				padding: 0.25rem 0.75rem 0.2rem;
			}

			:host([deletable]) .d2l-multi-select-list-item-wrapper {
				padding-right: 0.4rem;
			}

			:host([dir='rtl'][deletable]) .d2l-multi-select-list-item-wrapper {
				padding-left: 0.4rem;
				padding-right: 0.75rem;
			}

			:host(:hover) .d2l-multi-select-list-item-wrapper {
				background-color: var(--d2l-color-gypsum);
				border-color: var(--d2l-color-mica);
			}

			:host(:hover) .d2l-multi-select-list-item-wrapper d2l-icon:hover {
				color: var(--d2l-color-ferrite);
			}

			:host(:focus) .d2l-multi-select-list-item-wrapper {
				background-color: var(--d2l-color-celestine);
				border-color: var(--d2l-color-celestine-minus-1);
				color: #ffffff;
			}
			:host(:focus) .d2l-multi-select-list-item-wrapper d2l-icon {
				color: #ffffff;
				opacity: 0.75;
			}

			:host(:focus) .d2l-multi-select-list-item-wrapper d2l-icon:hover {
				color: #ffffff;
				opacity: 1;
			}

			d2l-icon {
				--d2l-icon-height: 0.5rem;
				--d2l-icon-width: 0.5rem;
				color: var(--d2l-color-galena);
				cursor: pointer;
				padding: 0.2rem;
				margin-left: 0.15rem;
				vertical-align: middle;
			}

			d2l-icon[hidden] {
				display: none;
			}

			:host(:dir(rtl)) d2l-icon {
				margin-left: 0;
				margin-right: 0.15rem;
			}
			
			d2l-tooltip {
				@apply --d2l-body-small-text;
				color: var(--d2l-color-white);
				width: max-content;
				max-width: 300px;
			}
			
			:host([_fallback-css]) d2l-tooltip {
				min-width: 200px;
			}
			
		</style>

		<div class="d2l-multi-select-list-item-wrapper" id="tag" on-click="_onClick">
			<div class="d2l-multi-select-list-item-text" aria-hidden="true">[[_getVisibleText(text,shortText,maxChars)]]</div>
			<d2l-offscreen>[[_getScreenReaderText(text,shortText)]]</d2l-offscreen>
			<d2l-icon icon="d2l-tier1:close-large-thick" hidden="[[!deletable]]" on-click="_onDeleteItem"></d2l-icon>
		</div>
		<template is="dom-if" if="[[_hasTooltip(text,shortText,maxChars)]]">
			<d2l-tooltip for="tag" position="[[tooltipPosition]]">[[text]]</d2l-tooltip>
		</template>
	</template>
	
</dom-module>`;

document.head.appendChild($_documentContainer.content);
/**
 * `<d2l-multi-select-list-item>`
 * Polymer-based web component for D2L multi-select-list-item
 * @demo demo/index.hmtl
 */
class D2LMultiSelectItem extends mixinBehaviors(
	[D2L.PolymerBehaviors.D2LMultiSelect.LocalizeBehavior], PolymerElement
) {
	static get is() { return 'd2l-multi-select-list-item'; }
	static get properties() {
		return {

			/**
			* Text displayed in the multi-select-list-item.
			*/
			text: {
				type: String,
				value: ''
			},

			/**
			* Alternative text to display on the tag
			* in place of the full text which is shown
			* in the tooltip
			*/
			shortText: {
				type: String,
				value: null
			},

			/**
			* Maximum number of characters to show in the
			* tag before it is truncated and a tooltip is
			* added
			*/
			maxChars: {
				type: Number,
				value: 40
			},

			/**
			* Whether the multi-select-list-item can be deleted.
			*/
			deletable: {
				type: Boolean,
				value: false
			},

			/**
			* The tooltip position
			*/
			tooltipPosition: {
				type: String,
				value: 'top'
			},

			/**
			 * Fallback CSS for Microsoft browsers
			 */
			_fallbackCss: {
				type: Boolean,
				value: function() {
					return !window.CSS || !window.CSS.supports || !window.CSS.supports('width', 'max-content');
				},
				reflectToAttribute: true
			}
		};
	}

	constructor() {
		super();
	}

	connectedCallback() {
		super.connectedCallback();
		// Set tabindex to allow focusable behaviour from the list
		this.tabIndex = -1;
	}

	_hasTooltip(text, shortText, maxChars) {
		return shortText || text.length > maxChars;
	}

	_getVisibleText(text, shortText, maxChars) {
		if (shortText) {
			return shortText;
		}

		if (text.length <= maxChars) {
			return text;
		}

		return text.substring(0, maxChars) + '...';
	}

	_getScreenReaderText(text, shortText) {
		return shortText || text;
	}

	_onClick() {
		// Fix focus not triggering on IE11 when text is clicked
		this.focus();
	}

	_onDeleteItem() {
		this.dispatchEvent(new CustomEvent(
			'd2l-multi-select-list-item-deleted',
			{ bubbles: true, composed: true, detail: { value: this.text } }
		));
	}

	deleteItem() {
		this.parentNode.removeChild(this);
	}
}
customElements.define(D2LMultiSelectItem.is, D2LMultiSelectItem);
