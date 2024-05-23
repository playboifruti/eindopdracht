const { contextBridge } = require('electron');
const axios = require('axios');

const tokens = [
    { name: 'Bitcoin',   symbol: 'BTC' },
    { name: 'Ethereum',  symbol: 'ETH' },
    { name: 'Polkadot',  symbol: 'DOT' },
    { name: 'Cosmos',    symbol: 'ATOM' },
    { name: 'TON',       symbol: 'TON' },
    { name: 'Litecoin',  symbol: 'LTC' },
    { name: 'Aptos',     symbol: 'APT' },
    { name: 'Arbitrum',  symbol: 'ARB' },
    { name: 'Optimism',  symbol: 'OP' },
    { name: 'Starknet',  symbol: 'STRK' },
    { name: 'Solana',    symbol: 'SOL' },
    { name: 'Polygon',   symbol: 'MATIC' },
    { name: 'Chainlink', symbol: 'LINK' },
];

for (const token of tokens) {
    contextBridge.exposeInMainWorld(`${token.name.toLowerCase()}Prices`, {
        fetchCurrentPrice: async () => {
            try {
                const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${token.symbol}&convert=USD`, {
                    headers: {
                        'X-CMC_PRO_API_KEY': '23d72b80-ffaa-46c9-80b0-0ac582d5136d' // CoinMarketCap API key
                    }
                });
                return response.data.data[token.symbol].quote.USD.price;
            } catch (error) {
                console.error(`Error fetching current ${token.name} price:`, error);
                return null;
            }
        },
        fetchPrice24hAgo: async () => {
            try {
                const currentTime = Math.floor(Date.now() / 1000); 
                const twentyFourHoursAgo = currentTime - (24 * 60 * 60); 
                
                // historical data
                const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${token.name.toLowerCase()}/market_chart?vs_currency=usd&days=1`);
                
                // 24 hours ago price
                const prices = response.data.prices;
                let price24hAgo = null;
                for (let i = 0; i < prices.length; i++) {
                    if (prices[i][0] >= twentyFourHoursAgo * 1000) {
                        price24hAgo = prices[i][1];
                        break;
                    }
                }
                
                return price24hAgo;
            } catch (error) {
                console.error(`Error fetching ${token.name} price 24 hours ago:`, error);
                return null;
            }
        }
    });
}