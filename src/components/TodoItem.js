import * as React from 'react';
import PropTypes from 'prop-types';

import { todoPropType } from './commonPropTypes';
import { checkmarkIcon } from '../styles/icons';

import TodoEditor from './TodoEditor';

function TodoItem({
	todo,
	isSelected,
	isRenaming,
	isTodoAdderOpen,
	toggleTodo,
	renameTodo,
	addTodo,
	setIsRenaming,
	setIsTodoAdderOpen,
	scrollTodos,
}) {
	let todoRef = React.useRef(null);

	React.useEffect(() => {
		if (todoRef.current && isSelected && !isRenaming) {
			let elRect = todoRef.current.getBoundingClientRect();

			// Bottom out of bounds
			if (elRect.bottom > window.innerHeight) {
				scrollTodos(todoRef.current.offsetTop);

				// Top out of bounds
			} else if (elRect.top < 0) {
				scrollTodos(todoRef.current.offsetTop);
			}
		}
	}, [isSelected, isRenaming, scrollTodos]);

	return (
		<>
			{!isRenaming ? (
				<button
					ref={todoRef}
					className='todo'
					style={
						isSelected
							? { backgroundColor: 'rgb(233, 242, 255)' }
							: {}
					}
					onClick={() => toggleTodo(todo)}
				>
					<div
						className={`checkbox ${
							todo.isComplete
								? 'checkbox-selected'
								: 'checkbox-unselected'
						}`}
					>
						{todo.isComplete && checkmarkIcon}
					</div>

					<h4>{todo.title}</h4>
				</button>
			) : (
				<TodoEditor
					mode='edit'
					initialTitle={todo.title}
					renameTodo={renameTodo}
					cancel={() => setIsRenaming(false)}
				/>
			)}

			{isTodoAdderOpen && (
				<TodoEditor
					mode='add'
					addTodo={addTodo}
					cancel={() => setIsTodoAdderOpen(false)}
				/>
			)}
		</>
	);
}

TodoItem.propTypes = {
	todo: todoPropType.isRequired,
	isSelected: PropTypes.bool.isRequired,
	isRenaming: PropTypes.bool.isRequired,
	isTodoAdderOpen: PropTypes.bool.isRequired,
	toggleTodo: PropTypes.func.isRequired,
	renameTodo: PropTypes.func.isRequired,
	addTodo: PropTypes.func.isRequired,
	setIsRenaming: PropTypes.func.isRequired,
	setIsTodoAdderOpen: PropTypes.func.isRequired,
	scrollTodos: PropTypes.func.isRequired,
};

const propsToWatch = ['todo', 'isSelected', 'isRenaming', 'isTodoAdderOpen'];
function propsAreEqual(prevProps, nextProps) {
	let i = 0;
	while (i < propsToWatch.length) {
		let propToWatch = propsToWatch.at(i);
		if (prevProps[propToWatch] !== nextProps[propToWatch]) {
			return false;
		}
		i++;
	}
	return true;
}

export default React.memo(TodoItem, propsAreEqual);
