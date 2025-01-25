
export const fetchClientData = async (proxyUrl, selectedDivTitle) => {
    try {
        const response = await fetch(proxyUrl, { method: 'GET' });
        console.log("TCL: fetchClientData -> response", response);

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("TCL: fetchClientData -> data", data);

        // Ensure that the data is correctly structured
        if (!data || !data.data) {
            console.error("Invalid API response structure");
            return null;
        }

        // Check if selectedDivTitle matches any of the fields: nome, razao_social, cnpj, or cpf
        const client = data.data.find(client => {
            if (!client) {
                console.warn("Invalid client object found");
                return false;
            }

            return client.nome === selectedDivTitle || 
                client.razao_social === selectedDivTitle ||
                client.cnpj === selectedDivTitle ||
                client.cpf === selectedDivTitle;
        });
        if (!client) {
            console.warn("Client not found");
            return null;
        }

        return client.enderecos.map(e => e.endereco);
    } catch (error) {
        console.error("Error fetching data from API:", error);
        return null;
    }
};


export const fetchClientByCodigo = async (proxyUrl, codigo, nomedocliente) => {
    try {
        const response = await fetch(proxyUrl, { method: 'GET' });
        console.log("TCL: fetchClientByCodigo -> response", response);

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("TCL: fetchClientByCodigo -> data", data);

        // Ensure the data is correctly structured
        if (!data || !Array.isArray(data.data)) {
            console.error("Invalid API response structure");
            return null;
        }

        // Find the client by "codigo" if needed
        const clientByCodigo = codigo
            ? data.data.find(client => client.codigo === codigo)
            : null;

        // Find the client by "nomedocliente"
        const clientByName = data.data.find(client => client.nome === nomedocliente);

        if (!clientByName) {
            console.log(`Client with name "${nomedocliente}" not found.`);
            return null;
        }

        console.log("Client details:", clientByName);
        console.log("nome_vendedor:", clientByName.nome_vendedor);

        // Return both matched client objects or relevant details
        return {
            clientByCodigo,
            nome_vendedor: clientByName.nome_vendedor,
        };
    } catch (error) {
        console.error("Error fetching client by codigo or name:", error);
        return null;
    }
};
