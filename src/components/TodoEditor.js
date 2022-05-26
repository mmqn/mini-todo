import * as React from 'react';
import PropTypes from 'prop-types';

function TodoEditor({
	mode,
	initialTitle,
	renameTodo,
	addTodo,
	setIsRenaming,
	setIsTodoAdderOpen,
}) {
	let inputRef = React.useRef(null);

	React.useEffect(() => {
		inputRef.current?.focus();
	}, []);

	let handleEditChange = event => {
		if (event.key === 'Enter') renameTodo(event.target.value);
		else if (event.key === 'Escape') setIsRenaming(false);
	};

	let handleAddChange = event => {
		if (event.key === 'Enter') addTodo(event.target.value);
		else if (event.key === 'Escape') setIsTodoAdderOpen(false);
	};

	let handleKeyDown = mode === 'edit' ? handleEditChange : handleAddChange;

	return (
		<input
			ref={inputRef}
			type='text'
			placeholder='Task'
			defaultValue={initialTitle}
			onKeyDown={handleKeyDown}
		/>
	);
}

TodoEditor.propTypes = {
	mode: PropTypes.oneOf(['edit', 'add']),
	initialTitle: PropTypes.string,
	renameTodo: PropTypes.func,
	addTodo: PropTypes.func,
	setIsRenaming: PropTypes.func,
	setIsTodoAdderOpen: PropTypes.func,
};

export default TodoEditor;
