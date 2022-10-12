
<svelte:head>
    <script src="/foxit-pdf-sdk-lib/PDFViewCtrl.full.js"></script>
    <script src="/foxit-pdf-sdk-lib/preload-jr-worker.js"></script>
    <script src="/foxit-pdf-sdk-lib/UIExtension.full.js"></script>
    <link rel="stylesheet" href="/foxit-pdf-sdk-lib/UIExtension.css">
    <link rel="stylesheet" type="text/css" href="/foxit-pdf-sdk-lib/PDFViewCtrl.css">

    <script>
        var readyWorker = preloadJrWorker({
            workerPath: '/foxit-pdf-sdk-lib/',
            enginePath: '/foxit-pdf-sdk-lib/jr-engine/gsdk',
            // fontPath: '../external/brotli',
            licenseSN: 'S29utLB+IQ83ZqVP4zRVIMFGhpIcGogey3ZsvYIgb2m/guop0uIXMw==',
            licenseKey: 'PjwcmTawOS6sb5sQFTk2C3D9Uen7S4v6Q7ZwTJIoFs7hjDJkF2SXURi5cMk7nsY+uFx59ICYT71nmvbbRkMZk+vNQ2O+pEm9KJ2GNZ+3xOQq7sSZJ6gC+jgfhhBazzZLRK/rbWNtM5MjnPByWigy42G1I/e4MD27XvaHCcRr+ZqRFtgdeEow8guPcNLdV2nj1UX51Zrsw/kcNuNsoNVk4ZUbQBQvLziuhLplpgS5OExLEHhvb5BgQ89iUyeklT0npTNMaKqgtvScujwCZGpUn0a4JSNCP1GOnm1BY31uadadGTmSp+jRrfHfHl6l6ugTBXSKV1jxGCuPR/G9hErhJLseJZKaK8oMdSuabA0IWqwR3zYdcwG40dVM9EP5da7VEwA+N+nQ23QNuSjDKG9ennYk//7hcIySV5K3fnzTRnqsVHiBSnOA/y5ZiqgBUK8rnSpSz2yVHG1T2yRTyNkpcFg6ic9gZb4J8exxkwgOD4+7qNteED69cuT8mZMRp1rbX6E/qLC54qtW2Fcmaw6Eq3EDadkAoPyGiXGt3h0E70WdJCE0OlvwIiWdrTI6CBgPg6J2cQe0I7R3Ofa/5O1goKaGooTvQmstG8DYyehvqcXtqiJfWMUyIOqDYCsYburJn1SzP2ULxmCjU5zcWqulejee4N1SDbjEeE8chqSbvvh7Os4jp5ERBkOgqYTqH1H3TMS5IYFUsA1+mz4BpQXelDm2AWQ4lsfgeiVZruIHySgWhX3y39GgGzSQ1gxDsV8rCGSY0mPRCRt7U52kuRz1DS7U9SgsULY+xbcMQ+IvmGkwEGyuXFR8dCOqkAelsF/uCqqwJHI9rHaE9t/X1S16S8+oO2iAmO6CmVtGuZ7s73ISotSoNmJ0bzlNIJ+89EgtO3DLKVj2UtOxdfhQoDjuBem1Zgu+BZQz6uT6yDKb9hPojJOsZvoLfGiJzDdeVfNlDAZ7slq3/NgJsm42aTQK2ayZKbxjwoLVD9Q3JQ8RS0lEhwpbBr1PCxd7c7IY+7yal8wrYTEHNq4JKWiTpm2Vg87S8Fu5cMuJjdsbethmGEuRPjyLBJZAwqeZc4eubmstn6SfvClm8vxOi87ASVrMplSstb/ezZzvfVHgNR8zuWJH9XA3pzvUPyjuldbJaJ2N22AOykITEfYghQz4GELFoON0xH5vZpeGLNGBvkt+1QQKXGOBET446xyZFs2B92Q4gYRkWMkgcV42cb+hVuQa'
        });
    </script>

</svelte:head>


<script>
    import { onMount } from 'svelte';

    let mounted = false;
    
    let pdfui;

    onMount(() => {
        mounted = true;
        loadFoxitSdkElements();
    });


    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    async function sendViaFoxiteSign() {
        // 1. retrieve the  base64file
        var file = await pdfui.pdfViewer.currentPDFDoc.getFile();

        // 2. retrieve embedded session via foxit esign api
        let foxiteSignFormData = new FormData();
        foxiteSignFormData.append("base64File", await toBase64(file));

        const response = await fetch('/', {
            method: 'POST',
            body: foxiteSignFormData
        });

        const { data } = await response.json();

        // 3. open the embedded signing session in this same window
        if(!data.sessionUrl !== "") {
            window.open(data.sessionUrl, "_self");
        }
    }

    function loadFoxitSdkElements() {
        var PDFUI = UIExtension.PDFUI;
        var FRAGMENT_ACTION = UIExtension.UIConsts.FRAGMENT_ACTION;
        var Events = UIExtension.PDFViewCtrl.Events;
        pdfui = new PDFUI({
            viewerOptions: {
                libPath: './foxit-pdf-sdk-lib/',
                jr: {
                    readyWorker: readyWorker
                },
                defaultScale:"fitHeight"
            },
            renderTo: '#pdf-ui',
            appearance: UIExtension.appearances.adaptive,
            // Insert a button after the handl-tool button using fragment.
            // By default, the button text is invisible, 
            // you can add a css-class 'fv__ui-toolbar-show-text-button'  to make the text appear  
            fragments: [{
                target: 'hand-tool',
                template: '<div style="display: flex;"><button class="fv__ui-toolbar-show-text-button fv__ui-button" name="cus-button"><img src="https://www.foxit.com/static/company/images/icons/foxit-esign-logo-500x500.png" style="width: 2rem; height: 2rem; margin-top: 4px; margin-bottom: 4px; margin-left: 4px; margin-right: 4px;">Send via Foxit eSign</button></div>',
                action: FRAGMENT_ACTION.BEFORE,
                config: [{
                    target: 'cus-button',
                    callback: function() {
                        sendViaFoxiteSign();
                    }
                }]
                },
                {
                    target: 'protect-tab-group-sign',
                    action: FRAGMENT_ACTION.EXT,
                    config: {
                        visible: false // Set to false to hide the snapshot button
                    }
            }],
            addons: [
            '/foxit-pdf-sdk-lib/uix-addons/file-property',
            '/foxit-pdf-sdk-lib/uix-addons/multi-media',
            '/foxit-pdf-sdk-lib/uix-addons/path-objects',
            '/foxit-pdf-sdk-lib/uix-addons/print',
            '/foxit-pdf-sdk-lib/uix-addons/full-screen',
            '/foxit-pdf-sdk-lib/uix-addons/import-form',
            '/foxit-pdf-sdk-lib/uix-addons/export-form',
            '/foxit-pdf-sdk-lib/uix-addons/undo-redo',
            '/foxit-pdf-sdk-lib/uix-addons/thumbnail',
            '/foxit-pdf-sdk-lib/uix-addons/search',
            '/foxit-pdf-sdk-lib/uix-addons/read-aloud',
            '/foxit-pdf-sdk-lib/uix-addons/recognition-form',
            '/foxit-pdf-sdk-lib/uix-addons/edit-graphics',
            '/foxit-pdf-sdk-lib/uix-addons/form-designer',
            '/foxit-pdf-sdk-lib/uix-addons/text-object',
            '/foxit-pdf-sdk-lib/uix-addons/rotate-pages'
        ].concat(UIExtension.PDFViewCtrl.DeviceInfo.isMobile ? [] : '/foxit-pdf-sdk-lib/uix-addons/text-object')
                
        });
        
        pdfui.addUIEventListener('fullscreenchange', function(isFullscreen) {
            if(isFullscreen) {
                document.body.classList.add('fv__pdfui-fullscreen-mode');
            } else {
                document.body.classList.remove('fv__pdfui-fullscreen-mode');
            }
        });

        pdfui.openPDFByHttpRangeRequest({
            range:{
                url:'/Foxit_Example_Invoice.pdf',
            }
        },{fileName:'Foxit_Example_Invoice.pdf'})

    }

    function loadPDF() {
        // console.log(pdfui);
        pdfui.openPDFByHttpRangeRequest({
            range:{
                url:'/FoxitPDFSDKforWeb_DemoGuide.pdf',
            }
        },{fileName:'FoxitPDFSDKforWeb_DemoGuide.pdf'})
    }
</script>

<main>
</main>