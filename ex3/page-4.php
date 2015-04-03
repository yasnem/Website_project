<?php 
    global $stylesheet_dir, $stylesheet_url;
    get_header();
?>
				<div class="container" style="background-image: url('<?php echoPicture($stylesheet_dir,'./images/bg2.png');?> ');background-size: 100%;background-repeat: no-repeat;background-color: #040205; " role="main">
<?php

$custom_query_args = array(
	"posts_per_page" => 4,
	"order" => "DESC",
	);
$custom_query_args["paged"] = get_query_var("paged") ? get_query_var("paged") : 1;

// new query with custom arguments
$custom_query = new WP_Query( $custom_query_args );

// hack
$temp_query = $wp_query;
$wp_query   = NULL;
$wp_query   = $custom_query;

if ( $custom_query->have_posts() ) : ?>
		<ul class="list">
<?php while ( $custom_query->have_posts() ) :

			$custom_query->the_post() ;
			?><li class="blog_list__item">
				<figure class="blog_list__item__inner">
					<figcaption>
						<?php 
						$image = wp_get_attachment_image_src( get_post_thumbnail_id( get_the_ID() ), "full" ); 
						if ($image) : ?>
    						<a href="<?php the_permalink(); ?>"><img src="<?php echo $image[0]; ?>" alt="" /></a>
						<?php endif; ?> 		
						<strong><?php the_title(); ?></strong><?php the_excerpt(); ?>
						<a class="link" href="<?php the_permalink(); ?>">more ...</a>
					</figcaption>
				</figure>
			</li>
			<?php
	endwhile; ?>
</ul>
<?php

// Reset postdata
wp_reset_postdata();

?>
<div class="posts">
<div class="left"><?php previous_posts_link("Newer Posts"); ?></div>
<div class="right"><?php next_posts_link("Older Posts", $custom_query->max_num_pages); ?></div>
</div>
<?php
$wp_query = NULL;
$wp_query = $temp_query;
endif;
?>
</div>
<?php

get_footer();
?>