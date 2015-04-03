<?php global $stylesheet_dir;

// Custom query to retrieve the last post in the blog page
$custom_query_args = array(
	'post_type'  => 'post',
);

// new query with custom arguments
$custom_query = new WP_Query( $custom_query_args );

// Index query arguments
$index_query_args = array (
	'page_id'  => '79',
);

// Custom query to retrieve the content of the index page
$index_query_args = new WP_Query( $index_query_args );

?>
<div id="footer" style="min-height:250px;">
				
				<div class="flex-item" style="margin-right: 1.25rem;">
					<strong>ADDRESS</strong>
					<br>
					<br>
					<?php
					echo wpautop(get_theme_mod('larajade_address'));
					?>
					<br>
					<br>
					<?php echo get_theme_mod('larajade_fax'); ?>
					<br>
					<br>
					<img width="35%" src="<?php echoPicture($stylesheet_dir,'images/qcode.png');?> " align="left">
				</div>
				
				<div class="flex-item" style="margin-right: 1.25rem;">
                <?php
                if($index_query_args->have_posts()) : 
                    $index_query_args->the_post();
                ?>
					<strong>About Me</strong>
					<br><br>
					<?php the_excerpt(); ?>
                    <a class="link" href="<?php the_permalink(); ?>"><strong>More ...</strong></a>   
					<br><br>
					<strong>Follow me:</strong>
					<br>
					<br>
					<img src="<?php echoPicture($stylesheet_dir,'images/twitter.png');?>" width="15%">
					<img src="<?php echoPicture($stylesheet_dir,'images/linkedin.png');?>" width="15%">
					<img src="<?php echoPicture($stylesheet_dir,'images/pinterest.png');?>" width="15%">
					<img src="<?php echoPicture($stylesheet_dir,'images/facebook.png');?>" width="15%">
					<img src="<?php echoPicture($stylesheet_dir,'images/google_plus.png');?>" width="15%">
				<?php 
                    else : echo  '<p> No content found</p>';
                    endif;
                 ?>
                </div>
                
                <div class="flex-item" style="margin-right: 1.25rem;">
                <?php
                if($custom_query->have_posts()) : 
                    $custom_query->the_post();
                ?>
				<strong><?php the_title();?></strong>
					</br>
                    </br>
                    <?php the_excerpt(); ?>
                    <a class="link" href="<?php the_permalink(); ?>"><strong>More ...</strong></a>
				
                <?php //endwhile;
                        else : echo  '<p> No content found</p>';
                    endif;
                 ?>
				</div>
				<div class="flex-item">
					<strong>Last Project</strong>
					<br>
					</br>
					Freelance WebSite
					<br>
					<br>
					<img width="80%" src="<?php echoPicture($stylesheet_dir,'images/portfolio/p1.jpg');?>" >
				</div>
                
				<!-- </div> -->
			</div>
		</div>
	<?php
	wp_footer();
	?>
	</body>
</html>