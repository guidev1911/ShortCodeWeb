document.getElementById("btnEncurtar").addEventListener("click", encurtarUrl);

async function encurtarUrl() {
    const url = document.getElementById("originalUrl").value.trim();
    const expirationInput = document.getElementById("expirationDate").value;
    const resultadoDiv = document.getElementById("resultado");

    if (!url) {
        alert("Informe a URL original.");
        return;
    }

    const body = { originalUrl: url };

    if (expirationInput) {
        body.expirationDate = expirationInput + ":00.000Z";
    }

    try {
        const response = await fetch("https://bb3e-2804-29b8-540d-faa7-827c-ac06-f994-4a82.ngrok-free.app/shorten", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Erro ao encurtar a URL");
        }

        const data = await response.json();
        console.log("Resposta da API:", data);

        const shortLink = data.shortUrl || `http://${data.shortCode}`;

        resultadoDiv.style.display = "block";
        resultadoDiv.innerHTML = `
            <strong>URL encurtada:</strong><br>
            <a href="${shortLink}" target="_blank" style="color:#00F778;">${shortLink}</a>
        `;
    } catch (error) {
        resultadoDiv.style.display = "block";
        resultadoDiv.innerHTML = `<span style="color:red;">Erro: ${error.message}</span>`;
    }
}

document.getElementById("btnStats").addEventListener("click", buscarEstatisticas);

async function buscarEstatisticas() {
    const codigo = document.getElementById("codigoStats").value.trim();
    const estatisticasDiv = document.getElementById("estatisticas");

    if (!codigo) {
        alert("Informe o código encurtado.");
        return;
    }

    try {
        const response = await fetch(`https://bb3e-2804-29b8-540d-faa7-827c-ac06-f994-4a82.ngrok-free.app/stats/${codigo}`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Erro ao buscar estatísticas");
        }

        const data = await response.json();
        estatisticasDiv.style.display = "block";
        estatisticasDiv.innerHTML = `
            <strong>Estatísticas:</strong><br><br>
            <strong>URL original:</strong> <a href="${data.originalUrl}" target="_blank">${data.originalUrl}</a><br>
            <strong>Clicks:</strong> ${data.clickCount}<br>
            <strong>Criado em:</strong> ${formatarData(data.createdAt)}<br>
            <strong>Expira em:</strong> ${formatarData(data.expirationDate)}
        `;
    } catch (error) {
        estatisticasDiv.style.display = "block";
        estatisticasDiv.innerHTML = `<span style="color:red;">Erro: ${error.message}</span>`;
    }
}

function formatarData(isoString) {
    const data = new Date(isoString);
    return data.toLocaleString("pt-BR");
}

