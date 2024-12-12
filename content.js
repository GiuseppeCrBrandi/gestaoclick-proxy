// Wait for the input field to be available in the DOM
const observer = new MutationObserver(() => {
    const clientField = document.querySelector('#cliente_id');
    if (clientField) {
        console.log("Client field detected:", clientField);
        attachInputListener(clientField); // Attach input listener after detecting the field
        observer.disconnect(); // Stop observing once the field is found
    }
});

function attachInputListener(clientField) {
    let lastValue = "";

    // Attach event listener to detect changes in the input field
    clientField.addEventListener('input', function () {
        const currentValue = clientField.value.trim();
        console.log("Input value:", currentValue);

        // Only trigger when value changes and becomes non-empty (ignoring intermediate typing)
        if (lastValue !== currentValue && currentValue !== "") {
            console.log("Detected name:", currentValue);
            lastValue = currentValue;
            handleValueChange(currentValue); // Trigger the API call after the field is filled
        }
    });

    console.log("Input listener attached to client field.");
}

// Function to make the API request when the client name is detected
async function handleValueChange(value) {
    console.log("Making API call with client name:", value);

    try {
        // Your API endpoint (replace with actual client ID or name if required by API)
        const apiUrl = `https://api.beteltecnologia.com/clientes
`;


        // Make the API request
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'access-token': 'aad8e68cc48aff6eda60b2ac2f36a73b5a9666c5',  // Replace with your actual access token
                'secret-access-token': '4b5955397169bb81ae75b464cb05aec9b71a3312' // Replace with your actual secret access token
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log("API Response:", data);

            const address = data.data?.enderecos?.[0]?.endereco;
            if (address) {
                console.log("Client Address:", address);
                // Optionally update the address field in the UI
                const addressField = document.querySelector('#addressField'); // Replace with actual selector
                if (addressField) {
                    addressField.value = `${address.logradouro}, ${address.numero}, ${address.bairro}, ${address.nome_cidade}, ${address.estado}, ${address.cep}`;
                }
            } else {
                console.warn("No address found in API response.");
            }
        } else {
            console.error("API request failed with status:", response.status);
        }
    } catch (error) {
        console.error("Error during API call:", error);
    }
}

// Start observing the DOM for the client input field
observer.observe(document.body, { childList: true, subtree: true });
