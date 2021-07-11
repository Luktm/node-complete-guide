const http = require("http");

const server = http.createServer((req, res) => {

    // get the reqest url route name
    const url = req.url;
    // get the request method
    const method = req.method

    if (url === '/') {
        // set the header as html format
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Hello welcome to my page</title></head>');
        res.write('<body><form action="/create-user" method="POST"><input type="text" name="user"/></form></body>');
        res.write('</html>');
        res.end();
    }

    if(url === '/users') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>User list</title></head>');
        res.write('<body><ul><li>User 1</li><li>User 2</li></ul></body>')
        res.write('</html>');
        res.end();
    }

    if(url === '/create-user' && method === 'POST') {
        const body = [];

        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });

        // at this point, we know all the data has be read
        req.on('end', () => {
            const parseBody = Buffer.concat(body).toString();

            // username = whatever-the-user-entered
            //                          0           1
            // split to array become [username, what-the-user-entered]
            console.log(parseBody.split('=')[1]); 
            
        });
        res.statusCode = 302;
        res.setHeader('Location', '/');
        res.end();
    }

});


server.listen(3000);