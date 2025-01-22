import { marked } from './libs/marked.esm.js';

document.addEventListener("DOMContentLoaded", () => {
    let extractedText = ""; 
    let description = ""; 

    document.getElementById("analyseButton").addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.runtime.sendMessage({ action: "executeScript", tabId: tabs[0].id }, (response) => {
                if (response && response.result) {
                    extractedText = response.result;
                    let resultDiv = document.getElementById("result");
                    let initialInfo = document.getElementById("initialInfo");
                    let analyseButton = document.getElementById("analyseButton");
                    let alternativesButton = document.getElementById("alternativesButton");

                    // Hide initial information and button
                    initialInfo.style.display = "none";
                    analyseButton.style.display = "none";
                    resultDiv.style.display = "block";

                    // Show loading animation
                    resultDiv.innerHTML = `
                        <div class="loader"></div>
                        <p>Please wait a few seconds, your product is being analysed</p>
                    `;

                    fetch('http://127.0.0.1:5000/analyse', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ extractedText: extractedText })
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Analysis result received:', data.result);

                        const result = JSON.parse(data.result);
                        const rating = result.rating;
                        const summary = typeof result.summary === 'string' ? result.summary : JSON.stringify(result.summary);
                        const detail = typeof result.detail === 'string' ? result.detail : JSON.stringify(result.detail);
                        description = result.description;

                        console.log("Description at frontend: ", description);

                        resultDiv.innerHTML = `
                            <div class="result-box">
                                <div class="rating">Rating: ${rating}</div>
                                <div class="summary">${marked(summary)}</div>
                                <div class="detail">${marked(detail)}</div>
                            </div>
                        `;

                        alternativesButton.style.display = "block";
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
                    });
                }
            });
        });
    });

    document.getElementById("alternativesButton").addEventListener("click", () => {
        let resultDiv = document.getElementById("result");
        let alternativesButton = document.getElementById("alternativesButton");

        resultDiv.innerHTML = `
            <div class="loader"></div>
            <p>Please give me a minute - just fetching some cool eco-friendly alternatives for you!</p>
        `;

        alternativesButton.style.display = "none";

        fetch('http://127.0.0.1:5000/alternatives', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description: description })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Alternatives received:', data.alternatives);
            const alternativesHtml = marked(data.alternatives);
            resultDiv.innerHTML = `<div class="alternatives">${alternativesHtml}</div>`;
        })
        .catch((error) => {
            console.error('Error:', error);
            resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
        });
    });
});