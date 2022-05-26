import getSupabase, { supabaseTableName } from './getSupabase';

const fetchTodos = () =>
	new Promise(async (resolve, reject) => {
		try {
			let supabase = getSupabase();

			let { data: todos, error } = await supabase
				.from(supabaseTableName)
				.select('*')
				.order('orderNumber', { ascending: true });

			if (error) reject(error);

			resolve(todos);
		} catch (error) {
			reject(error);
		}
	});

export default fetchTodos;
