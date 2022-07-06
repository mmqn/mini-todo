import * as React from 'react';
import PropTypes from 'prop-types';

import { chevronIcon, dotIcon } from '../styles/icons';

const MENU_BTN_TIMEOUT = 300;

function NavigationButtons({
	changeSelectedTodo,
	toggleSelectedTodo,
	openMultiUseMenu,
	isLocked,
}) {
	let timeout = React.useRef(null);
	let didMultiUseMenuOpen = React.useRef(false);

	function handleMenuBtnMouseDown() {
		timeout.current = setTimeout(() => {
			openMultiUseMenu();
			didMultiUseMenuOpen.current = true;
		}, MENU_BTN_TIMEOUT);
	}

	function handleMenuBtnMouseUp() {
		clearTimeout(timeout.current);

		if (!didMultiUseMenuOpen.current) toggleSelectedTodo();
		didMultiUseMenuOpen.current = false;
	}

	return (
		<div className='navigation-buttons'>
			<button
				className='navigation-button'
				onClick={() => changeSelectedTodo('up')}
			>
				{chevronIcon}
			</button>

			<button
				className='navigation-button'
				style={isLocked ? { filter: 'grayscale(1)' } : {}}
				disabled={isLocked}
				onMouseDown={handleMenuBtnMouseDown}
				onTouchStart={handleMenuBtnMouseDown}
				onMouseUp={handleMenuBtnMouseUp}
				onTouchEnd={handleMenuBtnMouseUp}
			>
				{dotIcon}
			</button>

			<button
				className='navigation-button'
				style={{ transform: 'rotate(180deg)' }}
				onClick={() => changeSelectedTodo('down')}
			>
				{chevronIcon}
			</button>
		</div>
	);
}

NavigationButtons.propTypes = {
	changeSelectedTodo: PropTypes.func.isRequired,
	toggleSelectedTodo: PropTypes.func.isRequired,
	openMultiUseMenu: PropTypes.func.isRequired,
	isLocked: PropTypes.bool.isRequired,
};

export default NavigationButtons;
