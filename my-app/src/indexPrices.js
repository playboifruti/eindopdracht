window.addEventListener('DOMContentLoaded', async () => {
    const tokens = [
        { name: 'Bitcoin',   elementId: 'bitcoin' },
        { name: 'Ethereum',  elementId: 'ethereum' },
        { name: 'Polkadot',  elementId: 'polkadot' },
        { name: 'Cosmos',    elementId: 'cosmos' },
        { name: 'TON',       elementId: 'ton' },
        { name: 'Litecoin',  elementId: 'litecoin' },
        { name: 'Aptos',     elementId: 'aptos' },
        { name: 'Arbitrum',  elementId: 'arbitrum' },
        { name: 'Optimism',  elementId: 'optimism' },
        { name: 'Starknet',  elementId: 'starknet' },
        { name: 'Solana',    elementId: 'solana' },
        { name: 'Polygon',   elementId: 'matic' },
        { name: 'Chainlink', elementId: 'chainlink' },

    ];

    for (const token of tokens) {
        try {
            const currentPrice = await window[token.name.toLowerCase() + 'Prices'].fetchCurrentPrice();
            const price24hAgo = await window[token.name.toLowerCase() + 'Prices'].fetchPrice24hAgo();

            const formattedCurrentPrice = currentPrice ? `$${currentPrice.toFixed(2)}` : 'Error fetching current price';

            // calculate percentage difference
            let percentageDifference;
            if (currentPrice !== null && price24hAgo !== null) {
                percentageDifference = ((currentPrice - price24hAgo) / price24hAgo) * 100;
                percentageDifference = percentageDifference.toFixed(2); 
            } else {
                percentageDifference = 'N/A';
            }

            // display prices and % difference
            document.getElementById(`${token.elementId}-current-price`).textContent = formattedCurrentPrice;
            document.getElementById(`${token.elementId}-price-24h-ago`).textContent = percentageDifference === 'N/A' ? 'N/A' : `${percentageDifference}%`;

            // adding classes based on price comparison
            const priceElement = document.getElementById(`${token.elementId}-price-24h-ago`);
            if (percentageDifference === 'N/A') {
                priceElement.classList.add("priceSame");
            } else if (percentageDifference > 0) {
                priceElement.classList.add("priceUp");
            } else if (percentageDifference < 0) {
                priceElement.classList.add("priceDown");
            } else {
                priceElement.classList.add("priceSame"); 
            }
        } catch (error) {
            console.error(`Error fetching data for ${token.name}:`, error);
        }
    }
});
