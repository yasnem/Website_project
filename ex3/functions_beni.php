<?php
/*	==================================================
	supporting custom background-image & custom header image
	================================================== */

/* custom header image */
add_theme_support("custom-header", array(
	'default-image' => get_template_directory_uri().'/images/bg1.png', 
	'default-repeat' => 'no-repeat',
	'default-position-x' => 'center',
	'flex-width' => true,
	'width' => 1024,
	'flex-height' => true,
	'height' => 523
	));

function larajade_customize_register( $wp_customize ) {
	
	/* remove header text color */
	$wp_customize->remove_control('header_textcolor');
	
	/* body background color */
	$wp_customize->add_setting( 'larajade_bodybgcolor', array(
		'default' => '#414141',
		'type' => 'option',
		'capability' => 'edit_theme_options'
		)
	);
	$wp_customize->add_control( new WP_Customize_Color_Control(
		$wp_customize,
		'larajade_bodybgcolor',
		array(
			'label' => __('Body Background Color', 'LaraJade'),
			'section' => 'colors',
			'settings' => 'larajade_bodybgcolor'
			)
		)
	);
	
	/* main background color */
	$wp_customize->add_setting( 'larajade_bgcolor', array(
		'default' => '#000000',
		'type' => 'option',
		'capability' => 'edit_theme_options'
		)
	);
	$wp_customize->add_control( new WP_Customize_Color_Control(
		$wp_customize,
		'larajade_bgcolor',
		array(
			'label' => __('Main Background Color', 'LaraJade'),
			'section' => 'colors',
			'settings' => 'larajade_bgcolor'
			)
		)
	);
	
	/* border color */
	$wp_customize->add_setting( 'larajade_bordercolor', array(
		'default' => '#dddddd',
		'type' => 'option',
		'capability' => 'edit_theme_options'
		)
	);
	$wp_customize->add_control( new WP_Customize_Color_Control(
		$wp_customize,
		'larajade_bordercolor',
		array(
			'label' => __('Border Color', 'LaraJade'),
			'section' => 'colors',
			'settings' => 'larajade_bordercolor'
			)
		)
	);
	
	/* footer background color */
	$wp_customize->add_setting( 'larajade_footerbgcolor', array(
		'default' => '#027d8d',
		'type' => 'option',
		'capability' => 'edit_theme_options'
		)
	);
	$wp_customize->add_control( new WP_Customize_Color_Control(
		$wp_customize,
		'larajade_footerbgcolor',
		array(
			'label' => __('Footer Background Color', 'LaraJade'),
			'section' => 'colors',
			'settings' => 'larajade_footerbgcolor'
			)
		)
	);
	
	/* header text color */
	$wp_customize->add_setting( 'larajade_headercolor', array(
		'default' => '#000000',
		'type' => 'option',
		'capability' => 'edit_theme_options'
		)
	);
	$wp_customize->add_control( new WP_Customize_Color_Control(
		$wp_customize,
		'larajade_headercolor',
		array(
			'label' => __('Header Text Color', 'LaraJade'),
			'section' => 'colors',
			'settings' => 'larajade_headercolor'
			)
		)
	);
	
	/* contact data section */
	$wp_customize->add_section( 'larajade_contact', array(
		'title' => __('Contact Data', 'LaraJade'),
		'priority' => 60
		)
	);
	
	/* address */
	$wp_customize->add_setting( 'larajade_address', array(
		'default' => '',
		'section' => 'larajade_contact',
		'capability' => 'edit_theme_options',
		)
	);
	$wp_customize->add_control( new WP_Customize_Control(
		$wp_customize,
		'larajade_address',
		array(
			'label' => __('Address', 'LaraJade'),
			'section' => 'larajade_contact',
			'settings' => 'larajade_address',
			'type' => 'textarea'
			)
		)
	);
	
	/* fax */
	$wp_customize->add_setting( 'larajade_fax', array(
		'default' => '',
		'section' => 'larajade_contact',
		'capability' => 'edit_theme_options'
		)
	);
	$wp_customize->add_control( new WP_Customize_Control(
		$wp_customize,
		'larajade_contact',
		array(
			'label' => __('Fax', 'LaraJade'),
			'section' => 'larajade_contact',
			'settings' => 'larajade_fax',
			'type' => 'text'
			)
		)
	);
}
add_action( 'customize_register', 'larajade_customize_register' );

function larajade_customize_css() {
	echo "\n<style type=\"text/css\">\n";
	echo "body, #header, .container {background-color: ".get_option('larajade_bodybgcolor')."; }\n";
	echo "#header #header-left, #main-inner {background-color: ".get_option('larajade_bordercolor')."; }\n";
	echo "h1 {color: ".get_option('larajade_headercolor')."; }\n";
	echo "#footer {background-color: ".get_option('larajade_footerbgcolor')."; }\n";
	echo "</style>\n";
}
?>