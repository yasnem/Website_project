<?php 
    global $stylesheet_dir, $stylesheet_url;
    $mail_sent = FALSE;
    get_header();
    	if (isset($_POST['submit']))
	{
		$first_name = $_POST['firstname'];
		$last_name = $_POST['lastname'];
		$mail_text = $_POST['message'];
		
		$mail_sent = wp_mail(get_option('admin_email'), "Message from ".$first_name." ".$last_name, $mail_text);
	};
?>
				<div class="container" style="background-image: url('<?php echoPicture($stylesheet_dir,'images/bg4.png');?>');background-size: 100%;background-repeat: no-repeat;background-color: #040205; min-height: 500px;" role="main">
				
					<div style="width:100%">
						<br><br>
						<p style="font-size: 340%; color:#fff;">
							<strong>Contact Me</strong>
						</p>
					</div>
					<br><br><br><br><br><br><br><br><br><br><br>

					<div style="float:left;overflow: hidden;vertical-align: bottom;">
						<form method="post" action="<?php echo the_permalink();?>">
							<p style="float:left;">
								First name:
							</p>

							<input type="text" name="firstname" style="float:right; font: 1em arial; color:#000;">
							<br>
							<p style="float:left;">
								Last name:
							</p>

							<input type="text" name="lastname" style="float:right;  font:1em arial; color:#000;">

							<br>
							<textarea type="text" name="message" rows="7" cols="65" style="font:1em arial; color:#000;"></textarea>
							<br>
							<button name="submit" style="background-color:#fafafa; color:#000;padding-left:5px;padding-right:5px;">
								Submit
							</button>
						</form>
						<p style="background: #fff; opacity:0.5; margin-top:5px; font: 1em arial; color:red; display:inline-block">
							<?php if ( $mail_sent){
								echo "Mail has been sent to ".get_option("blogname");
							} ?>
							<br>
						</p>
					</div>
					<br>

					<div class="ctransbox">
						<div class="full">
							<strong style="float:left;">Email</strong><strong style="float:right;"><?php echo get_option('admin_email'); ?></strong>
							<br>
							<strong style="float:left;">Fax</strong><strong style="float:right;"><?php echo get_theme_mod('larajade_fax'); ?></strong>
							<br>
							<strong style="float:left;">Address: </strong><strong style="float:right;"><?php echo str_replace("<br />", ", ", wpautop(get_theme_mod('larajade_address'))); ?></strong>
						</div>
					</div>

				</div>
<?php get_footer();?>