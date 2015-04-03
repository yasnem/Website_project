<?php 
    global $stylesheet_dir, $stylesheet_url;
    get_header();
?>
<div class="container" style="background-image: url('<?php echoPicture($stylesheet_dir,'./images/bg2.png');?> ');background-size: 100%;background-repeat: no-repeat;background-color: #040205; " role="main"><ul class="list">
<?php
if (have_posts()) : while (have_posts()) : the_post(); ?>
	
	<li class="blog_list__item">
				<figure class="blog_list__item__inner">
					<figcaption>
						<strong><?php the_title(); ?></strong><?php the_content(); ?>
						<?php echo list_related_p(); ?>
					</figcaption>
				</figure>
			</li>
			
			<?php 
						$image = wp_get_attachment_image_src( get_post_thumbnail_id( get_the_ID() ), "full" ); 
						if ($image) : ?>
							<li class="blog_list__item">
    						<div class="helper">
    						<img src="<?php echo $image[0]; ?>" alt="" />
    						</div>
    						</li>
						<?php endif;
						?>
<?php endwhile; endif; ?>
</ul></div>
<?php
	
get_footer();
?>