jQuery(document).ready(function(){
    let $signIn = jQuery('#ai-signin');
    if(!fmAi.key || $signIn.attr('data-disconnected') == 'yes' || $signIn.attr('data-just-signed-in') == 'yes'){
        //No key provided
        if($signIn.attr('data-just-signed-in') == 'no' || $signIn.attr('data-disconnected') == 'yes') {
            //Sign in necessary
            $signIn.removeClass('hidden');
            return;
        }
        else {
            //Sign in callback -> save key to fmAi object and check
            fmAi.key = $signIn.attr('data-key');
        }
    }
    //user is signed in -> show according view
    jQuery('#ai-signed-in').removeClass('hidden');

    //Check account & load tokens amount
    jQuery.ajax({
        type: 'GET',
        url: fmAi.url + 'authorize?key=' + fmAi.key,
        dataType: 'json',
        success: function(data){
            console.log('success', data);
            if(data.authorize){
                jQuery('.ai-checking').addClass('hidden');
                jQuery('.ai-connected').removeClass('hidden');
                jQuery('#ai-available-tokens').html(data?.tokens ? data?.tokens : '0');
                jQuery('#ai-available-tokens-free').html(data?.freetokens ? data?.freetokens : '0');
            }
            else {
                jQuery('#ai-signed-in').addClass('hidden');
                $signIn.removeClass('hidden');
                jQuery('#signin-error').removeClass('hidden');
            }
            
        },
        error: function(xhr, status, error) {
            console.log('Error: ' + error.message);
            jQuery('#ai-signed-in').addClass('hidden');
            $signIn.removeClass('hidden');
            jQuery('#signin-error').removeClass('hidden');
        }
    })
});