import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import runCode from './runCode.js';
import cors from 'cors'

const app = express();
const port = 3000;

app.use(cors())

app.use(bodyParser.json());

app.post('/run', async (req: Request, res: Response) => {

    const response = req.body;
    console.log(response);
    const { language, code } = req.body;
    console.log(code)
    if (!language || !code) {
        return res.status(400).json({ error: 'Language and code are required' });
    }

    try {
        const output = await runCode(language, code);
        res.json({ output });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ error: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
