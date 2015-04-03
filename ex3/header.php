<?php 
    global $stylesheet_dir, $stylesheet_url;
?>
<!DOCTYPE html>
<html lang="en" class="">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta charset="utf-8">
		<title><?php echo get_bloginfo('sitename'); ?></title>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
		<script src="http://code.jquery.com/ui/1.11.3/jquery-ui.js"></script>
        <?php wp_head();?>
		<link rel="stylesheet" href="<?php echo $stylesheet_url; ?>">
	</head>
	<script>
		$(document).ready(function() {

			$(window).resize(function() {
				//$("#log").append("<div>Handler for .resize() called.</div>");
				if ($(window).width() <= 640) {
					$("#innerMenu").hide("slow");
				}
			});

		$(".iMenu2").dblclick(function() {
				$("#innerMenu").toggle("slow");

			});

			$("#menu #innerMenu span img").click(function() {
				if ($(this).attr("src") == '<?php echoPicture($stylesheet_dir,"images/sticky_icon_on.png");?>') {
					var src = $(this).attr("src").replace("sticky_icon_on.png", "sticky_icon_off.png");
					$(this).attr("src", src);
				} else {
					var src = $(this).attr("src").replace("sticky_icon_off.png", "sticky_icon_on.png");
					$(this).attr("src", src);
				}

			});

			$("#menu").css('opacity', '0.2');
			$("#menu").draggable();
			// $("#menu").css('opacity','0.2');

			$("#menu").hover(function() {
				$("#menu").stop().animate({
					opacity : 1
				});
			}, function() {

				$("#menu").stop().animate({
					opacity : 0.2
				}, 350, "linear", function() {

					if ($("#menu div span img").attr("src") == '<?php echoPicture($stylesheet_dir,"images/sticky_icon_on.png");?>') {

						var halfWidth = $(window).width() / 2;
						var halfHeight = $(window).height() / 2;

						var pLeft = $(this).position().left;

						var pRight = $(window).width() - pLeft - ($("#menu").width() + 50);
						var pTop = $(this).position().top;
						var pBottom = $(window).height() - pTop - ($("#menu").height() + 50);
						// alert(pRight + "-" + pTop + "-" + pBottom);

						if (pRight < pLeft) {
							if ((pRight <= pTop) & (pRight <= pBottom)) {
								newPost = $(window).width() - $(this).width() - 50;
								$(this).animate({
									left : newPost
									// top : "0px"
								});
							} else if (pTop < pBottom) {
								$(this).animate({
									top : "0px"
								});

							} else {
								newPost = $(window).height() - $(this).height() - 50;
								$(this).animate({
									top : newPost
								});
							}
						} else {

							if ((pLeft <= pTop) & (pLeft <= pBottom)) {

								$(this).animate({

									left : "0px"
								});
							} else if (pTop < pBottom) {
								$(this).animate({
									top : "0px"
								});

							} else {
								newPost = $(window).height() - $(this).height() - 50;
								$(this).animate({
									top : newPost
								});
							}

						}
						var objPos = ($(window).width()) / $(this).position().left;

						/*
						 switch(($(window).width()) / $(this).position().left ) {
						 case (val < 0):
						 alert(val);
						 // code block
						 break;
						 case 1:
						 // code block
						 break;
						 default:
						 // default code block
						 }					*/
					}
				});

			});

			/*
			 $("#menu").mouseover(function() {
			 $("#menu").stop().animate({
			 opacity : 1
			 });
			 }).mouseout(function() {
			 $("#menu").animate({
			 opacity : 0.2

			 })
			 });*/

		});

	</script>
	<body data-twttr-rendered="true">

		<div id="menu">
			<span class="iMenu"><img src="<?php echoPicture($stylesheet_dir,'images/menu2.png');?>" class="iMenu2"></span>
			<div id="innerMenu">
				<span class="iToggle"><img src="<?php echoPicture($stylesheet_dir,'images/sticky_icon_on.png');?>" class="innerToggle"></span>

				<ui class="menu_list">
					<li class="menu_list__item">
						<a href="index.php"><img src="<?php echoPicture($stylesheet_dir,'images/mm1.png'); ?>" class="shake"></a>
					</li>
					<li class="menu_list__item">
                        <a href="?page_id=4"><img src="<?php echoPicture($stylesheet_dir,'images/mm2.png');?>" class="shake"></a>
					</li>
					<li class="menu_list__item">
                        <a href="?page_id=6">
                            <img src="<?php echoPicture($stylesheet_dir,'images/mm3.png');?>" class="shake">
                        </a>
					</li>
					<li class="menu_list__item">
                        <a href="?page_id=8">
                            <img src="<?php echoPicture($stylesheet_dir,'images/mm4.png');?>" class="shake">
                        </a>
					</li>

				</ui>
			</div>
		</div>

		<div id="main-inner">
			<div id="header">
				<div id="header-left">
					<h1><?php echo get_bloginfo('sitename'); ?></h1>

				</div>
	
			</div>