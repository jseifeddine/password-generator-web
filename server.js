const express = require('express');
const path = require('path');
const WordNet = require('node-wordnet');

const app = express();
const port = 3000;
const wordnet = new WordNet();

// Serve static files from public directory
app.use(express.static('public'));

function getRandomWord(type, minLength = 3, maxLength = 8) {
    return new Promise((resolve, reject) => {
        // Search for words of the specified type (n=noun, a=adjective, etc)
        wordnet.lookup(type, (err, definitions) => {
            if (err) return reject(err);
            
            // Filter words that meet our criteria
            const validWords = definitions.filter(def => {
                const word = def.lemma;
                return word.length >= minLength && 
                       word.length <= maxLength && 
                       !word.includes('_');
            });

            if (validWords.length === 0) {
                // Try again if no valid words found
                getRandomWord(type, minLength, maxLength).then(resolve).catch(reject);
                return;
            }

            // Pick a random word from the filtered list
            const randomWord = validWords[Math.floor(Math.random() * validWords.length)].lemma;
            // Capitalize first letter
            resolve(randomWord.charAt(0).toUpperCase() + randomWord.slice(1));
        });
    });
}

function generateRandomDigits(length) {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

function generateRandomSpecialChars(length) {
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    return Array.from({ length }, () => specialChars[Math.floor(Math.random() * specialChars.length)]).join('');
}

app.get('/generate', async (req, res) => {
    try {
        const adjective = await getRandomWord('a');
        const noun = await getRandomWord('n');
        const digits = generateRandomDigits(3);
        const special = generateRandomSpecialChars(3);
        
        const password = `${adjective}${noun}${digits}${special}`;
        res.json({ password });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate password' });
        console.error('Error generating password:', error);
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 