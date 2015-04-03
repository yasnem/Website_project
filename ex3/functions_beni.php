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


add_action( 'customize_register', 'larajade_customize_register' );
function larajade_customize_register( $wp_customize ) {
	
	/* body background color */
	$wp_customize->add_setting( 'larajade_bodybgcolor', array(
		'default' => '#474d51',
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
		'default' => '#414141',
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
?>