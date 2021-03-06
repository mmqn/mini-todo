import * as React from 'react';
import PropTypes from 'prop-types';

function TodoEditor({ mode, initialTitle, renameTodo, addTodo, cancel }) {
	let inputRef = React.useRef(null);

	React.useEffect(() => {
		if (inputRef.current) inputRef.current.focus();
	}, [inputRef.current]);

	let enterFunc = mode === 'edit' ? renameTodo : addTodo;

	function handleInputKeyDown(event) {
		if (event.key === 'Enter') enterFunc(event.target.value);
		else if (event.key === 'Escape' || event.key === '`') cancel();
	}

	return (
		<input
			ref={inputRef}
			type='text'
			placeholder='Task'
			defaultValue={initialTitle}
			onKeyDown={handleInputKeyDown}
		/>
	);
}

TodoEditor.propTypes = {
	mode: PropTypes.oneOf(['edit', 'add']).isRequired,
	initialTitle: PropTypes.string,
	renameTodo: PropTypes.func,
	addTodo: PropTypes.func,
	cancel: PropTypes.func.isRequired,
};

export default TodoEditor;
