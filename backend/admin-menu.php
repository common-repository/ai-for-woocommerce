<?php
defined( 'ABSPATH' ) or die( 'No access' );

/*** Icon in Menu List */
add_action( 'admin_menu', function(){
    add_menu_page(
        __('aiflow Settings', 'firstmedia-ai-text'),
        __( 'aiflow', 'firstmedia-ai-text' ),
        'manage_options',
        'firstmedia-ai-options',
        function() {
            /*** Admin Menu Callback */

            /*** Check if jwt param exists -> Login callback */
            $isLoginCallback = false;
            if( isset($_GET['jwt']) && $_GET['jwt'] != '') {
                $isLoginCallback = true;
                update_option('firstmedia_aiflow_api_key', sanitize_text_field($_GET['jwt']) );
            }

            /*** Check if disconnect param exists -> log out */
            $isDisconnected = false;
            if( isset($_GET['disconnect']) && $_GET['disconnect'] != '') {
                delete_option('firstmedia_aiflow_api_key');
                $isDisconnected = true;
            }

            //render view:
            require_once 'views/view-options.php';
        },
        plugins_url( '../assets/images/ai_icon_small.png', __FILE__ ),
        '55.6.0'
    );
} );

/*** JS and CSS for Backend */
add_action( 'admin_enqueue_scripts', function(){
    wp_register_style( 'firstmedia-ai-style', plugins_url( '../assets/css/components.css', __FILE__ ), null, FIRSTMEDIA_AIFLOW_VER );
    $data = array(
        'key' => get_option('firstmedia_aiflow_api_key'),
        'url' => FIRSTMEDIA_AIFLOW_API . 'api/ai/v2/',
        'admin_url' => get_admin_url(),
    );
    global $post, $post_type;
    if ( ( $post_type == 'product' ) && isset( $post ) ) {
        wp_enqueue_style( 'firstmedia-ai-style');
        wp_enqueue_script( 'firstmedia-ai-product-edit', plugins_url( '../assets/js/product-edit.js', __FILE__ ), array( 'jquery', 'wp-i18n' ), FIRSTMEDIA_AIFLOW_VER, true );
        wp_enqueue_style( 'firstmedia-ai-product-style', plugins_url( '../assets/css/product.css', __FILE__ ), null, FIRSTMEDIA_AIFLOW_VER );

        wp_localize_script( 'firstmedia-ai-product-edit', 'fmAi', $data );

        $translations = array(
            'generateButton' => __('Generate new description', 'firstmedia-ai-text'),
            'rewriteButton' => __('Rewrite current description', 'firstmedia-ai-text'),
            'optimizeButton' => __('Optimize description for SEO', 'firstmedia-ai-text'),
            'generateWithAI' => __('Generate Description with AI', 'firstmedia-ai-text'),
            'readyForAI' => __('Are you ready to take the leap to AI?', 'firstmedia-ai-text'),
            'connectToAI' => __('Connect to our AI', 'firstmedia-ai-text'),
            'manuallyEnter' => __('Manually enter Description', 'firstmedia-ai-text'),
            'errorProcessingRequest' => __('An error occured when processing your request on the AI', 'firstmedia-ai-text'),
            'noCreditsRemaining' => __('You have no credits remaining. Please purchase description credits first.', 'firstmedia-ai-text'),
            'purchaseNow' => __('Purchase now', 'firstmedia-ai-text'),
            'youHaveOnly' => __('You have only', 'firstmedia-ai-text'),
            'tokensRemaining' => __('tokens remaining. We recommend a higher amount.', 'firstmedia-ai-text'),
            'purchaseMoreTokens' => __('Purchase more tokens', 'firstmedia-ai-text'),
            'continueAnyway' => __('Continue anyway', 'firstmedia-ai-text'),
            'authorizationInvalid' => __('Your authorization seems to be invalid.', 'firstmedia-ai-text'),
            'connectAgain' => __('Connect to AI again', 'firstmedia-ai-text'),
            'enterTitleFirst' => __('Please enter a title first.', 'firstmedia-ai-text'),
            'writeUniqueDescriptionPrompt' => __('Write a long, unique product description for this product:', 'firstmedia-ai-text'),
            'chooseTextTone' => __('Choose text tone:', 'firstmedia-ai-text'),
            'doesNotMatter' => __('Does not matter', 'firstmedia-ai-text'),
            'warmer' => __('Warmer', 'firstmedia-ai-text'),
            'professional' => __('Professional', 'firstmedia-ai-text'),
            'formal' => __('Formal', 'firstmedia-ai-text'),
            'expressive' => __('Expressive', 'firstmedia-ai-text'),
            'excited' => __('Excited', 'firstmedia-ai-text'),
            'inspirational' => __('Inspirational', 'firstmedia-ai-text'),
            'close' => __('Close', 'firstmedia-ai-text'),
            'rewriteDescription' => __('Rewrite this description so it is unique:', 'firstmedia-ai-text'),
            'rewriteTextInA' => __('Rewrite this unique text in a', 'firstmedia-ai-text'),
            'tone' => __('tone', 'firstmedia-ai-text'),
            'optimizeWithKeywords' => __('Optimize with these keyswords in mind:', 'firstmedia-ai-text'),
            'keywords' => __('keyword1, keyword2, keyword3', 'firstmedia-ai-text'),
            'optimizeForSeo' => __('Optimize this product description for seo:', 'firstmedia-ai-text'),
            'optimizeForSeoWithKeywords' => __('Optimize this description for seo and use the keywords', 'firstmedia-ai-text'),
            'subcriptiondoesNotIncludeAction' => __('Your subscription does not include this action.', 'firstmedia-ai-text'),
            'upgrade' => __('Upgrade now', 'firstmedia-ai-text'),
            'optimizeForSeoButton' => __('Optimize for SEO', 'firstmedia-ai-text'),
        );
        wp_localize_script( 'firstmedia-ai-product-edit', 'fmText', $translations );
    }
    
    global $pagenow;
    if ( $pagenow == 'admin.php' && substr( $_GET['page'], 0, 13 ) === 'firstmedia-ai' ) {
        wp_enqueue_style( 'firstmedia-ai-style');
        wp_enqueue_script( 'firstmedia-ai-settings-page', plugins_url( '../assets/js/settings-page.js', __FILE__ ), array( 'jquery', 'wp-i18n' ), FIRSTMEDIA_AIFLOW_VER, true );
        wp_enqueue_style( 'firstmedia-ai-pages-style', plugins_url( '../assets/css/pages.css', __FILE__ ), null, FIRSTMEDIA_AIFLOW_VER );
        
        wp_localize_script( 'firstmedia-ai-settings-page', 'fmAi', $data );
        wp_set_script_translations('firstmedia-ai-settings-page', 'firstmedia-ai-text', plugin_dir_path(__FILE__) . 'languages');
    }
} );


/** Settings Link in Plugion Page */
if ( is_admin() ) {
    add_filter(
        'plugin_action_links_' . FIRSTMEDIA_AIFLOW_PLUGIN_BASEFILE, 
        function( $links ) {
            $settings_link = '<a href="admin.php?page=firstmedia-ai-options">' . __( 'Settings', 'firstmedia-ai-text' ) . '</a>';
            array_unshift( $links, $settings_link );
            return $links;
        },
        10, 4
    );
}