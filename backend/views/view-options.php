<?php 
/** Build current url for callback */
$currentUrl = admin_url('admin.php?page=firstmedia-ai-options');
?>
<div class="ai ai-page">
    <h1><?php _e('aiflow Settings', 'firstmedia-ai-text' ); ?></h1>
    <div class="ai-settings">
        <div id="ai-signin" class="hidden" data-disconnected="<?php echo $isDisconnected ? 'yes' : 'no' ; ?>" data-just-signed-in="<?php echo $isLoginCallback ? 'yes' : 'no'; ?>" data-key="<?php echo esc_attr(get_option('firstmedia_aiflow_api_key')); ?>">
            <div>
                <div class="images">
                    <img src="<?php echo FIRSTMEDIA_AIFLOW_PLUGIN_URL; ?>/assets/images/ai_icon_text.svg" />
                </div>
                <div class="signin">
                    <div id="signin-error" class="ai-error hidden"><?php _e('An error occured checking your session status. Please connect again.', 'firstmedia-ai-text'); ?></div>
                    <p><?php _e('You are not signed in.', 'firstmedia-ai-text' ); ?></p>
                    <h2><?php _e('To Start using our AI, you have to sign in with your account on our platform.', 'firstmedia-ai-text'); ?></h2>
                    <p><?php _e('Click the button below to connect or create an account with us.', 'firstmedia-ai-text'); ?></p>
                    <a href="<?php echo esc_url(FIRSTMEDIA_AIFLOW_API.'login/?redirect='.urlencode($currentUrl).'&site='.get_bloginfo('name')); ?>" target="_self">
                        <button class="button button-primary"><?php _e('Connect your account now', 'firstmedia-ai-text'); ?></button>
                    </a>
                </div>
            </div>
        </div>
        <div id="ai-signed-in" class="hidden ai-account-view">
            <div>
                <div class="ai-connected hidden">
                    <?php _e('You are connected.', 'firstmedia-ai-text' ); ?>
                    <a href="<?php echo FIRSTMEDIA_AIFLOW_API.'my-account'; ?>" target="_blank"><button class="button"><?php _e('Manage account', 'firstmedia-ai-text'); ?></button></a>
                    <a href="<?php echo $currentUrl; ?>&disconnect=yes" id="ai-disconnect"><?php _e('Disconnect', 'firstmedia-ai-text'); ?></a>
                </div>
                <div class="ai-checking">
                    <?php _e('Checking connection to AI...', 'firstmedia-ai-text' ); ?>
                </div>

                <div class="tokens">
                    <div>
                        <p><?php _e('Your available descriptions', 'firstmedia-ai-text'); ?></p>
                        <h2 id="ai-available-tokens">...</h2>
                    </div>
                    <div>
                        <p><?php _e('Free descriptions remaining', 'firstmedia-ai-text'); ?></p>
                        <h2 id="ai-available-tokens-free">...</h2>
                    </div>
                </div>
            </div>
            <div>
                <h1><?php _e('Need more descriptions?', 'firstmedia-ai-text'); ?></h1>
                <div>
                    <?php _e('Subscribe now and get monthly tokens.', 'firstmedia-ai-text'); ?>
                </div>
                <a href="<?php echo FIRSTMEDIA_AIFLOW_API; ?>our-pricing/" target="_blank" class="ai button button-primary"><?php _e('Subscribe now', 'firstmedia-ai-text'); ?></a>
                
                
            </div>
            
        </div>
    </div>
</div>