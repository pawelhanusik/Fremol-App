<p align="center"><a href="http://pawel.hanusik.pl/fremol" target="_blank"><img src="src/assets/logo.svg" width="170"></a></p>

# Fremol (frontend)

Messaging app with backend you host yourself.

## Installation

Install quasar  
[https://quasar.dev/quasar-cli/installation#introduction](https://quasar.dev/quasar-cli/installation#introduction)

Install the dependencies
```bash
yarn
```

## Configuration

You can set your host, api port and websockets port as default ones in `fremol.conf.js`

## Running

Start the app in development mode
```bash
quasar dev
```

Build the app for production
```bash
quasar build
```

## Android app

Start the app in development mode
```bash
quasar dev -m capacitor -T android
```

Build the app for production
```bash
quasar build -m capacitor -T android -ide
```

More info:  
[https://quasar.dev/quasar-cli/developing-capacitor-apps/publishing-to-store#android-publishing](https://quasar.dev/quasar-cli/developing-capacitor-apps/publishing-to-store#android-publishing)
