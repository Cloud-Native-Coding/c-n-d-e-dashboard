# c-n-d-e-dashboard

## web app

Dependencies (see package.json for the full list)

* [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/zeit/next.js/tree/canary/packages/create-next-app)
* [React](https://reactjs.org/)
* [Material Components for the web](https://github.com/material-components/material-components-web)

## run the local development server

```bash
$ npm run dev
# or
$ yarn dev
```

## docker

```sh
$ docker build -t cnde-web-app .
```

```sh
$ docker run --env API_BASE={root-of-rest-api} -it -p 3000:3000 --rm --name app cnde-web-app
```
