import * as React from 'react';
import PropTypes from 'prop-types';

function MultiUseMenu({
	mountTodoAdder,
	deleteTodo,
	setIsRenaming,
	refetchTodos,
	closeMultiUseMenu,
}) {
	let [showDeleteConfirmation, setShowDeleteConfirmation] =
		React.useState(false);

	let handleActionPreflight = event => {
		let action = event.target.innerText;

		let actions = {
			Add: () => {
				mountTodoAdder();
				closeMultiUseMenu();
			},
			Delete: () => {
				setShowDeleteConfirmation(true);
			},
			Rename: () => {
				setIsRenaming(true);
				closeMultiUseMenu();
			},
			Refetch: () => {
				refetchTodos();
				closeMultiUseMenu();
			},
			Cancel: () => {
				closeMultiUseMenu();
			},
		};

		actions[action]();
	};

	let handleConfirmDeleteTodo = () => {
		deleteTodo();
		closeMultiUseMenu();
	};

	return (
		<div className='multi-use-menu'>
			<button onClick={handleActionPreflight}>Add</button>

			<button
				style={
					showDeleteConfirmation
						? { backgroundColor: 'rgb(255, 106, 106)' }
						: {}
				}
				onClick={
					!showDeleteConfirmation
						? handleActionPreflight
						: handleConfirmDeleteTodo
				}
			>
				{!showDeleteConfirmation ? 'Delete' : 'Sure?'}
			</button>

			<button onClick={handleActionPreflight}>Rename</button>

			<button onClick={handleActionPreflight}>Refetch</button>

			<button
				style={{ backgroundColor: 'rgb(125, 125, 125)' }}
				onClick={handleActionPreflight}
			>
				Cancel
			</button>
		</div>
	);
}

MultiUseMenu.propTypes = {
	mountTodoAdder: PropTypes.func.isRequired,
	deleteTodo: PropTypes.func.isRequired,
	setIsRenaming: PropTypes.func.isRequired,
	refetchTodos: PropTypes.func.isRequired,
	closeMultiUseMenu: PropTypes.func.isRequired,
};

export default MultiUseMenu;
