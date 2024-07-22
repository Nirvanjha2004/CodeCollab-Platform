import Docker from 'dockerode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docker = new Docker();

async function runCode(language: string, code: string): Promise<string> {
    let image: string;
    let command: string[];

    if (language === 'cpp') {
        image = 'myregistry/my-cpp-compiler';
        command = ['sh', '-c', 'g++ /app/main.cpp -o /app/main && /app/main'];
    } else if (language === 'python') {
        image = 'myregistry/my-python-interpreter';
        command = ['python', '/app/script.py'];
    } else {
        throw new Error('Unsupported language');
    }

    // Create a temporary directory to store the code
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    // Write the code to a file
    const filePath = path.join(tempDir, language === 'cpp' ? 'main.cpp' : 'script.py');
    fs.writeFileSync(filePath, code);
    console.log(`Code written to ${filePath}`);

    const container = await docker.createContainer({
        Image: image,
        Cmd: command,
        Tty: false,
        AttachStdout: true,
        AttachStderr: true,
        HostConfig: {
            Binds: [`${tempDir}:/app`], // Bind mount the temp directory
            Memory: 512 * 1024 * 1024,
            CpuShares: 512,
            NetworkMode: 'none',
        },
    });

    console.log('Container created, starting...');
    await container.start();

    console.log('Container started, waiting for completion...');
    await container.wait();  // Wait for the container to complete its task

    console.log('Fetching logs...');
    const logs = await container.logs({ stdout: true, stderr: true });
    const output = logs.toString();

    try {
        console.log('Stopping container...');
        await container.stop();
    } catch (error) {
        if (error.statusCode === 304) {
            console.log('Container already stopped');
        } else {
            console.error('Error stopping container:', error);
        }
    }

    try {
        console.log('Removing container...');
        await container.remove();
    } catch (error) {
        console.error('Error removing container:', error);
    }

    // Cleanup temp directory
    fs.rmdirSync(tempDir, { recursive: true });
    console.log('Temp directory cleaned up');
    console.log(output)
    return output;
}

export default runCode;
