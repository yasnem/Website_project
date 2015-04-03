<?php get_header(); 
global $stylesheet_dir;
?>
<?php
    if(have_posts()) :
       the_post();?>
                    
			<div class="container" style="background-image: url('<?php header_image(); ?>');background-size: 100%;background-repeat: no-repeat;background-color: #7C7052; " role="main">
				<div class="transbox">                   
                    <?php the_content(); ?>
				</div>
			</div>

<?php 
else : 
    echo  '<p> No content found</p>';
endif;

get_footer(); ?>