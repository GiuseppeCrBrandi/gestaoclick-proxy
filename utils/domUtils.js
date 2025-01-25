// domUtils.js
export const waitForElement = (selector, timeout = 5000) => {
    return new Promise((resolve, reject) => {
        const interval = 100;
        let elapsed = 0;

        const checkElement = () => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
            } else if (elapsed >= timeout) {
                reject(new Error(`Element not found within ${timeout}ms: ${selector}`));
            } else {
                elapsed += interval;
                setTimeout(checkElement, interval);
            }
        };

        checkElement();
    });
};

//precisa ser mais genérico pois estão repetitivos mas esta espera para o campo financeiro no adidiconar cliente
export const waitForElement2 = async (xpath, timeout = 5000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element) return element;
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms before retrying
    }
    return null; //retorna null se o tmepo for excedido
};

(async () => {
    const alternativeField = await waitForElement(xpathLimiteCredito);
    console.log("TCL: observeCustomField -> alternativeField", alternativeField);
})();



// domUtils.js
export const waitForDynamicField = (selector, options = {}) => {
    const { timeout = 5000, interval = 100, onChange } = options;

    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        const checkCondition = () => {
            const element = document.querySelector(selector);

            if (element) {
                if (onChange && typeof onChange === 'function') {
                    // triger se função é provida
                    onChange(element);
                }
                resolve(element);
            } else if (Date.now() - startTime > timeout) {
                reject(new Error(`Element with selector "${selector}" not found within ${timeout}ms.`));
            } else {
                setTimeout(checkCondition, interval);
            }
        };

        checkCondition();
    });
};

export const getVencimentoInput = () => { 
    const vencimentoInput = document.evaluate( "//th[contains(text(), 'Vencimento')]/following::td[1]//input", document,
    null, XPathResult.FIRST_ORDERED_NODE_TYPE, 
    null ).singleNodeValue;
    console.log("Vencimento input field:");
    return vencimentoInput;
};

export function fillCityAndSelect(cityName) {
    console.log("Entering fillCityAndSelect function");

    //econtra o lavel para cidade
    const label = Array.from(document.querySelectorAll('label')).find(label => label.textContent.includes('Cidade/UF'));
    console.log("Label found:", label);
    if (!label) {
        console.error('Label for "Cidade/UF" not found');
        return;
    }

    const input = label.closest('div').querySelector('input[type="text"]');
    console.log("Input field found:", input);
    if (!input) {
        console.error('Input field for "Cidade/UF" not found');
        return;
    }

    if (!cityName) {
        console.error('City name is undefined or empty');
        return;
    }
    const formattedCityName = cityName.replace(" - ", " (").concat(")");
    console.log("Formatted city name:", formattedCityName);

    input.focus();
    input.value = formattedCityName;
    const inputEvent = new Event('input', { bubbles: true });
    input.dispatchEvent(inputEvent);

    // tmout p esperar o dropdown
    setTimeout(() => {
        const dropdown = input.closest('.autocomplete').querySelector('ul.results');
        console.log("Dropdown found:", dropdown);
        if (!dropdown || dropdown.style.display === 'none') {
            console.error('Dropdown not found or not visible');
            return;
        }

        // encontrar o dropdown correto
        const cityOption = Array.from(dropdown.children).find(option =>
            option.textContent.trim().toLowerCase() === formattedCityName.toLowerCase()
        );
        if (!cityOption) {
            console.error(`City "${formattedCityName}" not found in the dropdown`);
            return;
        }

        //simulação clique 
        cityOption.click();
        console.log(`City "${formattedCityName}" selected successfully`);
    }, 500); // tempo de acordo com o countdown
}


// acha o input 

const waitForCustomField = async (selector, timeout = 5000) => {
    return new Promise((resolve, reject) => {
        const interval = 100; // Check every 100ms
        let elapsed = 0;

        const checkField = () => {
            const customField = document.querySelector(selector);
            if (customField) {
                clearInterval(checkInterval);
                resolve(customField);
            } else if (elapsed >= timeout) {
                clearInterval(checkInterval);
                reject(new Error(`Custom field not found within ${timeout}ms.`));
            }
            elapsed += interval;
        };

        const checkInterval = setInterval(checkField, interval);
    });
};


export function findTextarea() {
    const xpath = "//div[contains(@class, 'card-header') and .//h4[contains(text(), 'Informações adicionais')]]/../div[contains(@class, 'card-body')]//textarea[@id='infAdic_infCpl']";
    console.log("TCL: findTextarea -> xpath", xpath);

    // Ensure `document` is accessible
    if (typeof document === 'undefined') {
        console.error("Document is not available.");
        return null;
    }

    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}


export function updateTextarea(document, variableName) {
    const textarea = findTextarea(document);
	console.log("TCL: updateTextarea -> textarea", textarea)
    if (textarea) {
        const existingText = textarea.value.trim(); // Retrieve existing text
        const newText = `Nome do Vendedor: ${variableName}\n${existingText}`;
        textarea.value = newText; // Update the textarea
    } else {
        console.error('Textarea element not found.');
    }
}