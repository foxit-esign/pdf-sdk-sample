
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
            licenseSN: 'O6MqjvvtmSDdlcywT7vUG5L5rPNwkOu7L1AGnDBtI1Ttl7NC4XhlXA==',
            licenseKey: 'PjwcmTawOS6sb5sQFTk2C3T9Uen7S4v6Q7bwnL1ou70vptP6pZAcFGcicxIycnH3dA7gyVW0hnFPhsxZCzMK4l0rjrP0Ew3f8GuF6uFE9cHg06jIBe0KX+6bhUzV4jW4IxTZ1koud/ytPVGz8DWgCNjrgFhz5btlVXxAKAiwmii8m5F9+YYRskp9mfSTPWJU7Xrfw6O7F5xWuGADqJHtSV8hWPWL+yEnFMcwXGLwK/SSRrAOmIY5CfdLFw9R0qn2++mlOX3qE0/rkCoAh2yXDG5pU+CkmoOG08Ut3Cs8DCXs5ySQ+N/yvNIR5WsXmpCsSu6uQO7+VmP7FH46d8dWz6pB+LgM++mFIcVIsU5cA2zSShffsnZFh88tHIL5DqfkbpMPj6toq+pFhwqP7SxwOrdtqOlGeycWzGdEj9+Nat2F3QyvFTxft01Tv8ojSm1P5xjrxGNvnXKEcu8+j17Q3qpdrW92hpphiHzu1CUYJyjK3fydoHRj/ZjN10FUXYQ/ZwQh0P0mgu9LVz4aIiyt4ia/IXKjkN4zwe+DORrchCDyP20WSEYgn7vkZhrhtoitSu8G6xinZKJluCK2Q51/QPwH8gsxt2NvImLbm1SQliimvKM5+imI/nWcf+6b2NclsI6y0ZOPXwJe+IXBxZQiIfpYZJy8JPtKtsb+5qXOiAsqakvGnYnwVt0+WwWowYLW2jdLRv5zNV4pJIqmchTlrm6s4FZDossy4hxkjla/rZRGRt/o/r/+O7oWGq02xnN1aXsFq6aaVa/+04ynJqzbYzs2vdWoSxc/xQcXpXo4nHaZIYTQ3S+FeVNh/nSMW+eo3jGfHU0cyeaIhjdweDSTLUpXbDO6PzKADRbWgIccHRwnMBfpoAQ1BEsSQd37srI/GAsNgTJ0VFxmet9/WZYECX8Ba6fzNu7BirxNBZFE/zipX/zeiltuQoqHEAHZVFRmYCt5Gwirdd751YplZoXWMyetT/GAMlTt+NyUv59n08eZu3+2T5BMLGXxrLCSqQO+Hd+1kN3Q8DSYkvLTX3hVn0Cfpe0UpPN59ooY+CDfFRpb3Gt1mp58J70+LCMbe31JiAaoQWWIeJYZFZhH6VsNwhH1wI9uysrGPXGSI62/74LXCHLTRgbRfBgPdb0sYnFBCQBueEjqkhyuBfVHHO+ZudzDuJxnzCjfhAqaqiEgR1O6m1tKB8U4AW8OQkYWvHk5SIhoHry8WrN0+R/5fnzYRA=='
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
