document.getElementById("btnEncurtar").addEventListener("click", encurtarUrl);

async function encurtarUrl() {
    const url = document.getElementById("originalUrl").value.trim();
    const expirationInput = document.getElementById("expirationDate").value;
    const resultadoDiv = document.getElementById("resultado");

    const body = { originalUrl: url };

    if (expirationInput) {
        const localDate = new Date(expirationInput);

        const offsetMinutes = localDate.getTimezoneOffset();
        const offsetSign = offsetMinutes > 0 ? "-" : "+";
        const offsetHours = String(Math.floor(Math.abs(offsetMinutes) / 60)).padStart(2, "0");
        const offsetMins = String(Math.abs(offsetMinutes) % 60).padStart(2, "0");
        const offset = `${offsetSign}${offsetHours}:${offsetMins}`;

        const isoWithoutZ = localDate.toISOString().replace("Z", "");

        body.expirationDate = isoWithoutZ + offset;
    }

    try {
        const response = await fetch("https://scd-gowv.onrender.com/shorten", {
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

        const shortLink = data.shortUrl || `https://${data.shortCode}`;

        resultadoDiv.style.display = "block";
        resultadoDiv.innerHTML = `
            <strong>URL encurtada:</strong><br>
            <a href="${shortLink}" target="_blank" style="color:#00F778;">${shortLink}</a>
        `;
        }catch (error) {
        let mensagemErro = "Erro inesperado. Tente novamente mais tarde.";

        try {
            const erroJson = JSON.parse(error.message);
            mensagemErro = erroJson.error || mensagemErro;
        } catch {
            if (error.message) {
                mensagemErro = error.message;
            }
        }

        resultadoDiv.style.display = "block";
        resultadoDiv.innerHTML = `
            <div style="background-color:rgba(122, 47, 47, 0.25); color: #FF6666; padding: 10px; border-radius: 5px;">
                <strong>Erro:</strong> ${mensagemErro}
            </div>
        `;
    }
}

document.getElementById("btnStats").addEventListener("click", buscarEstatisticas);

async function buscarEstatisticas() {
    let input = document.getElementById("codigoStats").value.trim();
    let codigo = input.substring(input.lastIndexOf("/") + 1); 

    const estatisticasDiv = document.getElementById("estatisticas");
    estatisticasDiv.innerHTML = ""; 
    estatisticasDiv.style.display = "none"; 

    if (!codigo) {
        alert("Informe o código encurtado.");
        return;
    }

    try {
        const response = await fetch(`https://scd-gowv.onrender.com/stats/${codigo}`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Erro ao buscar estatísticas");
        }

        const data = await response.json();

        estatisticasDiv.innerHTML = `
            <strong>Estatísticas:</strong><br><br>
            <strong>URL original:</strong> <a href="${data.originalUrl}" target="_blank">${data.originalUrl}</a><br>
            <strong>Clicks:</strong> ${data.clickCount}<br>
            <strong>Criado em:</strong> ${formatarData(data.createdAt)}<br>
            <strong>Expira em:</strong> ${formatarData(data.expirationDate)}
        `;
        estatisticasDiv.style.display = "block";
    } catch (error) {
        let mensagemErro = "Erro inesperado. Tente novamente mais tarde.";

        try {
            const erroJson = JSON.parse(error.message);
            mensagemErro = erroJson.error || mensagemErro;
        } catch {
            if (error.message) {
                mensagemErro = error.message;
            }
        }

        estatisticasDiv.innerHTML = `
            <div style="background-color:rgba(122, 47, 47, 0.25); color: #FF6666; padding: 10px; border-radius: 5px;">
                <strong>Erro:</strong> ${mensagemErro}
            </div>
        `;
        estatisticasDiv.style.display = "block";
    }
}

function formatarData(isoString) {
    const data = new Date(isoString);
    return data.toLocaleString("pt-BR");
}

