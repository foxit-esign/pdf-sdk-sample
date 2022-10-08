# Foxit Web SDK + Foxit eSign

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ffoxit-esign%2Fpdf-sdk-sample&env=PRIVATE_FOXIT_ESIGN_ACCESS_TOKEN&demo-title=Foxit%20PDF%20SDK%20%2B%20Foxit%20eSign&demo-description=Securely%20Edit%20and%20Send%20PDFs%20for%20Signature%20by%20leveraging%20both%20the%20Foxit%20PDF%20SDK%20and%20Foxit's%20own%20eSign%20API.&demo-url=pdf-sdk-sample.vercel.app&demo-image=https%3A%2F%2Fuser-images.githubusercontent.com%2F93008420%2F194686132-a42f09db-a258-480d-9933-eb4ac108efc1.png)

Securely Edit and Send PDFs for Signature by leveraging both the Foxit PDF SDK and Foxit's own eSign API.

<img width="707" alt="Application Screenshot" src="https://user-images.githubusercontent.com/93008420/194686132-a42f09db-a258-480d-9933-eb4ac108efc1.png">


By using this app, you will be able to quickly upload pdfs and use any features available in the Foxit eSign SDK before sending a document for signature.

## Project Structure

```
├── src (main src folder)
│   ├── app.html
│   └── routes
│       ├── +page.server.js (back-end edge api call -- creates Foxit eSign Envelope from a file
│       └── +page.svelte (front-end application code - imports PDF SDK library
```
## Developing

Before you get started with running the application, please make sure to include a .env file the root of your directory. You may create your own .env file from this [.env.example](.env.example) file.

Once you've cloned this project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> This app is powered by and deployed in [Vercel]([https://kit.svelte.dev/docs/adapters](https://vercel.com/foxit-esign), and can be deployed in similar platforms as well :).
