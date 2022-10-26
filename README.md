# Foxit Web SDK + Foxit eSign

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ffoxit-esign%2Fpdf-sdk-sample&env=PUBLIC_FOXIT_ESIGN_ACCESS_TOKEN&envDescription=PUBLIC_FOXIT_ESIGN_ACCESS_TOKEN%3A%20aef26937da504d9e94f0a56a548a3a96&envLink=https%3A%2F%2Fgithub.com%2Ffoxit-esign%2Fpdf-sdk-sample%2Fblob%2Fmain%2F.env.example&demo-title=https%3A%2F%2Fpdf-sdk-sample.vercel.app%2F&demo-description=PDF%20Web%20SDK%20%2B%20Foxit%20eSign%20Demo&demo-url=https%3A%2F%2Fpdf-sdk-sample.vercel.app%2F&demo-image=https%3A%2F%2Fuser-images.githubusercontent.com%2F93008420%2F194686132-a42f09db-a258-480d-9933-eb4ac108efc1.png)

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

As this project leverages Foxit PDF SDK, the keys are entered in the [+page.svelte](src/routes/+page.svelte) file, in lines 14-15 as so:

```javascript
  <script>
      var readyWorker = preloadJrWorker({
          workerPath: '/foxit-pdf-sdk-lib/',
          enginePath: '/foxit-pdf-sdk-lib/jr-engine/gsdk',
          // fontPath: '../external/brotli',
          licenseSN: 'S29utLB+IQ83ZqVP4zRVIMFGhpIcGogey3ZsvYIgb2m/guop0uIXMw==',
          licenseKey: 'PjwcmTawOS6sb5sQFTk2C3D9Uen7S4v6Q7ZwTJIoFs7hjDJkF2SXURi5cMk7nsY+uFx59ICYT71nmvbbRkMZk+vNQ2O+pEm9KJ2GNZ+3xOQq7sSZJ6gC+jgfhhBazzZLRK/rbWNtM5MjnPByWigy42G1I/e4MD27XvaHCcRr+ZqRFtgdeEow8guPcNLdV2nj1UX51Zrsw/kcNuNsoNVk4ZUbQBQvLziuhLplpgS5OExLEHhvb5BgQ89iUyeklT0npTNMaKqgtvScujwCZGpUn0a4JSNCP1GOnm1BY31uadadGTmSp+jRrfHfHl6l6ugTBXSKV1jxGCuPR/G9hErhJLseJZKaK8oMdSuabA0IWqwR3zYdcwG40dVM9EP5da7VEwA+N+nQ23QNuSjDKG9ennYk//7hcIySV5K3fnzTRnqsVHiBSnOA/y5ZiqgBUK8rnSpSz2yVHG1T2yRTyNkpcFg6ic9gZb4J8exxkwgOD4+7qNteED69cuT8mZMRp1rbX6E/qLC54qtW2Fcmaw6Eq3EDadkAoPyGiXGt3h0E70WdJCE0OlvwIiWdrTI6CBgPg6J2cQe0I7R3Ofa/5O1goKaGooTvQmstG8DYyehvqcXtqiJfWMUyIOqDYCsYburJn1SzP2ULxmCjU5zcWqulejee4N1SDbjEeE8chqSbvvh7Os4jp5ERBkOgqYTqH1H3TMS5IYFUsA1+mz4BpQXelDm2AWQ4lsfgeiVZruIHySgWhX3y39GgGzSQ1gxDsV8rCGSY0mPRCRt7U52kuRz1DS7U9SgsULY+xbcMQ+IvmGkwEGyuXFR8dCOqkAelsF/uCqqwJHI9rHaE9t/X1S16S8+oO2iAmO6CmVtGuZ7s73ISotSoNmJ0bzlNIJ+89EgtO3DLKVj2UtOxdfhQoDjuBem1Zgu+BZQz6uT6yDKb9hPojJOsZvoLfGiJzDdeVfNlDAZ7slq3/NgJsm42aTQK2ayZKbxjwoLVD9Q3JQ8RS0lEhwpbBr1PCxd7c7IY+7yal8wrYTEHNq4JKWiTpm2Vg87S8Fu5cMuJjdsbethmGEuRPjyLBJZAwqeZc4eubmstn6SfvClm8vxOi87ASVrMplSstb/ezZzvfVHgNR8zuWJH9XA3pzvUPyjuldbJaJ2N22AOykITEfYghQz4GELFoON0xH5vZpeGLNGBvkt+1QQKXGOBET446xyZFs2B92Q4gYRkWMkgcV42cb+hVuQa'
      });
  </script>
```

Below you will find a ZIP file with the license keys, in case you would like to leverage the PDF SDK outside of this framework:

[API-World-2022-License-Keys.zip](https://github.com/foxit-esign/pdf-sdk-sample/files/9747231/API-World-2022-License-Keys.zip)


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

> This app is powered by and deployed in [Vercel](https://vercel.com), and can be deployed in similar platforms as well :).
