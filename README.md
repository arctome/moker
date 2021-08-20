# Moker

The easiest hammer to break barriers of data mocking with the Cloudflare Worker's help!

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/arctome/moker)

## Requirement

The minimum requirement of self-host this service is ,

- Cloudflare Worker Free Plan
- [Moker Chrome Extension](#)
- Chromium based browser for install the extension

## Reason ?

As a frontend engineer, I want to test different API response in plenty of conditions, such as

- Cross department cooperation, it's hard to get immediately modified response;
- ...

If I can **MOCK** the required data without the develop API environment, I could easily finish the problem.

## Why not other similar project ?

## Notice

1. This project is heavily depend on [flareact](https://github.com/flareact/flareact), the issue of fiber has not been resolved yet, so your Node.js version should not be v16 or higher.
