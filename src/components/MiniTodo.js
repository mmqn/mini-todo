import * as React from 'react';
import PropTypes from 'prop-types';

import { todoPropType } from './commonPropTypes';
import { shiftTodoOrderNumbers } from '../utils/todoOps';

import TodoItem from './TodoItem';
import TodoEditor from './TodoEditor';
import NavigationButtons from './NavigationButtons';
import MultiUseMenu from './MultiUseMenu';
import { journalIcon } from '../styles/icons';

function MiniTodo({ todos, fetchTodos, addTodos, updateTodos, deleteTodos }) {
	let [selectedTodoIndex, setSelectedTodoIndex] = React.useState(0);
	let [isMultiUseMenuOpen, setIsMultiUseMenuOpen] = React.useState(false);
	let [isRenaming, setIsRenaming] = React.useState(false);
	let [isTodoAdderOpen, setIsTodoAdderOpen] = React.useState(false);

	let todosRef = React.useRef(null);

	// Selected todo is determined by traversing up and down through the todos list
	let changeSelectedTodo = direction => {
		if (direction === 'up') {
			setSelectedTodoIndex(prevState => {
				let newIndex = prevState - 1;
				if (newIndex < 0) return prevState;
				return newIndex;
			});
		} else if (direction === 'down') {
			setSelectedTodoIndex(prevState => {
				let newIndex = prevState + 1;
				if (newIndex > todos.length - 1) return prevState;
				return newIndex;
			});
		}
	};

	let toggleTargetTodo = todo => {
		updateTodos([{ id: todo.id, isComplete: !todo.isComplete }]);
	};

	let toggleSelectedTodo = () => {
		let targetTodo = todos[selectedTodoIndex];
		updateTodos([
			{ id: targetTodo.id, isComplete: !targetTodo.isComplete },
		]);
	};

	let renameTodo = newTitle => {
		let targetTodo = todos[selectedTodoIndex];
		updateTodos([{ id: targetTodo.id, title: newTitle }]);
		setIsRenaming(false);
	};

	let addTodo = title => {
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
	};

	let deleteTodo = () => {
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
	};

	let scrollTodos = top => {
		todosRef.current.scrollTo({ top });
	};

	let openMultiUseMenu = () => {
		setIsMultiUseMenuOpen(true);
	};

	return (
		<div className='app'>
			<div ref={todosRef} className='todos'>
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
						addTodo={addTodo}
						setIsTodoAdderOpen={setIsTodoAdderOpen}
					/>
				)}

				{todos.length === 0 && !isTodoAdderOpen && journalIcon}
			</div>

			{!isMultiUseMenuOpen ? (
				<NavigationButtons
					changeSelectedTodo={changeSelectedTodo}
					toggleSelectedTodo={toggleSelectedTodo}
					openMultiUseMenu={openMultiUseMenu}
				/>
			) : (
				<MultiUseMenu
					mountTodoAdder={() => setIsTodoAdderOpen(true)}
					deleteTodo={deleteTodo}
					setIsRenaming={setIsRenaming}
					refetchTodos={fetchTodos}
					closeMultiUseMenu={() => setIsMultiUseMenuOpen(false)}
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
};

export default MiniTodo;
