jQuery(document).ready(function(){
    const seoIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-seo" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M7 8h-3a1 1 0 0 0 -1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-3"></path><path d="M14 16h-4v-8h4"></path><path d="M11 12h2"></path><path d="M17 8m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"></path></svg>';
    const generateIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-pencil-plus" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M8 20l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4h4z"></path><path d="M13.5 6.5l4 4"></path><path d="M16 18h4m-2 -2v4"></path></svg>';
    const regenarateIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-rotate-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 4.55a8 8 0 0 0 -6 14.9m0 -4.45v5h-5"></path><path d="M18.37 7.16l0 .01"></path><path d="M13 19.94l0 .01"></path><path d="M16.84 18.37l0 .01"></path><path d="M19.37 15.1l0 .01"></path><path d="M19.94 11l0 .01"></path></svg>';
    //Appends the regenarate butotn row
    const appendRegenarateButton = () => {
        let divContent = '<button class="ai ai-generate-text button button-primary button-large">' + generateIcon + fmText.generateButton + '</button>';
        divContent += '<button class="ai ai-regenerate-text button button-primary button-large">' + regenarateIcon + fmText.rewriteButton + '</button>';
        divContent += '<button class="ai ai-seo-optimize button button-primary button-large">' + seoIcon + fmText.optimizeButton + '</button>';
        
        if( jQuery('#ai-regenerate-div').length == 0) jQuery('#postdivrich').append('<div class="ai ai-root" id="ai-regenerate-div"><div class="ai-container">' + divContent + '</div></div>');
    }

    //opens a dialog on top of the editor
    const createAiDialog = (divContent) => {
        jQuery('#postdivrich').append('<div class="ai ai-root ai-overlay"><div class="ai-container">' + divContent + '</div></div>');
    }
    jQuery(document).on('click', '.close-description-dialog', function(){
        jQuery(this).closest('.ai-root').remove();
    });

    //Check if product/post has description
    if(jQuery('textarea[name=content]').val() == '')  {
        //no description -> show generate banner
        let divContent = '<button class="ai ai-generate-text button button-primary button-large">' + generateIcon + fmText.generateWithAI + '</button>';
        if( !fmAi.key ) divContent = '<h3>' + fmText.readyForAI + '</h3><a href="' + fmAi.admin_url + 'admin.php?page=firstmedia-ai-options" class="ai button button-primary button-large">' + fmText.connectToAI + '</a>';
        divContent += '<a href="#" class="close-description-dialog">' + fmText.manuallyEnter + '</a>';
        createAiDialog(divContent);
    }
    else {
        appendRegenarateButton();
    }

    //Handle generate description click
    const sendAIRequest = (context, action, requestMessage) => { 
        let $containerDiv = jQuery(context).closest('.ai-root').find('.ai-container');

        //Set state to loading
        jQuery('#post-body-content').addClass('generating');
        jQuery(context).addClass('loading');
        

        //Clear Post content first
        window.parent.tinyMCE.get("content").setContent('')

        //Close event stream and set state to not loading
        let dataReceived = false;
        const closeEventSource = () => {
            jQuery(context).removeClass('loading');
            jQuery('#post-body-content').removeClass('generating');
            eventSource.close();
            if(dataReceived){ 
                jQuery(context).closest('.ai-overlay').remove();
                appendRegenarateButton();
            }
        }

        

        //Open Event Stream to api with key and prompt 
        let additionalParams = '';
        if( jQuery(context).attr('data-force') == 'yes' ) additionalParams += '&force=yes';
        const eventSource = new EventSource(fmAi.url + 'prompt?key=' + fmAi.key + '&action=' + action +  '&prompt=' + requestMessage + additionalParams);

        //Message receive
        eventSource.onmessage = (event) => {
            if(event.data == '[DONE]'){ //DONE = Stream over
                console.log('closing event source');
                return closeEventSource();
            }
            let data;
            try {
                data = JSON.parse(event.data);
            } catch (e) {
                return console.error(e); // error in the above string (in this case, yes)!
            }
            if(data?.error) {
                alert( fmText.errorProcessingRequest );
                return;
            }
            dataReceived = true;

            if( data?.choices?.[0]?.finish_reason == 'stop' && data?.choices?.[0]?.message?.content )
                window.parent.send_to_editor( data?.choices?.[0]?.message?.content );
            else if( data?.choices?.[0]?.finish_reason != 'stop' && data?.choices?.[0]?.delta?.content )
                window.parent.send_to_editor( data?.choices?.[0]?.delta?.content );
            console.log('received', event.data);
        }

        //No Tokens event
        eventSource.addEventListener('tokenlimit', (event) => {
            $containerDiv.html('<h3>' + fmText.noCreditsRemaining + '</h3><a href="' + fmAi.admin_url + 'admin.php?page=firstmedia-ai-options" class="ai button button-primary button-large">' + fmText.purchaseNow + '</a>');
            closeEventSource();
        })
        
        //too few tokens event (can continue, but not recommendet)
        eventSource.addEventListener('fewtokens', (event) => {
            let data = JSON.parse(event.data);
            $containerDiv.html('<h3>' + fmText.youHaveOnly + ' ' + data?.available  + ' ' + fmText.tokensRemaining + '</h3><a href="' + fmAi.admin_url + 'admin.php?page=firstmedia-ai-options" class="ai button button-primary button-large">' + fmText.purchaseMoreTokens + '</a><a href="#" class="ai-generate-text" data-force="yes">' + fmText.continueAnyway + '</a>');
            closeEventSource();
        })
        
        //No Tokens event
        eventSource.addEventListener('authorization', (event) => {
            $containerDiv.html('<h3>' + fmText.authorizationInvalid + '</h3><a href="' + fmAi.admin_url + 'admin.php?page=firstmedia-ai-options&dicsonnect=yes" class="ai button button-primary button-large">' + fmText.connectAgain + '</a>');
            closeEventSource();
        })
        
        //No Tokens event
        eventSource.addEventListener('license', (event) => {
            let elContent = '<h3>' + fmText.subcriptiondoesNotIncludeAction + '</h3><a href="' + fmAi.admin_url + 'admin.php?page=firstmedia-ai-options" class="ai button button-primary button-large">' + fmText.upgrade + '</a>';
            elContent += '<div class="full"><a href="#" class="close-description-dialog">' + fmText.close + '</a></div>';
            $containerDiv.html(elContent);
            closeEventSource();
        })

        //End event
        eventSource.addEventListener('end', (event) => {
            console.log('event end');
            closeEventSource();
        })
        //On Stream error
        eventSource.onerror = (event) => {
            alert('An error occured. Please try again');
            console.log('error', event);
            dataReceived = false;
            closeEventSource();
        }
    };

    //Generate product description based on title
    jQuery(document).on('click', '.ai-generate-text', function(e){
        e.preventDefault(); e.stopPropagation();
        if(jQuery('#title').val() == '') return alert(fmText.enterTitleFirst);
        //Rqeust Message to the AI
        let requestMessage = fmText.writeUniqueDescriptionPrompt + ' ' + jQuery('#title').val() + '';
        sendAIRequest(this, 'description', requestMessage);
    });

    
    //Rewrite product description -> Shows dialog with style
    jQuery(document).on('click', '.ai-regenerate-text', function(e){
        e.preventDefault(); e.stopPropagation();
        
        //no description -> show generate banner
        let divContent = '<div class="full"><label for="ai-text-tone">' + fmText.chooseTextTone + '</label><select class="ai ai-text-tone" name="ai-text-tone" id="ai-text-tone">'; 
        divContent += '<option value="" selected>' + fmText.doesNotMatter + '</option>';
        divContent += '<option value="warm">' + fmText.warmer + '</option>';
        divContent += '<option value="professional">' + fmText.professional + '</option>';
        divContent += '<option value="formal">' + fmText.formal + '</option>';
        divContent += '<option value="expressive">' + fmText.expressive + '</option>';
        divContent += '<option value="excited">' + fmText.excited + '</option>';
        divContent += '<option value="inspirational">' + fmText.inspirational + '</option>';
        divContent += '</select></div>';
        divContent += '<button class="ai ai-regenerate-generate button button-primary button-large">' + regenarateIcon + fmText.rewriteButton + '</button>';
        if( !fmAi.key ) divContent = '<h3>' + fmText.readyForAI + '</h3><a href="' + fmAi.admin_url + 'admin.php?page=firstmedia-ai-options" class="ai button button-primary button-large">' + fmText.connectToAI + '</a>';
        divContent += '<div class="full"><a href="#" class="close-description-dialog">' + fmText.close + '</a></div>';
        createAiDialog(divContent);
    });
    //Rewrite product description with chosen settings
    jQuery(document).on('click', '.ai-regenerate-generate', function(e){
        e.preventDefault(); e.stopPropagation();
        let tone = jQuery('#ai-text-tone').val();
        let description = window.parent.tinyMCE.get("content").getContent({ format: 'text' })
        
        let requestMessage = fmText.rewriteDescription + ' ' + description + '';
        if(tone !== '')
            requestMessage = fmText.rewriteTextInA + ' ' + tone + ' ' + fmText.tone + ': ' + description + '';
 
        sendAIRequest(this, 'description', requestMessage);
    });

    //Optimize product description for SEO -> Shows dialog with keywords
    jQuery(document).on('click', '.ai-seo-optimize', function(e){
        e.preventDefault(); e.stopPropagation();
        
        //no description -> show generate banner
        let divContent = '<div class="full"><label for="ai-keywords">' + fmText.optimizeWithKeywords + '</label><input type="text" class="ai keywords" name="ai-keywords" id="ai-keywords" placeholder="' + fmText.keywords + '" /></div>';
        divContent += '<button class="ai ai-seo-generate button button-primary button-large">' + seoIcon + fmText.optimizeForSeoButton + '</button>';
        if( !fmAi.key ) divContent = '<h3>' + fmText.readyForAI + '</h3><a href="' + fmAi.admin_url + 'admin.php?page=firstmedia-ai-options" class="ai button button-primary button-large">' + fmText.connectToAI + '</a>';
        divContent += '<div class="full"><a href="#" class="close-description-dialog">' + fmText.close + '</a></div>';
        createAiDialog(divContent);
    });

    //Executes the optimize seo command
    jQuery(document).on('click', '.ai-seo-generate', function(e){
        e.preventDefault(); e.stopPropagation();
        let keywords = jQuery('#ai-keywords').val();
        let description = window.parent.tinyMCE.get("content").getContent({ format: 'text' })

        let requestMessage = fmText.optimizeForSeo + ' ' + description + '';
        if(keywords !== '')
            requestMessage =  fmText.optimizeForSeoWithKeywords + ' ' + keywords + ': ' + description + '';

        sendAIRequest(this, 'seo', requestMessage);
    });
});