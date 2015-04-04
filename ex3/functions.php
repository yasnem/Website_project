<?php 
add_theme_support('post-thumbnails');

$stylesheet_url = get_bloginfo('stylesheet_url');
$stylesheet_dir = get_bloginfo('stylesheet_directory');
$images_url = get_bloginfo('stylesheet_url').'/images/';

function echoPicture($ssurl, $locurl) {
	echo $ssurl.'/'.$locurl;
}

/************************************************************/
/*                Custom Excerpt length 					*/
/************************************************************/

function custom_excerpt_length() {
    return 55; //Default value
}

add_filter('excerpt_length', 'custom_excerpt_length');

function excerpt($limit) {
      $excerpt = explode(' ', get_the_excerpt(), $limit);
      if (count($excerpt)>=$limit) {
        array_pop($excerpt);
        $excerpt = implode(" ",$excerpt).' [...] ';
      } else {
        $excerpt = implode(" ",$excerpt);
      } 
      //$excerpt = preg_replace('`\[[^\]]*\]`','',$excerpt);
      return $excerpt;
}

/************************************************************/
/*             Custom Post Type Portfolio					*/
/************************************************************/
if( ! function_exists( 'create_portfolio_post_type' ) ) :	
	function create_portfolio_post_type() {
		$labels = array(
			'name'               => _x( 'Portfolio Entries', 'post type general name' ),
			'singular_name'      => _x( 'Portfolio Entry', 'post type singular name' ),
			'add_new'            => _x( 'Add Portfolio Entry', 'book' ),
			'add_new_item'       => __( 'Add New Portfolio Entry' ),
			'edit_item'          => __( 'Edit Portfolio Entry' ),
			'new_item'           => __( 'New Portfolio Entry' ),
	    	'all_items'          => __( 'All Portfolio Entries' ),
	    	'view_item'          => __( 'View Portfolio Entry' ),
	    	'search_items'       => __( 'Search Portfolio Enries' ),
	    	'not_found'          => __( 'No portfolio entries found' ),
	    	'not_found_in_trash' => __( 'No portfolio entries found in trash' ), 
	    	'parent_item_colon'  => '',
	    	'menu_name'          => 'Portfolio'	
   		);
		$args = array(
	 		'labels'        => $labels,
	    	'description'   => 'Portfolio',
	    	'public'        => true,
	    	'menu_position' => 5,
	    	'supports'      => array( 'title', 'editor', 'thumbnail'),
	    	'has_archive'   => true,
	  	);
	  	register_post_type( 'portfolio', $args );
	}	add_action( 'init', 'create_portfolio_post_type' );endif;

add_action( 'add_meta_boxes', 'portfolio_meta_box_add' );
function portfolio_meta_box_add()
{
    add_meta_box( 'portfolio', 'Metabox', 'portfolio_meta_box', 'portfolio', 'normal', 'high' );
}

function portfolio_meta_box() {
	$values = get_post_custom( $post->ID );
	$year = isset( $values['year'] ) ? esc_attr( $values['year'][0] ) : "";
	$url = isset( $values['url'] ) ? esc_attr( $values['url'][0] ) : "";
	
	?>
    <label for="year">Year</label>
    <input type="text" name="year" id="year" size="4" value="<?php echo $year; ?>"/><br/>
    <label for="url">URL</label>
    <input type="text" name="url" id="url" size="50" value="<?php echo $url; ?>"/>
    <?php
}

add_action( 'save_post', 'portfolio_meta_box_save' );
function portfolio_meta_box_save( $post_id )
{
	if( isset( $_POST['year'] ) ) :
        update_post_meta($post_id, 'year', esc_attr($_POST['year']));
    endif;
    if (isset($_POST['url'])) :
    	update_post_meta($post_id, 'url', esc_attr($_POST['url']));
    endif;
}

/************************************************************/
/*                   POSTS TO POSTS 						*/
/************************************************************/
function blog_to_portfolio_connection() {
	p2p_register_connection_type( array(
		'name' => 'portfolio_to_blog',
		'from' => 'post',
		'to' => 'portfolio'
    ) );
}
add_action( 'p2p_init', 'blog_to_portfolio_connection' );

function list_related_p() {
	$output = "";
	// Find connected posts
	$connected = new WP_Query( array(
		'connected_type' => 'portfolio_to_blog',
		'connected_items' => get_queried_object(),
		'nopaging' => true,
	));

	// Display connected posts
	if ( $connected->have_posts() ) :
		$output .= "<br/>";
		if (get_post_type() == "post") :
			$output .= "<h3>Related portfolio entries</h3>";
		else :
			$output .= "<h3>Related blog entries</h3>";
		endif;
		$output .= "<ul>";
		while ( $connected->have_posts() ) :
			$connected->the_post();
		    $output .= "<li><a class=\"link\" href=\"".get_the_permalink()."\">".get_the_title()."</a></li>";
		endwhile;
		$output .= "</ul>";
	endif;
	wp_reset_postdata();
	return $output;
}

/************************************************************/
/*                  FUNCTION FILES  						*/
/************************************************************/
include_once "functions_beni.php";
?>