<?php 
    global $stylesheet_dir, $stylesheet_url;
    get_header();
?>
<div class="container" style="background-image: url('<?php echoPicture($stylesheet_dir,'./images/bg2.png');?> ');background-size: 100%;background-repeat: no-repeat;background-color: #040205; " role="main"><ul class="list">
<?php
if (have_posts()) : while (have_posts()) : the_post(); ?>
	
	<li class="blog_list__item">
        
				<figure id ="full_post" class="blog_list__item__inner">
					<figcaption id = "post">
						<strong><div id="post_title" contenteditable ="false"><?php the_title(); ?></div></strong>
                        <div id="post_content" contenteditable ="false"><?php the_content(); ?></div>
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

</ul>
</div>


<?php if(current_user_can('edit_posts')) : ?>
<!-- This part is displayed only if the user has administration privileges-->

<form id= "post_update" method="post">
    <button id="edit_post" class="primary" type ="button">Edit post</button>
    <ul>
        <button class="text_custom" type = "button" onclick="SetToBold();"><strong>B</strong></button>
        <button class="text_custom" type = "button" onclick="SetToItalic();"><i>I</i></button>
        <button class="text_custom underline" type = "button" onclick="SetToUnderline();">U</button>
    </ul>
    <input type="file" name="fileToUpload" id="fileToUpload">
    <button id ="submit_post" class ="success" type ="button" value="<?php the_ID(); ?>">Submit</button>
</form>

<p id ="confirmation_bar">

</p>

<!-- End admin part-->
<?php 
    else : // echo '<h1>Not admin</h1>';
    endif;?>


<?php endwhile; endif; ?> <!-- End loop -->
<?php
	
get_footer();
?>