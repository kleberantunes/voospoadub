// Funções de utilidade
function formatPrice(price) {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Funções de modal
function openAlertModal() {
    document.getElementById('alertModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('alertModal').style.display = 'none';
}

// Funções de alerta
function saveAlertSettings() {
    const email = document.getElementById('alertEmail').value;
    const price = document.getElementById('alertPrice').value;
    
    // Verificar voos abaixo do preço
    const cheapFlights = [...flightData.ida, ...flightData.volta]
        .filter(flight => flight.price < price);
    
    const message = cheapFlights.length > 0 
        ? `Encontramos ${cheapFlights.length} voos abaixo de R$ ${price}!`
        : 'Você será notificado quando encontrarmos voos abaixo deste valor.';
    
    alert(`Alerta configurado com sucesso!\n${message}`);
    closeModal();
}

// Funções de exibição
function showFlights(type) {
    const container = document.getElementById('flightsContainer');
    const direction = type === 'ida' ? 'Porto Alegre → Dublin' : 'Dublin → Porto Alegre';
    
    const html = flightData[type]
        .sort((a, b) => a.price - b.price)
        .map(flight => `
            <div class="flight-card">
                <h4>${flight.airline}</h4>
                <p>${direction}</p>
                <p>Paradas: ${flight.stops}</p>
                <p><strong>${formatPrice(flight.price)}</strong></p>
                <a href="${flight.source}" target="_blank">Ver no site</a>
            </div>
        `).join('');
    
    container.innerHTML = `<h3>Voos de ${direction}</h3>${html}`;
}

function showDuration(days) {
    const container = document.getElementById('flightsContainer');
    
    const packages = flightData.ida.map(outbound => {
        const inbound = flightData.volta.find(f => f.airline === outbound.airline);
        if (!inbound) return null;
        
        return {
            airline: outbound.airline,
            outbound: outbound,
            inbound: inbound,
            totalPrice: outbound.price + inbound.price,
            source: outbound.source
        };
    }).filter(pkg => pkg !== null);

    const html = packages
        .sort((a, b) => a.totalPrice - b.totalPrice)
        .map(pkg => `
            <div class="flight-card">
                <h4>${pkg.airline}</h4>
                <p>Permanência: ${days} dias</p>
                <p>Ida: ${formatPrice(pkg.outbound.price)}</p>
                <p>Volta: ${formatPrice(pkg.inbound.price)}</p>
                <p><strong>Total: ${formatPrice(pkg.totalPrice)}</strong></p>
                <a href="${pkg.source}" target="_blank">Ver no site</a>
            </div>
        `).join('');

    container.innerHTML = `<h3>Pacotes de ${days} dias</h3>${html}`;
}

// Inicialização
showDuration(20);