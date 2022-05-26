import getSupabase, { supabaseTableName } from './getSupabase';

/**
 * @param {Object[]} todoUpdates: Each update object must contain the id
 * and only the changed fields.
 */
const updateTodos = todoUpdates =>
	new Promise(async (resolve, reject) => {
		try {
			let supabase = getSupabase();

			let { data: updatedTodos, error } = await supabase
				.from(supabaseTableName)
				.upsert(todoUpdates);

			if (error) reject(error);

			resolve(updatedTodos);
		} catch (error) {
			reject(error);
		}
	});

export default updateTodos;
