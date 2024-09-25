const express = require('express');
const { exec, spawn } = require('child_process');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/calculate', (req, res) => {
    const gridArray = req.body.gridArray;
    const size = req.body.droneCounter; // Read droneCounter from the payload

    let input = `${size}\n`;
    for (let i = 0; i < 8; i++) {
        input += gridArray.slice(i * 8, (i + 1) * 8).join(' ') + '\n';
    }

    // Log the input for debugging
    console.log('Input to Java program:');
    console.log(input);

    // Corrected path to Drones.java
    const javaFilePath = path.join(__dirname, 'public', 'Drones.java');

    // Compile the Java file
    exec(`javac ${javaFilePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error compiling Java file: ${error.message}`);
            return res.status(500).send(`Error compiling Java file: ${error.message}`);
        }
        if (stderr) {
            console.error(`Compilation stderr: ${stderr}`);
            return res.status(500).send(`Compilation stderr: ${stderr}`);
        }
        console.log(`Compilation stdout: ${stdout}`);

        // Run the compiled Java class and pass input
        const javaProcess = spawn('java', ['-cp', 'public', 'Drones']);

        let output = '';

        // Handle standard output and error
        javaProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        javaProcess.stderr.on('data', (data) => {
            console.error(`Error: ${data}`);
        });

        javaProcess.on('close', (code) => {
            console.log(`Java process exited with code ${code}`);
            console.log(`Java process output: ${output}`);
            try {
                res.json(JSON.parse(output));  // Send the JSON output back to the client
            } catch (err) {
                console.error('Failed to parse JSON:', err);
                res.status(500).send('Invalid JSON output from Java program');
            }
        });

        // Pass input to the Java process
        javaProcess.stdin.write(input);
        javaProcess.stdin.end();
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
