
<svelte:head>
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