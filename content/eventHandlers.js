import { fetchClientByCodigo } from "../api/apiService.js";
import { proxUrl } from "./content.js";
import { findTextarea, updateTextarea } from "../utils/domUtils.js";

//handler para "emitir nota fiscal" clique
export async function handleMenuItemClick(event) {
    const clickedElement = event.target.closest('a[role="menuitem"]');
    if (!clickedElement) {
        console.error("Click was not on a valid menu item.");
        return;
    }

    const rowXPath = './ancestor::tr';
    const row = document.evaluate(rowXPath, clickedElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (!row) {
        console.error("Could not find the parent row.");
        return;
    }

    const clientTdXPath = ".//td[@aria-colindex='2' and @role='cell']";
    const clientTdElement = document.evaluate(clientTdXPath, row, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (!clientTdElement) {
        console.error("Could not find the client field.");
        return;
    }

    // extrai nome do cliente
    const clientNameElement = clientTdElement.querySelector('a');
    const clientName = clientNameElement ? clientNameElement.textContent.trim() : null;

    if (!clientName) {
        console.error("Could not extract client name.");
        return;
    }

    console.log("Client Name:", clientName);

    try {
        await fetchClientByCodigo(proxUrl, 26, clientName);
    } catch (error) {
        console.error("Error fetching client data:", error);
        return;
    }

    // espera text area estar disponǘel
    const checkPageLoaded = () => {
        return new Promise((resolve, reject) => {
            const timeout = 5000; //(5 seconds)
            const interval = 100; // checa a cada 100ms
            let elapsed = 0;

            const timer = setInterval(() => {
                const textarea = findTextarea();
                elapsed += interval;

                if (textarea) {
                    clearInterval(timer);
                    resolve(textarea);
                } else if (elapsed >= timeout) {
                    clearInterval(timer);
                    reject(new Error("Textarea not found within timeout."));
                }
            }, interval);
        });
    };

    try {
        const textarea = await checkPageLoaded();
        if (textarea) {
            updateTextarea(textarea, clientName);
            console.log("Textarea updated with client name.");
        }
    } catch (error) {
        console.error("Error waiting for textarea:", error);
    }
}
