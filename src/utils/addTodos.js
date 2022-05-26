import getSupabase, { supabaseTableName } from './getSupabase';

/**
 * @param {Object[]} newTodos
 */
const addTodos = newTodos =>
	new Promise(async (resolve, reject) => {
		try {
			let supabase = getSupabase();

			let { data: addedTodos, error } = await supabase
				.from(supabaseTableName)
				.insert(newTodos);

			if (error) reject(error);

			resolve(addedTodos);
		} catch (error) {
			reject(error);
		}
	});

export default addTodos;
