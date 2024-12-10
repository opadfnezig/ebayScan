module.exports = async () => {
    const { ChatGPTAPI } = await import('chatgpt');
    return new ChatGPTAPI(
        {
            apiKey: process.env.OPENAI_API_KEY,
            completionParams: {
                model: 'gpt-3.5-turbo',
                temperature: 0.7,
                max_tokens: 150,
                top_p: 0.8,
            }
        });
}