
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

    async function printSomething() {
        console.log(pdfui);
        console.log(pdfui.pdfViewer.getAllActivatedElements());
        // retrieving base64file
        // var file = await pdfui.pdfViewer.currentPDFDoc.getFile();
        
        // console.log(await toBase64(file));
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
                }
            },
            renderTo: '#pdf-ui',
            appearance: UIExtension.appearances.adaptive,
            // Insert a button after the handl-tool button using fragment.
            // By default, the button text is invisible, 
            // you can add a css-class 'fv__ui-toolbar-show-text-button'  to make the text appear  
            fragments: [{
                target: 'hand-tool',
                template: '<xbutton class="fv__ui-toolbar-show-text-button" name="cus-button">New button in front of hand-tool</xbutton>',
                action: FRAGMENT_ACTION.BEFORE,
                config: [{
                    target: 'cus-button',
                    callback: function() {
                        printSomething();
                    }
                }]
            },
            {
                target: 'protect-tab-group-sign',
                action: FRAGMENT_ACTION.EXT,
                config: {
                    visible: false // Set to false to hide the snapshot button
                }
            }]
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
                url:'/FoxitPDFSDKforWeb_DemoGuide.pdf',
            }
        },{fileName:'FoxitPDFSDKforWeb_DemoGuide.pdf'})

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