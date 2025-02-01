<think>
Okay, the user is asking for a standard Express app that has a route to display "hello world". Let me break down
what they need.

First, I know that Express.js is a popular framework for Node.js. So, they probably want a basic setup using
Express. They mentioned a standard app, so it should include the essential parts: creating an app instance,
setting up middleware like bodyParser for parsing JSON data, defining routes, and starting the server.

The main route they need is '/hello', which should respond with 'Hello World!' when accessed via GET. I'll make
sure to include that specific route in the code.

I also want to ensure that the example is complete so they can run it right away. That means adding the port
setup, using environment variables for flexibility, and handling both IPv4 and IPv6 addresses.

Additionally, I should provide instructions on how to run the app. They'll need to install Express if they haven't
already, then run the script. Mentioning what to expect in the console output will help them verify that it's
working.

I'll structure the answer clearly, starting with the code example and then adding the setup steps. Keeping the
explanation concise but informative should meet their needs without overwhelming them.
</think>

Here's a standard Express.js application with a route for displaying "Hello World":

```javascript
const express = require('express');
const app = express();

// Middleware to parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route for Hello World
app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
```

### Steps to run:
1. Make sure you have Node.js installed.
2. Install Express (if not already installed):
   ```bash
   npm install express
   ```
3. Save the code in a file (e.g., `app.js`).
4. Run the application:
   ```bash
   node app.js
   ```
5. Open your browser and visit: http://localhost:3000/hello

The server will display "Hello World!" when accessed via GET request to `/hello`.