document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('.searchSection form');
    const tokenNameElement = document.getElementById('tokenName');
    const tokenPriceElement = document.getElementById('tokenPrice');
    const tokenProcentDifElement = document.getElementById('tokenProcentDif');

    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const searchToken = document.getElementById('searchToken').value.trim();
        
        const searchTokenCapitalized = searchToken.charAt(0).toUpperCase() + searchToken.slice(1);

        const searchTokenLowercase = searchToken.toLowerCase();

        try {
            const currentPrice = await window[`${searchTokenLowercase}Prices`].fetchCurrentPrice();

            const price24hAgo = await window[`${searchTokenLowercase}Prices`].fetchPrice24hAgo();

            const percentageDifference = ((currentPrice - price24hAgo) / price24hAgo) * 100;
            
            const sign = percentageDifference >= 0 ? '+' : '-';
            
            const priceClass = percentageDifference >= 0 ? 'priceUp' : 'priceDown';

            tokenNameElement.textContent = searchTokenCapitalized;
            tokenPriceElement.textContent = `${currentPrice.toFixed(2)}$`;

            tokenProcentDifElement.textContent = `${sign}${Math.abs(percentageDifference).toFixed(2)}%`;

            tokenProcentDifElement.classList.remove('priceUp', 'priceDown');
            tokenProcentDifElement.classList.add(priceClass);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });
});

