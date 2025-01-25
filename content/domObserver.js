import { getVencimentoInput } from '../utils/domUtils.js';
import { readClientData, upsertClientData } from '../api/supabaseClient.js';

export const observeDomChanges = (callback) => {
    const observer = new MutationObserver(async (mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && node.classList.contains('selected')) {
                        const childWithTitle = node.querySelector('div[title]');
                        if (childWithTitle) {
                            const selectedDivTitle = childWithTitle.getAttribute('title');
                            console.log("SelectedDivTitle:", selectedDivTitle);

                            const isClientField = Boolean(
                                node.closest('.autocomplete')?.parentElement.querySelector('label[for="cliente_id"]')
                            );
                            console.log("Is client field:", isClientField);

                            if (isClientField) {
                                callback(selectedDivTitle);
                            }

                            if (selectedDivTitle.toLowerCase() === 'boleto bancário') {
                                console.log("Title matches 'Boleto Bancário'");

                                const clienteCardBody = Array.from(document.querySelectorAll('section.content div.card-body'))
                                    .find(cardBody => Array.from(cardBody.querySelectorAll('div'))
                                        .some(div => div.textContent.toLowerCase().includes('cliente')));

                                if (clienteCardBody) {
									console.log("TCL: observeDomChanges -> clienteCardBody", clienteCardBody)
                                    const autocompleteDiv = clienteCardBody.querySelector('.autocomplete');
                                    if (autocompleteDiv) {
                                        const selectedDiv = autocompleteDiv.querySelector('.selected div[title]');
                                        if (selectedDiv) {
                                            const clienteName = selectedDiv.getAttribute('title');
                                            console.log("Cliente Name:", clienteName);
                                            try {
                                                
                                                // Fetch or update client data using upsert logic
                                                let numDiasPagamento = 0; // Default or fetch dynamically
                                                /// em seguida acessarei os valores da tabela para ver se este cliente possui um dado salvo
												console.log("TCL: observeDomChanges -> readClientData", readClientData)
                                                //apos ler a informacao dos dias através do campo cliente, iremos preencher a data correspondente                                         
                                                const clientData = await readClientData(clienteName.trim());
												console.log("TCL: clientData", clientData)
                                                if(clientData) {
                                                    numDiasPagamento = clientData.num_dias_pagamento                                      
													console.log("TCL: observeDomChanges -> numDiasPagamento", numDiasPagamento)
                                                    const vencimentoInput = getVencimentoInput();
                                                    if(vencimentoInput) {
                                                            vencimentoInput.value = calculateDueDate(numDiasPagamento);
                                                            vencimentoInput.focus();
                                                            showSuccessPopup(vencimentoInput, "Campo preenchido com os dados do cadastro");                                                       
                                                    }else {
                                                        console.error("Vencimento input not found.");
                                                    }
                                                    }else { console.log("por alguma razão, não foram detectados dados deste cliente no banco")}
                                            } catch (error) {
                                                console.error('Error during upsert operation:', error);
                                                alert('Erro ao salvar ou atualizar cliente.');
                                            }
                                        } else {
                                            console.log('No selected div found inside autocomplete');
                                            alert("Certifique-se que o campo 'Cliente' está preenchido");
                                        }
                                    } else {
                                        console.log('No autocomplete div found');
                                    }
                                } else {
                                    console.log('Could not find the cliente card body');
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
};

const calculateDueDate = (numDiasPagamento) => {
    const today = new Date();
    today.setDate(today.getDate() + numDiasPagamento);

    // Extract day, month, and year
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = today.getFullYear();

    return `${day}/${month}/${year}`; // Format as dd/mm/yyyy
};

function showSuccessPopup(targetElement, message) {
    //pop up de campo adicionado
    const popup = document.createElement("div");
    popup.textContent = message;
    popup.style.position = "absolute";
    popup.style.backgroundColor = "green";
    popup.style.color = "white";
    popup.style.padding = "5px 10px";
    popup.style.borderRadius = "5px";
    popup.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
    popup.style.zIndex = "1000";
    popup.style.fontSize = "12px";
    popup.style.whiteSpace = "nowrap";

    // Position the popup near the target element
    const rect = targetElement.getBoundingClientRect();
    popup.style.top = `${rect.top + window.scrollY - 30}px`; // Above the input
    popup.style.left = `${rect.left + window.scrollX}px`; // Align horizontally

    // Add the popup to the document
    document.body.appendChild(popup);

    // Remove the popup after a few seconds
    setTimeout(() => {
        popup.remove();
    }, 3000); // Adjust the duration as needed (3000 ms = 3 seconds)
}
