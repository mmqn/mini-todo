import getSupabase, { supabaseTableName } from './getSupabase';

/**
 * @param {Object[]} todoIds
 */
const deleteTodo = todoIds =>
	new Promise(async (resolve, reject) => {
		try {
			let supabase = getSupabase();

			let { data: deletedTodos, error } = await supabase
				.from(supabaseTableName)
				.delete()
				.or(todoIds.map(todoId => `id.eq.${todoId}`).join(','));

			if (error) reject(error);

			resolve(deletedTodos);
		} catch (error) {
			reject(error);
		}
	});

export default deleteTodo;
