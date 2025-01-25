import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jmjhztxvagsugahlnmrb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imptamh6dHh2YWdzdWdhaGxubXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMzA3NjksImV4cCI6MjA1MTYwNjc2OX0.WH7keHJ9aS5cF8Q8__DoQZPQyRws2v-9F2bVfz7CLi0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Upsert client data (insert or update).
 *
 * @param {string} clientName - Client name.
 * @param {number} numDiasPagamento - Number of payment days.
 */
console.log("supabase client file");
export const upsertClientData = async (clientName, numDiasPagamento) => {
    try {
        const { data: existingClient, error: fetchError } = await supabase
            .from('client_dates')
            .select('*')
            .eq('client_id', clientName)
            .single();
        
            console.log('Existing Client:', existingClient);
            console.log('Fetch Error:', fetchError);
        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error fetching client data:', fetchError);
            throw new Error(`Erro ao verificar cliente existente: ${fetchError.message}`);
        }

        if (existingClient) {
            const { error: updateError } = await supabase
                .from('client_dates')
                .update({ num_dias_pagamento: numDiasPagamento })
                .eq('client_id', clientName);

            if (updateError) {
                throw new Error(`Erro ao atualizar cliente: ${updateError.message}`);
            }

            return alert("campo salvo com sucessso");
        } else {
            const { error: insertError } = await supabase
                .from('client_dates')
                .insert([{ client_id: clientName, num_dias_pagamento: numDiasPagamento }]);

            if (insertError) {
                throw new Error(`Erro ao salvar cliente: ${insertError.message}`);
            }

            return 'Cliente salvo com sucesso!';
        }
    } catch (err) {
        console.error('Unexpected error during upsert operation:', err);
        throw new Error('Um erro inesperado ocorreu ao salvar os dados.');
    }
};

/**
 * Read client data from Supabase.
 *
 * @param {string|null} clientName - Client name to filter (null for all clients).
 * @returns {Promise<Object[]>} - List of client data.
 */
export const readClientData = async (clientName = null) => {
    console.log("dentro funcao readclient data");
    try {
        let query = supabase.from('client_dates').select('*');
		console.log("TCL: readClientData -> query", query)

        if (clientName) {
            query = query.eq('client_id', clientName);
        }

        const { data, error } = await query;

        if (error) {
            throw new Error(`Erro ao buscar dados do cliente: ${error.message}`);
        }

        // Return specific client data or a list of all clients
        if (clientName) {
            return data.length > 0 ? data[0] : null; // Return single client or null if not found
        }

        return data; // Return all clients
    } catch (err) {
        console.error('Error fetching client data:', err);
        throw new Error('Um erro ocorreu ao buscar os dados.');
    }
};

/**
 * Delete client data from Supabase.
 *
 * @param {string} clientName - Client name to delete.
 * @returns {Promise<string>} - Success message.
 */
export const deleteClientData = async (clientName) => {
    try {
        const { error } = await supabase
            .from('client_dates')
            .delete()
            .eq('client_id', clientName);

        if (error) {
            throw new Error(`Erro ao deletar cliente: ${error.message}`);
        }

        return 'Cliente deletado com sucesso!';
    } catch (err) {
        console.error('Error deleting client data:', err);
        throw new Error('Um erro ocorreu ao deletar os dados.');
    }
};

export default supabase;
