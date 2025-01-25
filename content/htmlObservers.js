import { waitForElement2 } from "../utils/domUtils.js";

// checkboxHandler.js
export const observeCheckbox = (callback) => {
    const Boxobserver = new MutationObserver((mutationsList, Boxobserver) => {
        const xpath = '//label[contains(text(), "Informar endereço de entrega")]/preceding-sibling::input[@type="checkbox"]';
        const checkbox = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (checkbox) {
            checkbox.checked = true;
            console.log("Checkbox is now checked:", checkbox.checked);

            // Trigger the 'change' event manually
            const event = new Event('change', { 'bubbles': true, 'cancelable': true });
            checkbox.dispatchEvent(event);

            Boxobserver.disconnect(); // Stop observing once found
            callback();
        }
    });

    Boxobserver.observe(document.body, { childList: true, subtree: true });
};

// campo de dias pagamento boleto em "campos extras"
export const observeCustomField = (callback) => {
    console.log("inside observerCustomField");
    const observer = new MutationObserver((mutationsList, observer) => {
        // XPath for the checkbox labeled "Permitir ultrapassar limite de crédito"
        const xpathCheckbox = '//label[contains(text(), "Permitir ultrapassar limite de crédito")]/preceding-sibling::input[@type="checkbox"]';
        const checkbox = document.evaluate(xpathCheckbox, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (checkbox) {
            console.log("Found checkbox:", checkbox);
            // Find the parent container of the checkbox
            const checkboxContainer = checkbox.closest('.custom-control.custom-checkbox');
			console.log("TCL: observeCustomField -> checkboxContainer", checkboxContainer)
            if (checkboxContainer) {             
                // Trigger the callback with the new custom input
                callback(checkboxContainer); 
                // Stop observing
                observer.disconnect();
            }
        } else {
            console.log("Checkbox not found. Retrying...");
        }
    });

    const targetNode = document.querySelector('#no-footer');
    observer.observe(targetNode || document.body, { childList: true, subtree: true });
    };




//campo para pegar o nome fantasia
export const observeNomeFantasiaField = (callback) => {
    const observer = new MutationObserver((mutationsList, observer) => {
        // Use XPath to locate the "Nome fantasia" field
        const xpath = '//label[contains(text(), "Nome fantasia")]/following-sibling::div/input[@type="text"]';
        const nomeFantasiaField = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (nomeFantasiaField) {
            console.log("Found Nome fantasia field:", nomeFantasiaField);

            // Trigger the callback with the field's value
            callback(nomeFantasiaField.value);

            // Stop observing once the target field is found
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
};

