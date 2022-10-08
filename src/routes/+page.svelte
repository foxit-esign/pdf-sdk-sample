
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
            licenseSN: 'F6zq/gnyXOJ3zTYN9qcW01O7GMmDvohLSXR7zQqALGJgNiu+NAaZ3w==',
            licenseKey: 'PjwcmTawMSysb7uJGyG8Al+PlhAAkpdTk+VlWKF4jqe5rsYpOV4gQXmp5lUbED4ltJ2b8bqCHoCfDIHhYGKcu0uLmdhOZ2lZSt1iTdc8WECg6OzUT8gD/jox/Q26svySxTV7MkSquAxVer5OQJSEGp6qt2cNklWOJVnsgs81B5qtqpmxgz74+Qzint8ADEvimqmI6ah0kmTSm+CkuEOb6pnkuPEaqjtSWYsDNNRIBr2PXdvpUs1mlUPHY139AJSsVExIB+eaLVXE0LyirpWPIgr/jgBzWzNbgAPwC0qBH0/y0AAJXPBKvIw9Tm8cXgRc1bV8sdqTg50QxPIE08aKjxoZV8iuunO5DCImM6EuwTyM8tljihpl7440Bbv2b8XZf71/+/yk04FsT6gaf/bZHeuk9COg5rLKmqD0QfPbANkPA44njuAoINo+rc0lIMcRKz7c7iLLaTIFbVi5vib4qxJnve9+/gPRQFsMqre/Zrk9uE9hXjjOrEprs/Eh9UjThJ6ASxzhtNmIyIKb4rePyGqT0vj4UNv0o7T6BgUuBsPEFL9P/ZYMQSNrzDbmYTUn7x0UeZo3beGFIsYX7r2/ya0Z2cESIcVKNdP0CSIlTwJ3rAez6e9fkMP0cPLIUqS93e+TBbfmn1u6MCsFUfP6YtErQsF5+i7t14zsHfU/E9/S+txt7y4erAzl7EpK5IrGWenlFdHYSkBnh9Xz7rXHa3LbBJCm95ZIzzBGZYKdHeWhCgGZNa+EpZJP56dvEn9wwcEX3urYjfQUUAGONl52wN1xO3x1Vbe2PA9C7rqJaCnG3ektvZ/p+CI241fnOksDYAqx+gvW7x1SOf4oDlv90oUDNylRH7tPkNpk2axtvYLiinHlHJzX2FrtFFdZmnkdRy4iEWPBfKWQ5cb5GMubyumGmeB/Cw/eTTli02ntK9AynSaXfUrDonDCyA1p02ycG3iMmdMwOMYRLlYSXEznuuTXjtQXf2Ky7nCIcWZlGv/s2zH2+rdAgacG2DkXiSwUU4JBk9kJka7rCTXkV8PyeQ0JLSX56L3IwAfuR2jis1Mv/4KlOLNjtrp7JMIEFSV9iQr+Yr2DSNANm0rkqvc9W68aQRb7XN0GN0LIBc3HN/3CWZp32BavvQkL3RwYAPsWnV+vOZqSGnRw3dfAKu6vO5g/WFeP6rrBUZpbP3IKDBvg1dG3RIf9w3VXSKVopExwSPH09GZQ+LcFScMFZkjKBKW6C7bEvw6/eG0ZRg=='
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