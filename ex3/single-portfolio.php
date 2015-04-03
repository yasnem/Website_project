<?php 
    global $stylesheet_dir, $stylesheet_url;
    get_header();
?>
<div class="container" style="background-image: url('<?php echoPicture($stylesheet_dir,'./images/bg3.png');?> ');background-size: 100%;background-repeat: no-repeat;background-color: #040205; " role="main"><ul class="list">
<?php
if (have_posts()) : while (have_posts()) : the_post(); ?>
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
	
	<li class="blog_list__item">
				<figure class="blog_list__item__inner">
					<figcaption>
						<?php
						$year = get_post_meta(get_the_ID(),'year',true);
						$url = get_post_meta(get_the_ID(),'url',true);
						?> 		
						<strong><?php the_title(); ?></strong><br />
						<?php echo $year; ?>, <a class="link" target="_blank" href="http://<?php echo $url; ?>"><?php echo $url;?></a><br />
						<?php the_content(); ?>
						<?php echo list_related_p(); ?>
					</figcaption>
				</figure>
			</li>
<?php endwhile; endif; ?>
</ul></div>
<?php
	
get_footer();
?>