# 📲 iOS APNS Proxy Service

Express app that will intercept `/comms/device_token`, injecting a token that is registered with the express app and listen for FCM push notifications for that token.

It's sole purpose is to be used with an iOS simulator, on macOS to show push notifications inside the simulator.

### Resources

 - https://alexbartis.medium.com/sending-push-notifications-to-the-ios-simulator-2e97d395a0fc

## Installation

Run `yarn` from the root

## Running

Run `yarn start` from the root

## Environment

There are several required environment variables, which are located in `.env.example`:

```
# Port to run express on
API_PORT=3080

# API path prefix, separate from the api host
API_PATH=/api/v1

# Log every request and response to the console
DEBUG_VERBOSE=false

# FCM sender ID, found in the cloud messaging console
SENDER_ID=777568941428

# Proxy API host (without the path)
PROXY_API=preprod.api.qa-stint.net

# Whether the proxy API is https or not
PROXY_HTTPS=true

# APNS directory to store the generated APNS files
APNS_DIR=/tmp

# Simulator UUID
APNS_SIMULATOR_UUID=D6F87E56-19DF-4A46-9653-3D9400416CDA

# App bundle ID to target
APNS_TARGET_BUNDLE=com.stint.v3
```

You should create a `.env.local` and add your own settings there

## How do I find the simulator UUID?
Make sure your simulator is booted and run

```
xcrun simctl list | grep "(Booted)"
```

## How does it work?

This service proxies all calls as if you were hitting the API directly, but intercepts the `device_token` API call.

Before you would point the application directly to the API like so:

```
Application ----> API
```

By pointing the application at this proxy, it will proxy all calls properly and allow us to intercept the device token call, e.g.

```
Application ----> iOS APNS Service ----> API
```

### Ok, but how does it actually work?

This service uses [`express-http-proxy`](https://www.npmjs.com/package/express-http-proxy) to do the heavy lifiting when proxying normal calls to the API.

In order to register this service as a client for FCM, this service uses a package called [`push-receiver`](https://www.npmjs.com/package/push-receiver).

When a call is made to the API end point `/api/v1/comms/device_token`, express proxy will pick up that call and pass it through a body resolver.  Inside this resolver we switch the iphone token (that was passed in the body) with the new token that has been registered to the service.  A listener is then created which listens for all push notifications for the new injected.  When a push notification happens, the listener creates and APNS file and then runs the `xcrun simctl push` command with the given simulator uuid, target bundle and the APNS file that was created.  This gives the illusion that the push notification has come from the app itself. Very smoke and mirrors...
