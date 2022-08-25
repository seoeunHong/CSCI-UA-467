// webby.js
// npx mocha test/webby-test.js
const net = require("net");

// Object that maps status codes to description
const HTTP_STATUS_CODES = {
  200: "OK",
  404: "Not Found",
  308: "Permanent Redirect",
  500: "Internal Server Error",
};

// Object that maps file name extensions to MIMI Type
const MIME_TYPES = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  html: "text/html",
  css: "text/css",
  txt: "text/plain",
};

function serveStatic(basePath) {
  return (req, res, next) => {
    // TODO: retrieve the filename from the request object as fn
    const path = require("path");
    const fs = require("fs");
    const fn = path.join(basePath, req.path);
    // try to read the file
    fs.readFile(fn, (err, data) => {
      if (err) {
        // TODO: go on to the route handlers by calling the next
        // function without arguments
        next();
      } else {
        // TODO: send back the data that was read with the appropriate:
        // * Content-Type
        // * status
        // ... use your response object to do this
        res.set("Content-Type", this.getMIMEType(req.path));
        res.send(data);
      }
    });
  };
}

// Extracts the extension of a file name and normalizes it to lowercase.
function getExtension(fileName) {
  if (fileName.includes(".")) {
    const fileExten = fileName.split(".");
    return fileExten[fileExten.length - 1].toLowerCase();
  } else {
    return "";
  }
}

// Based on the extension of the file, give back the associated MIME Type.
function getMIMEType(fileName) {
  if (fileName.includes(".")) {
    const fileExten = getExtension(fileName);
    return MIME_TYPES[`${fileExten}`];
  } else {
    return "";
  }
}

class Request {
  constructor(httpRequest) {
    const [method, path, ...others] = httpRequest.split(" ");
    this.method = method;
    this.path = path;
  }
}

class Response {
  constructor(socket, statusCode = 200, version = "HTTP/1.1") {
    this.sock = socket;
    this.headers = {};
    this.body = {};
    this.statusCode = statusCode;
    this.version = version;
  }

  // Adds a new header name and header value pair to
  // this Response object's internal headers property
  set(name, value) {
    this.headers[name] = value;
  }

  // Ends the connection by callings the end method on
  // this Response object's internal socket object
  end() {
    this.sock.end();
  }

  // Returns the the first line of an http response
  // based on the properties defined in this Response instance
  statusLineToString() {
    return `${this.version} ${this.statusCode} ${
      HTTP_STATUS_CODES[this.statusCode]
    }\r\n`;
  }

  // Returns a String representing the headers of this http response
  headersToString() {
    let result = "";
    for (const header in this.headers) {
      result += `${header}: ${this.headers[header]}\r\n`;
    }
    return result;
  }

  // Sets the body property of this Response object.
  // Sends a valid http response to the client based on this Response object's properties
  // and the body argument, and closes the connection.
  send(body) {
    if (this.headers === null) {
      this.headers["Content-Type"] = "text/html";
    }

    this.sock.write(this.statusLineToString());
    this.sock.write(this.headersToString() + "\r\n");
    this.sock.write(body);

    this.sock.end();
  }

  status(statusCode) {
    this.statusCode = statusCode;
    return this;
  }
}

/*
 App represents a web application. It's responsible for:
 1. accepting and parsing incoming http requests (using the Request class)
 2. holding "routes" (http method and path combinations) in a property called (of course) routes
 3. optionally calling a middleware function if it exists on an App instance as middleware 
 (only one middleware function can be set, which is different from how Express works)
 4. or simply determining what to do based on the incoming request path 
 (if no middleware is present, or if middleware passes processing on to the route handlers)
 5. … and finally sending back a valid http response
*/
class App {
  // Creates a new App object and sets the connection callback function to this.handleConnection
  constructor() {
    this.server = net.createServer((sock) => this.handleConnection(sock));
    this.routes = {};
    this.middleware = null;
  }

  // Takes a path and normalizes casing and trailing slash
  normalizePath(path) {
    if (path === "/") {
      return "/";
    } else {
      let result = "";
      for (let i = 0; i < path.length; i++) {
        const check = path.charAt(i);
        if (check === "/" && /[a-zA-Z]/.test(path.charAt(i + 1))) {
          result += "/";
        } else if (/[a-zA-Z]/.test(check)) {
          result += check.toLowerCase();
        } else {
          break;
        }
      }
      return result;
    }
  }

  // Takes a an http method and path, normalizes both, and concatenates them
  // in order to create a key that uniquely identifies a route in the routes object
  createRouteKey(method, path) {
    return method.toUpperCase() + " " + this.normalizePath(path);
  }

  // Adds GET and path together to create a "key",
  // which will be used to map to a value - the callback function, cb
  get(path, cb) {
    this.routes[this.createRouteKey("GET", path)] = cb;
  }

  // Sets the middleware property for this instance of App
  use(cb) {
    this.middleware = cb;
  }

  // Binds the server to the given port and host ("listens" on host:port)
  listen(port, host) {
    this.server.listen(port, host);
  }

  // The function called when a client connects to the serve
  handleConnection(sock) {
    sock.on("data", (data) => this.handleRequest(sock, data));
  }

  // The function called when the socket receives data from the client
  handleRequest(sock, binaryData) {
    const req = new Request(binaryData + "");
    const res = new Response(sock);

    if (this.middleware !== null) {
      this.middleware(req, res, () => {
        this.processRoutes(req, res);
      });
    } else {
      // If there is no middleware, calls processRoutes
      this.processRoutes(req, res);
    }
  }

  // Calls the appropriate function stored in routes to handle the incoming request based on method and path
  processRoutes(req, res) {
    const method = req.method;
    const normalizedPath = this.normalizePath(req.path);
    const routeKey = this.createRouteKey(method, normalizedPath);

    if (this.routes.hasOwnProperty(routeKey)) {
      this.routes[routeKey](req, res);
    } else {
      res.status = 404;
      res.send("<h1>Page Not Found</h1>");
    }
  }
}

module.exports = {
  HTTP_STATUS_CODES,
  MIME_TYPES,
  Request,
  Response,
  App,
  getExtension,
  getMIMEType,
  static: serveStatic,
};
