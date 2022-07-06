import * as React from 'react';
import PropTypes from 'prop-types';

import { todoPropType } from './commonPropTypes';
import { shiftTodoOrderNumbers } from '../utils/todoOps';

import TodoItem from './TodoItem';
import TodoEditor from './TodoEditor';
import NavigationButtons from './NavigationButtons';
import MultiUseMenu from './MultiUseMenu';
import { journalIcon } from '../styles/icons';

function MiniTodo({
	todos,
	fetchTodos,
	addTodos,
	updateTodos,
	deleteTodos,
	isLocked,
}) {
	// Sets highlighted/selected todo
	let [selectedTodoIndex, setSelectedTodoIndex] = React.useState(0);
	let [isMultiUseMenuOpen, setIsMultiUseMenuOpen] = React.useState(false);
	let [isRenaming, setIsRenaming] = React.useState(false);
	let [isTodoAdderOpen, setIsTodoAdderOpen] = React.useState(false);

	let todosRef = React.useRef(null);

	// Highlighted/selected todo is determined by traversing up and down through the todos list
	function changeSelectedTodo(direction) {
		if (direction === 'up') {
			setSelectedTodoIndex(prevState => {
				let newIndex = prevState - 1;
				// If at top and going up, loop to bottom of list
				if (newIndex < 0) return todos.length - 1;
				return newIndex;
			});
		} else if (direction === 'down') {
			setSelectedTodoIndex(prevState => {
				let newIndex = prevState + 1;
				// If at bottom and going down, loop to top of list
				if (newIndex > todos.length - 1) return 0;
				return newIndex;
			});
		}
	}

	// Toggle highlighted/selected todo
	function toggleSelectedTodo() {
		if (!isLocked) {
			let targetTodo = todos[selectedTodoIndex];
			updateTodos([
				{ id: targetTodo.id, isComplete: !targetTodo.isComplete },
			]);
		}
	}

	function toggleTargetTodo(todo) {
		if (!isLocked) {
			updateTodos([{ id: todo.id, isComplete: !todo.isComplete }]);
		}
	}

	function renameTodo(newTitle) {
		let targetTodo = todos[selectedTodoIndex];
		updateTodos([{ id: targetTodo.id, title: newTitle }]);
		setIsRenaming(false);
	}

	function addTodo(title) {
		let isFirstTodo = todos.length === 0;

		let newOrderNumber = isFirstTodo
			? 1 // 1-based indexing for order numbers
			: todos[selectedTodoIndex].orderNumber + 1; // Adds new todo below currently selected one

		let newTodo = {
			title,
			isComplete: false,
			orderNumber: newOrderNumber,
		};
		addTodos([newTodo]);

		let shiftedTodos = shiftTodoOrderNumbers({
			todos,
			startingOrderNumber: newOrderNumber,
			shiftAmount: 1,
		});
		if (shiftedTodos.length > 0) updateTodos(shiftedTodos);

		setIsTodoAdderOpen(false);
		setSelectedTodoIndex(prevState => (isFirstTodo ? 0 : prevState + 1));
	}

	function deleteTodo() {
		let targetTodo = todos[selectedTodoIndex];

		deleteTodos([targetTodo.id]);

		let shiftedTodos = shiftTodoOrderNumbers({
			todos,
			startingOrderNumber: targetTodo.orderNumber + 1,
			shiftAmount: -1,
		});
		if (shiftedTodos.length > 0) updateTodos(shiftedTodos);

		setSelectedTodoIndex(prevState =>
			selectedTodoIndex === todos.length - 1 ? prevState - 1 : prevState,
		);
	}

	function scrollTodos(top) {
		if (todosRef.current) todosRef.current.scrollTo({ top });
	}

	function openMultiUseMenu() {
		setIsMultiUseMenuOpen(true);
	}

	return (
		<div className='app'>
			<div
				ref={todosRef}
				className={[
					'todos',
					process.env.REACT_APP_KIOSK_MODE === 'true' &&
						'hide-scrollbar',
				]
					.filter(Boolean)
					.join(' ')}
			>
				{todos.map((todo, index) => (
					<TodoItem
						key={todo.id}
						todo={todo}
						isSelected={selectedTodoIndex === index}
						isRenaming={isRenaming && selectedTodoIndex === index}
						isTodoAdderOpen={
							isTodoAdderOpen && selectedTodoIndex === index
						}
						toggleTodo={toggleTargetTodo}
						renameTodo={renameTodo}
						addTodo={addTodo}
						setIsRenaming={setIsRenaming}
						setIsTodoAdderOpen={setIsTodoAdderOpen}
						scrollTodos={scrollTodos}
					/>
				))}

				{todos.length === 0 && isTodoAdderOpen && (
					<TodoEditor
						mode='add'
						addTodo={addTodo}
						cancel={() => setIsTodoAdderOpen(false)}
					/>
				)}

				{todos.length === 0 && !isTodoAdderOpen && journalIcon}
			</div>

			{isMultiUseMenuOpen && !isLocked ? (
				<MultiUseMenu
					mountTodoAdder={() => setIsTodoAdderOpen(true)}
					deleteTodo={deleteTodo}
					setIsRenaming={setIsRenaming}
					refetchTodos={fetchTodos}
					closeMultiUseMenu={() => setIsMultiUseMenuOpen(false)}
				/>
			) : (
				<NavigationButtons
					changeSelectedTodo={changeSelectedTodo}
					toggleSelectedTodo={toggleSelectedTodo}
					openMultiUseMenu={openMultiUseMenu}
					isLocked={isLocked}
				/>
			)}
		</div>
	);
}

MiniTodo.propTypes = {
	todos: PropTypes.arrayOf(todoPropType).isRequired,
	fetchTodos: PropTypes.func.isRequired,
	addTodos: PropTypes.func.isRequired,
	updateTodos: PropTypes.func.isRequired,
	deleteTodos: PropTypes.func.isRequired,
	isLocked: PropTypes.bool.isRequired,
};

export default MiniTodo;
