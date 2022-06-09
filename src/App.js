import * as React from 'react';

import './styles/app.css';
import { nanoid } from 'nanoid';
import apiFetchTodos from './utils/fetchTodos';
import apiAddTodos from './utils/addTodos';
import apiUpdateTodos from './utils/updateTodos';
import apiDeleteTodo from './utils/deleteTodo';
import {
	sortTodos,
	resetOrderNumbers,
	getCompletedTodos,
} from './utils/todoOps';

import MiniTodo from './components/MiniTodo';

function App() {
	let [todos, dispatchTodos] = React.useReducer(todosReducer, []);
	let [fetchError, setFetchError] = React.useState('');

	React.useEffect(function initialize() {
		console.log(
			'%c-- Access console functions via window.appConsoleFuncs --',
			'background: #333333; color: #cdff2b',
		);
		fetchTodos();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	React.useEffect(
		function updateConsoleFuncs() {
			window.appConsoleFuncs = getConsoleFuncs(todos, {
				addTodos,
				updateTodos,
				deleteTodos,
			});
		},
		[todos], // eslint-disable-line react-hooks/exhaustive-deps
	);

	function fetchTodos() {
		apiFetchTodos()
			.then(fetchedTodos => {
				dispatchTodos({ type: 'Set Todos', fetchedTodos });
			})
			.catch(handleError);
	}

	// Directly handling todo write/update/delete operations to avoid lag when updating through DB API

	/**
	 * @param {Object[]} newTodos
	 */
	function addTodos(newTodos) {
		dispatchTodos({ type: 'Add Todos', newTodos });
		apiAddTodos(newTodos).then(fetchTodos).catch(handleError);
	}

	/**
	 * @param {Object[]} todoUpdates: Each update object must contain the ID
	 * and only the changed fields.
	 */
	function updateTodos(todoUpdates) {
		dispatchTodos({ type: 'Update Todos', todoUpdates });
		apiUpdateTodos(todoUpdates).catch(handleError);
	}

	/**
	 * @param {Object[]} todoIds
	 */
	function deleteTodos(todoIds) {
		dispatchTodos({ type: 'Delete Todos', todoIds });
		apiDeleteTodo(todoIds).catch(handleError);
	}

	function handleError(error) {
		console.error(error);
		setFetchError(error.message);
	}

	return (
		<>
			<MiniTodo
				todos={todos}
				fetchTodos={fetchTodos}
				addTodos={addTodos}
				updateTodos={updateTodos}
				deleteTodos={deleteTodos}
			/>

			{fetchError && <div className='error-overlay'>{fetchError}</div>}

			{process.env.REACT_APP_KIOSK_MODE === 'true' && (
				<style>{`* { cursor: none !important }`}</style>
			)}
		</>
	);
}

function todosReducer(state, action) {
	switch (action.type) {
		case 'Set Todos': {
			return action.fetchedTodos;
		}
		case 'Reset Todos': {
			return [];
		}
		case 'Add Todos': {
			let newTodos = action.newTodos.map(todo => ({
				...todo,
				id: nanoid(4),
			}));
			return [...state, ...newTodos];
		}
		case 'Update Todos': {
			let newTodos = [...state];

			action.todoUpdates.forEach(todoUpdate => {
				let targetTodoIndex = newTodos.findIndex(
					todo => todo.id === todoUpdate.id,
				);
				if (targetTodoIndex !== -1) {
					let targetTodo = newTodos[targetTodoIndex];
					newTodos[targetTodoIndex] = {
						...targetTodo,
						...todoUpdate,
					};
				}
			});

			return sortTodos(newTodos);
		}
		case 'Delete Todos': {
			let newTodos = [...state];

			action.todoIds.forEach(targetTodoId => {
				let targetTodoIndex = newTodos.findIndex(
					todo => todo.id === targetTodoId,
				);
				if (targetTodoIndex !== -1) newTodos.splice(targetTodoIndex, 1);
			});

			return newTodos;
		}
		default: {
			throw new Error(`Invalid action type: ${action.type}`);
		}
	}
}

function getConsoleFuncs(todos, { addTodos, updateTodos, deleteTodos }) {
	return {
		viewTodos() {
			console.table(todos);
		},
		addMultipleTodos(newTodosStringArray) {
			let lastTodoOrderNumber = todos.at(-1).orderNumber;

			let newTodos = newTodosStringArray.map((todo, index) => ({
				title: todo,
				isComplete: false,
				orderNumber: lastTodoOrderNumber + index + 1,
			}));

			addTodos(newTodos);
		},
		deleteCompletedTodos() {
			let completedTodoIds = getCompletedTodos(todos);

			if (completedTodoIds.length > 0) {
				deleteTodos(completedTodoIds);
			} else {
				console.warn('No completed todos found.');
			}
		},
		reorder(oldOrderNumber, newOrderNumber) {
			let newTodos = [...todos];

			// Get todo at given order number
			let targetTodos = newTodos.splice(oldOrderNumber - 1, 1);

			if (targetTodos.length === 1) {
				// Add retrieved todo at new order number
				newTodos.splice(newOrderNumber - 1, 0, targetTodos[0]);

				let reorderedTodos = resetOrderNumbers(newTodos);
				updateTodos(reorderedTodos);
			} else {
				console.warn('No todo found at given order number.');
			}
		},
		resetOrderNumbers() {
			let reorderedTodos = resetOrderNumbers(todos);
			updateTodos(reorderedTodos);
		},
	};
}

export default App;
