<p align="center">
  <img src="https://raw.githubusercontent.com/Aldrie/XCofey/master/assets/logo.png" width="200" alt="Logo"/>

  <h1><strong>X</strong>Cofey</h1>
</p>

# Make you developer life easier with this lib
## Based in express, this lib is aimed at those who want something quick and easy, when it comes to developing APIs!

# Getting started
## First you need to **install** the lib
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/540px-Npm-logo.svg.png" width="60" alt="npm logo"/>

```console
hello@world:~$ npm i xcofey
```
or

<img src="https://www.bram.us/wordpress/wp-content/uploads/2016/10/yarn-kitten-full.png" width="80" alt="yarn logo"/>

```console
hello@world:~$ yarn add xcofey
```

## Basics

### Server
```js
const { CreateServer } = require('xcofey');

CreateServer({
  port: 3000,
  controllers: [],
});
```

### Controller (routes)

```js
const { CreateController, Get, HttpError, HttpStatus } = require('xcofey');

const sayHelloWordRoute = Get('/hello', (req, res, next) => {
  try {
    return res.send('Hello Word!');
  } catch(error) {
    next(new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'unexpected error');
  }
});

module.exports = CreateController('/', [sayHelloWordRoute]);
```

Docs -> coming soon