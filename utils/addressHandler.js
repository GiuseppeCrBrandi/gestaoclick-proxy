// addressHandler.js

import { fillCityAndSelect } from "./domUtils.js";


export const handleApiResults = (addresses) => {
    console.log("Processing addresses:", addresses);

    // modal para o display dos endereços
    const modal = document.createElement('div');
    modal.classList.add('unique-address-modal');

    //titulo do modal
    const title = document.createElement('h3');
    title.textContent = 'Endereços disponíveis';
    modal.appendChild(title);

    //cria lista de endereços
    const addressList = document.createElement('div');
    addressList.classList.add('address-list');


    if (addresses.length > 0) {
        addresses.forEach((address, index) => {
            const addressDiv = document.createElement('div');
            addressDiv.classList.add('unique-address-option');
            addressDiv.textContent = `
                ${address.logradouro}, ${address.numero}, ${address.bairro}, ${address.nome_cidade} - ${address.estado}
            `;

            // no clique, preenche formulario
            addressDiv.addEventListener('click', () => {
                fillAddress(address); // Fill the form with the selected address
                console.log("address.cidade_uf antes de entrar na funcao ",address.cidade_uf )
                fillCityAndSelect(address.cidade_uf), 
                document.body.removeChild(modal); // Remove the modal after selection
            });

            addressList.appendChild(addressDiv);
        });

        modal.appendChild(addressList);
    } else {
        console.log("No addresses to display");
    }

    // botao dfe fechar p modal
    const closeButton = document.createElement('unique-button');
    closeButton.textContent = 'Fechar';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal); // Close the modal
    });
    modal.appendChild(closeButton);

    //encaixa modal
    console.log("Appending modal to the DOM");
    document.body.appendChild(modal);
};

// xpath para deifinir fill address
export const fillAddress = (address) => {
    console.log("Filling form with address:", address);

    if (address && Object.keys(address).length > 0) {
        // XPath expressions for form fields
        const xpaths = {
            cep: '//label[contains(text(), "CEP")]/following-sibling::div/input',
            logradouro: '//label[contains(text(), "Logradouro")]/following-sibling::div/input',
            numero: '//label[contains(text(), "Número")]/following-sibling::div/input',
            complemento: '//label[contains(text(), "Complemento")]/following-sibling::div/input',
            bairro: '//label[contains(text(), "Bairro")]/following-sibling::div/input',
            cidade_uf: '//label[contains(text(), "Cidade/UF")]/following-sibling::div/div/input'
        };

        Object.keys(xpaths).forEach((key) => {
            const element = document.evaluate(
                xpaths[key],
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            if (element) {
                // Set the value for cidade_uf by combining nome_cidade and estado
                if (key === 'cidade_uf') {
                    element.value = `${address.nome_cidade} - ${address.estado}` || '';
                    console.log(`Set value for cidade_uf: ${element.value}`);
                } else {
                    element.value = address[key] || '';
                    console.log(`Set value for ${key}:`, address[key] || '');
                }

                // Trigger an input event for proper DOM updates
                const event = new Event('input', { bubbles: true });
                element.dispatchEvent(event);
            } else {
                console.warn(`Element for ${key} not found`);
            }
        });
    } else {
        console.warn("No valid address data to fill");
    }
};

