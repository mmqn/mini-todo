/**
 * @param {Object[]} todos
 * @returns {Object[]}: Full todo objects sorted by order numbers.
 */
export function sortTodos(todos) {
	let uncompletedTodos = todos
		.filter(todo => !todo.isComplete)
		.sort(sortByOrderNumber);
	let completedTodos = todos
		.filter(todo => todo.isComplete)
		.sort(sortByOrderNumber);
	return uncompletedTodos.concat(completedTodos);
}

function sortByOrderNumber(a, b) {
	return a.orderNumber - b.orderNumber;
}

/**
 * Resets order numbers using current array index number + 1.
 * @param {Object[]} todos
 * @returns {Object[]}: Each todo object is returned as { id, orderNumber }.
 */
export function resetOrderNumbers(todos) {
	return todos.map((todo, index) => {
		return { id: todo.id, orderNumber: index + 1 };
	});
}

/**
 * @param {Object} config
 * @param {Object[]} config.todos: Complete List of todos.
 * @param {Number} config.startingOrderNumber: Todo order numbers will be shifted starting with
 * the todo with this order number.
 * @param {Number} config.shiftAmount: Amount to shift; can be negative.
 * @returns {Object[]}: Only the changed todos will be returned as { id, orderNumber }.
 */
export function shiftTodoOrderNumbers({
	todos,
	startingOrderNumber,
	shiftAmount,
}) {
	return todos
		.filter(todo => todo.orderNumber >= startingOrderNumber)
		.map(todo => ({
			id: todo.id,
			orderNumber: todo.orderNumber + shiftAmount,
		}));
}

/**
 * @param {Object[]} todos
 * @returns {Number[]}: Only the IDs of completed todos will be returned.
 */
export function getCompletedTodos(todos) {
	return todos.filter(todo => todo.isComplete).map(todo => todo.id);
}
