import PropTypes from 'prop-types';

const todoPropType = PropTypes.shape({
	id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	title: PropTypes.string.isRequired,
	isComplete: PropTypes.bool.isRequired,
	orderNumber: PropTypes.number.isRequired,
});

export { todoPropType };
