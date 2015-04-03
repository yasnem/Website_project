<?php 
    get_header();
    global $stylesheet_dir;
?>
				<div class="container" style="background-image: url('./images/bg3.png');background-size: 100%;background-repeat: no-repeat;background-color: #040205; " role="main">

					<ul class="list">
					<?php
					$custom_query = new WP_Query("post_type=portfolio");
					
					if ($custom_query->have_posts()):
						while ($custom_query->have_posts() ) :
							$custom_query->the_post();
							?>
							
							<li class="list__item">
							
								<figure class="list__item__inner">
								<?php
								$image = wp_get_attachment_image_src( get_post_thumbnail_id( get_the_ID() ), "full" ); 
								if ($image) : ?>
    								<a href="<?php the_permalink(); ?>"><img src="<?php echo $image[0]; ?>" alt="" /></a>
								<?php endif; ?>
								<figcaption>
								<a href="<?php the_permalink(); ?>" class="titlelink">
									<strong><?php the_title(); ?></strong>
								</a>
									<br><?php echo get_post_meta(get_the_ID(),'year',true); ?>
								</figcaption>
								</figure>
							</li>
							<?php
						endwhile;
					endif;
					?>
		</ul></div>
												
<?php
    get_footer();
?>