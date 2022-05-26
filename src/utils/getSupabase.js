import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
export const supabaseTableName = process.env.REACT_APP_TABLE_NAME;

const supabase =
	supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : {};

const getSupabase = () => {
	if (!supabaseUrl) {
		throw new Error('Missing Supabase URL');
	} else if (!supabaseKey) {
		throw new Error('Missing Supabase anon key');
	} else if (!supabaseTableName) {
		throw new Error('Missing Supabase table name');
	} else {
		return supabase;
	}
};

export default getSupabase;
