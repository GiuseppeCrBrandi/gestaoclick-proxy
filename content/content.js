// content.js

import { fetchClientData } from '../api/apiService.js';
import { handleApiResults, fillAddress } from '../utils/addressHandler.js';
import { observeDomChanges } from '../content/domObserver.js';
import { observeCheckbox, observeCustomField, observeBoletoOption } from './htmlObservers.js';
import { supabase, upsertClientData, readClientData } from '../api/supabaseClient.js';
import { waitForElement, waitForDynamicField } from '../utils/domUtils.js';
import { handleMenuItemClick } from './eventHandlers.js';

let isPageLoaded = false;
export const proxUrl = 'https://cors-heroku-3e2793260927.herokuapp.com';

setTimeout(() => {
    isPageLoaded = true;
    console.log("Fallback: Assuming page is loaded after delay");
}, 1000);

// inicializacao do app
const initializeApp = () => {
    observeDomChanges(handleDomChanges);
    observeCheckbox(() => console.log("Checkbox interaction complete"));
    observeCustomField(addBoletoField);
};

//mudanças no dom
const handleDomChanges = async (selectedDivTitle) => {
    if (!isPageLoaded) return;
    console.log("Making API call...");
    const addresses = await fetchClientData(proxUrl, selectedDivTitle);
    if (addresses) {
        handleApiResults(addresses);
        if (addresses.length > 0) {
            fillAddress(addresses[0]);
        }
    }
};

// boleto field adiciona o container, e o campo "dias pagamento boleto (input) está sendo criado no "createboletofield"
const addBoletoField = (customField) => {
    console.log("metodo: addboletofield, variável: customfield:", customField);
    const parentRow = customField.closest('.form-row');
    const additionalContainer = createBoletoFieldContainer();

        parentRow.appendChild(additionalContainer);
};

// cria campo boleto
const createBoletoFieldContainer = () => {
    console.log("createboletofield container");
    const container = document.createElement('div');
    container.className = 'unique-form-group col-sm-3';
    const label = document.createElement('label');
    label.textContent = 'Dias Pagamento Boleto';
    label.htmlFor = 'dias-pagamento-boleto';
    label.id = 'unique-dias-pagamento-boleto-label'; // Unique ID for this label
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'dias-pagamento-boleto';
    input.className = 'form-control unique-custom-input';
    input.placeholder = 'dias até parcela';
    const saveButton = createSaveButton();

    container.appendChild(label);
    container.appendChild(input);
    container.appendChild(saveButton);

    return container;
};

// Create save button
const createSaveButton = () => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-primary btn-sm unique-save-button';
    button.textContent = 'Salvar';

    button.addEventListener('click', saveBoletoData);
    return button;
};

// Save boleto data to Supabase
const saveBoletoData = async () => {
    try {
        console.log('Save button clicked!');

        const nome = await getClientName();
		console.log("TCL: saveBoletoData -> nome", nome)
        const diasPagamentoBoleto = document.querySelector('#dias-pagamento-boleto')?.value.trim();
		console.log("TCL: saveBoletoData -> diasPagamentoBoleto", diasPagamentoBoleto)

        if (!nome || !diasPagamentoBoleto) {
            alert('Por favor, insira o nome da empresa/cliente e o número de dias de pagamento do boleto');
            return;
        }
        if (isNaN(diasPagamentoBoleto)) {
            alert('Por favor, insira um número válido para o número de dias de pagamento. Somente números. Ex:10');
            return;
        }

        const data = { client_id: nome, num_dias_pagamento: parseInt(diasPagamentoBoleto, 10) };
       // await saveToSupabase(data);
        await upsertClientData(data.client_id, data.num_dias_pagamento);
    } catch (err) {
        console.error('Unexpected error during save:', err);
        alert('Um erro ocorreu e o dado não pode ser salvo.');
    }
};

// pega nome do cliente dinamicamente
const getClientName = async () => {
    try {
        const nomeFantasiaField = await waitForDynamicField('#ClienteNome');
		console.log("TCL: getClientName -> nomeFantasiaField", nomeFantasiaField)
        return nomeFantasiaField?.value.trim() || document.querySelector('#ClienteNome')?.value.trim();
    } catch (err) {
        console.error('Error while fetching client name:', err);
        return null;
    }
};

document.addEventListener('click', handleMenuItemClick);

// Initialize the app
initializeApp();
