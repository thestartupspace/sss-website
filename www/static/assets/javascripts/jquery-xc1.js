(function($) {
	/* Vars */
	var vars = {
		height:	$(window).height(),
		width: $('body').innerWidth(),
		easing: 'easeOutExpo',
		random: 0,
		scroll:	{
			new : 0,
			old : 0
		}
	};
	var xc1 = {	
		layout:	xc1_layout(),
		retina:	xc1_retina(),
		random:	xc1_random(),
		domain: xc1_domain(),
		banner: {},
		calendar: {},
		page: {
			header: $('#container > header'),
			footer: $('#container > footer'),
			current: $('#container').find('.main')
		}
	};
	
	/* Some things look different from different POV's */
	onResize = function() {
		vars.height = $(window).height();
		vars.width = $('body').innerWidth();
	}
	$(window).bind('resize', onResize);

	/* Some things just gotta move when you move */
	onScroll = function() {
		vars.scroll.new = $(window).scrollTop();	
		if(xc1_layout() == 'desktop') {
			if(vars.scroll.new > vars.scroll.old && vars.scroll.new > 250) {
				xc1.page.header.css({'margin-top' : '-100px'});
			} else {
				xc1.page.header.css({'margin-top' : '0px'});
			}
		}
		vars.scroll.old = vars.scroll.new;
	 }
	$(window).bind('scroll', onScroll);

	/* Some things we gotta do when we are packed and loaded */
	onLoad = function() { 
		xc1_banners();
	}
	$(window).bind('load', onLoad);

	/* Lets do the rest when we are ready */	
	$(document).ready(function(){
		xc1_base();
		xc1_init();
	});

	/* Welcome to our functions */
	function xc1_base() {
				
		//Triggers
		//xc1.page.header.find('a[href^="http://' + xc1.domain + '"], a[href^="/"]').on('click', xc1_load);
		//xc1.page.footer.find('a[href^="http://' + xc1.domain + '"], a[href^="/"]').on('click', xc1_load);

		$('#mobile-menu-trigger').on('click', function() {
			$('body').toggleClass('mobile-menu-active');
		});
	}
	
	function xc1_init() {
		
		FastClick.attach(document.body); // Fastclick
		
		xc1_images();
		xc1_video();

		//xc1_instagram();
		xc1_slider();
		xc1_twitter();

		xc1_triggers();

		if($('body').hasClass('single')) { 
			//xc1_disqus();
			xc1_addthis(); 
		}
		if($('body').hasClass('page-archives') || $('body').hasClass('archive')) { 
			xc1_calendar(); 
		}
		
		
	}
	
	function xc1_triggers() {
		xc1.page.current.find('li.nav-filter a').on('click', xc1_filter);
		xc1.page.current.find('a[href^="#"]').on('click', xc1_hash);
		//xc1.page.current.find('a[href^="http://' + xc1.domain + '"], a[href^="/"]').on('click', xc1_load);
		
		xc1.page.current.find('.job-more-info').on('click', function() {
			$(this).closest('.list-item-job').find('.job-info').slideToggle();
		});
	}
	
	function xc1_hash() {
		if($(this).attr('href') != '#') {
			var offset = $($(this).attr('href')).offset();
			$('html, body').animate({ scrollTop: Math.round(offset.top-70) }, 1000, vars.easing);
			return false;
		}
	}
	
	function xc1_filter() {
		$('.section-filter-block').hide();
		$($(this).attr('href')).slideDown();
		return false;
	}
	
	function xc1_load() {
		//if (e.isDefaultPrevented() || e.metaKey || e.ctrlKey) { return; }
		xc1.page.url = $(this).attr('href');
		if(xc1.page.url == '/') { xc1.page.url = document.domain }
		
		$('li').removeClass('current-menu-item');
		$(this).parent().addClass('current-menu-item');
		
		xc1.page.current.fadeTo(250, 0);
					
		$.ajax(xc1.page.url)
		.done(function(data) {
							
			xc1.page.title = data.match(/<title>(.*?)<\/title>/);
			xc1.page.bodyclass = data.match(/<body class="(.*?)">/);
			xc1.page.new = $(data).find('.main');
			
			try { 
				window.history.pushState('', xc1.page.title[1], xc1.page.url);
				$('title').html(xc1.page.title[1]);
				$('body').attr('class', xc1.page.bodyclass[1]);
				$('body, html').animate({ scrollTop: 0 }, 1000, vars.easing);
				xc1.page.current.after(xc1.page.new);
				xc1.page.current.slideUp(500);
				setTimeout(function() { 
					xc1.page.current.remove();
					xc1.page.current = xc1.page.new;
					xc1_init();
				}, 1000);
			} catch(err) {
				window.location(xc1.page.url);
			}
		})
		.fail(function(data) { window.location(xc1.page.url); })
		.always(function(data) {});	
		return false;
	}
		
	function xc1_video() {
		$('.entry iframe[src^="http://www.youtube.com"], .entry iframe[src^="http://player.vimeo.com"]').each(function() {
			$(this).wrap('<div class="video" />');
		});
	}
	

	
	function xc1_twitter() {
		!function(d,s,id){ 
			var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
			if(!d.getElementById(id)){
				js=d.createElement(s);
				js.id=id;js.src=p+"://platform.twitter.com/widgets.js";
				fjs.parentNode.insertBefore(js,fjs);
			}
		}(document,"script","twitter-wjs");
	}
	
	function xc1_disqus() {
	
	    var disqus_shortname = 'swedishstartupspace'; // Required - Replace example with your forum shortname
	    var disqus_identifier = xc1.page.title;
	    var disqus_title = xc1.page.title;
	    var disqus_url = xc1.page.url;
	
	    /* * * DON'T EDIT BELOW THIS LINE * * */
	    (function() {
	        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
	        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
	        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
	    })();
	
		/*
		DISQUS.reset({
			reload: true,
			config: function () {  
				this.page.identifier = xc1.page.title;  
				this.page.url = xc1.page.url;
			}
		});
		*/
	}
	
	function xc1_addthis() {
		if (window.addthis) {
			window.addthis = null;
			window._adr = null;
			window._atc = null;
			window._atd = null;
			window._ate = null;
			window._atr = null;
			window._atw = null;
		}
		$.getScript('http://s7.addthis.com/js/300/addthis_widget.js#pubid=sdive');
	}

	function xc1_images() {
		$('.xc1-thumbnail').each(function() {
			if(xc1.retina && $(this).data('retina') != '') {
				$(this).attr('src', $(this).data('retina'));
			} else if($(this).data('normal') != '') {
				$(this).attr('src', $(this).data('normal'));
			}
		});
	}

	function xc1_viewport() {
		if(vars.width <= '480') {
			$('#viewport').attr('content', 'user-scalable=yes, width=480');
		} else {
			$('#viewport').attr('content', 'user-scalable=yes, width=device-width');		
		}
	}

	function xc1_slider() {
		$('.slider').flexslider({		
			namespace: "slider-",           //{NEW} String: Prefix string attached to the class of every element generated by the plugin
			selector: ".slides > li",       //{NEW} Selector: Must match a simple pattern. '{container} > {slide}' -- Ignore pattern at your own peril
			animation: "slide",             //String: Select your animation type, "fade" or "slide"
			easing: "swing",                //{NEW} String: Determines the easing method used in jQuery transitions. jQuery easing plugin is supported!
			direction: "horizontal",        //String: Select the sliding direction, "horizontal" or "vertical"
			reverse: false,                 //{NEW} Boolean: Reverse the animation direction
			animationLoop: true,            //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
			smoothHeight: false,            //{NEW} Boolean: Allow height of the slider to animate smoothly in horizontal mode 
			startAt: 0,                     //Integer: The slide that the slider should start on. Array notation (0 = first slide)
			slideshow: true,                //Boolean: Animate slider automatically
			slideshowSpeed: 7000,           //Integer: Set the speed of the slideshow cycling, in milliseconds
			animationSpeed: 600,            //Integer: Set the speed of animations, in milliseconds
			initDelay: 0,                   //{NEW} Integer: Set an initialization delay, in milliseconds
			randomize: false,               //Boolean: Randomize slide order
			 
			// Usability features
			pauseOnAction: true,            //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
			pauseOnHover: false,            //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
			useCSS: true,                   //{NEW} Boolean: Slider will use CSS3 transitions if available
			touch: true,                    //{NEW} Boolean: Allow touch swipe navigation of the slider on touch-enabled devices
			video: false,                   //{NEW} Boolean: If using video in the slider, will prevent CSS3 3D Transforms to avoid graphical glitches
			 
			// Primary Controls
			controlNav: true,               //Boolean: Create navigation for paging control of each clide? Note: Leave true for manualControls usage
			directionNav: true,             //Boolean: Create navigation for previous/next navigation? (true/false)
			prevText: "Previous",           //String: Set the text for the "previous" directionNav item
			nextText: "Next",               //String: Set the text for the "next" directionNav item
			 
			// Secondary Navigation
			keyboard: true,                 //Boolean: Allow slider navigating via keyboard left/right keys
			multipleKeyboard: false,        //{NEW} Boolean: Allow keyboard navigation to affect multiple sliders. Default behavior cuts out keyboard navigation with more than one slider present.
			mousewheel: false,              //{UPDATED} Boolean: Requires jquery.mousewheel.js (https://github.com/brandonaaron/jquery-mousewheel) - Allows slider navigating via mousewheel
			pausePlay: false,               //Boolean: Create pause/play dynamic element
			pauseText: 'Pause',             //String: Set the text for the "pause" pausePlay item
			playText: 'Play',               //String: Set the text for the "play" pausePlay item
			 
			// Special properties
			controlsContainer: "",          //{UPDATED} Selector: USE CLASS SELECTOR. Declare which container the navigation elements should be appended too. Default container is the FlexSlider element. Example use would be ".flexslider-container". Property is ignored if given element is not found.
			manualControls: "",             //Selector: Declare custom control navigation. Examples would be ".flex-control-nav li" or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.
			sync: "",                       //{NEW} Selector: Mirror the actions performed on this slider with another slider. Use with care.
			asNavFor: "",                   //{NEW} Selector: Internal property exposed for turning the slider into a thumbnail navigation for another slider
			 
			// Carousel Options
			itemWidth: 0,                   //{NEW} Integer: Box-model width of individual carousel items, including horizontal borders and padding.
			itemMargin: 0,                  //{NEW} Integer: Margin between carousel items.
			minItems: 0,                    //{NEW} Integer: Minimum number of carousel items that should be visible. Items will resize fluidly when below this.
			maxItems: 0,                    //{NEW} Integer: Maxmimum number of carousel items that should be visible. Items will resize fluidly when above this limit.
			move: 0,                        //{NEW} Integer: Number of carousel items that should move on animation. If 0, slider will move all visible items.
			                                 
			// Callback API
			start: function(slider){
				$('.slide-copy-' + slider.animatingTo).addClass('slide-copy-active');
			},            					//Callback: function(slider) - Fires when the slider loads the first slide
			before: function(slider){
				$('.slide-copy').removeClass('slide-copy-active');
				$('.slide-copy-' + slider.animatingTo).addClass('slide-copy-active');
			},           					//Callback: function(slider) - Fires asynchronously with each slider animation
			after: function(){},            //Callback: function(slider) - Fires after each slider animation completes
			end: function(){},              //Callback: function(slider) - Fires when the slider reaches the last slide (asynchronous)
			added: function(){},            //{NEW} Callback: function(slider) - Fires after a slide is added
			removed: function(){}           //{NEW} Callback: function(slider) - Fires after a slide is removed	
		});
	}

	
	function xc1_parsedate(input) {
	  var parts = input.match(/(\d+)/g);
	  return new Date(parts[0], parts[1]-1, parts[2]); // parse a date in yyyy-mm-dd format
	}

	function xc1_calendar_show(date) {
		xc1.calendar.daylist = false;
		xc1.calendar.dayname = xc1_parsedate(date);
		xc1.calendar.monthname = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
		
		
		$('.post').fadeOut();
		$('.post-date').each(function(index) {
			if($(this).text() == date) {
				$(this).closest('.post').delay(500).fadeIn();
				xc1.calendar.daylist = true;
			}

			if(($('.post-date').length-1) == index) {
				$('.section-date h3.filtertitle span').html(' ' + xc1.calendar.monthname[xc1.calendar.dayname.getMonth()] + ' ' + xc1.calendar.dayname.getDate());
				$('.section-date h3.filtertitle').fadeIn();
				var offset = $('.section-date h3.filtertitle').offset();
				$('body, html').animate({ scrollTop: Math.round(offset.top-70) }, 1000, vars.easing);
				//return false;
				if(xc1.calendar.daylist == false) {
					//$('.puff-upcoming-list-item-empty').delay(500).fadeIn();
				}
			}
			
		});
		
	}

	function xc1_calendar() {
		
		var date = new Date();
		function addZero(no) {
			if (no < 10) {
				return "0" + no;
			} else {
				return no;
			}
		}
			
		xc1.calendar.today = [
			addZero(date.getFullYear()),
			addZero(date.getMonth() + 1),
			addZero(date.getDate())
		].join('-');
		
		xc1.calendar.days[xc1.calendar.today] = 1;
		
		$('.post-date').each(function() {
			xc1.calendar.days[($(this).text())] = 1;
		});
		
		function xc1_calendar_settings() {
			if(xc1_layout() == 'desktop') {
				xc1.calendar.settings = {
					numberOfMonths: [ 2, 3 ], 
					defaultDate: '-5m',
				}; 	
			} else if(xc1_layout() == 'ipad') {
				xc1.calendar.settings = {
					numberOfMonths: [ 2, 2 ], 
					defaultDate: '-3m',
				};
			} else if(xc1_layout() == 'iphone') {
				xc1.calendar.settings = {
					numberOfMonths: [ 1, 1 ], 
					defaultDate: '0',
				};
			}
			xc1.calendar.settings = $.extend({}, {
				numberOfMonths: [ 2, 3 ], 
				defaultDate: '-5m',
				showOtherMonths: true,
				selectOtherMonths: true,
				dateFormat: 'yy-mm-dd',
				onSelect: function(date) {
					xc1_calendar_show(date);
				},
				beforeShowDay: function(date) {
								
					xc1.calendar.daystr = [
						addZero(date.getFullYear()),
						addZero(date.getMonth() + 1),
						addZero(date.getDate())
					].join('-');
					
					if (xc1.calendar.days[xc1.calendar.daystr]) {
						return [true];
					} else {
						return [false];
					}
					
				}
			}, xc1.calendar.settings);
			$('.date').datepicker(xc1.calendar.settings);
		}
			
		xc1_calendar_settings();
	}
	
	function xc1_banners() {
		$('.flashbanner').each(function() {
		
			xc1.banner.id = '#banner-' + xc1_random();
			xc1.banner.swf = $(this).data('swf');
			xc1.banner.url = $(this).data('url');
			xc1.banner.clicktag = $(this).data('clicktag');
			xc1.banner.desktop = '<a class="layout-ipad layout-desktop" href="' + xc1.banner.url + '" target="_blank" rel="nofollow"><img src="' + $(this).data('desktop') + '" alt=""/></a>';
			xc1.banner.mobile = '<a class="layout-iphone" href="' + xc1.banner.url + '" target="_blank" rel="nofollow"><img src="' + $(this).data('mobile') + '" alt=""/></a>';
		
			if($(this).data('swf') != '') {
				var flashvars = false;
				var params = {
					'allowScriptAccess': 'always'
				};
				var attributes = false;
				$(this).append('<div id="' + xc1.banner.id + '">' + xc1.banner.desktop + '</div>');
				swfobject.embedSWF(xc1.banner.swf + '?' + xc1.banner.clicktag + '=' + xc1.banner.url, xc1.banner.id, $(this).data('width'), $(this).data('height'), "9.0.0", "");
				$(xc1.banner.id).addClass('layout-desktop layout-ipad');
				$(this).append(xc1.banner.mobile);
				$(this).css({ 'padding-bottom' : $(this).data('ratio') + '%'}); // CSS Hack for responsive flash
				$(this).find('a').css({ 'margin-bottom' : '-' + $(this).data('ratio') + '%'}); // CSS Hack for responsive images fallback
			} else {
				$(this).append(xc1.banner.desktop + xc1.banner.mobile);
			}
		});
	}
	
	function xc1_layout() {
		if(vars.width >= 800) { return 'desktop'; } else if(vars.width <= 960 && vars.width >= 640) { return 'ipad'; } else if(vars.width <= 640) { return 'iphone'; }
	}
	
	function xc1_retina() {
		if (window.devicePixelRatio >= 1.3) { return true; } else { return false; }
	}
	
	function xc1_random() {
		vars.random = Math.floor(Math.random()*1000);
		return vars.random;
	}
	
	function xc1_domain() {
		var url = window.location.href;
		var url_parts = url.split('/');
		var domain_name_parts = url_parts[2].split(':');
		var domain_name = domain_name_parts[0];
		return domain_name;
	}
	
	function xc1_instagram() {
		$(".instagram-container").each(function() {
			var tag = $(this).data("hashtag");
			if(tag == '') { tag = '#nordinteractive'; }
			$(this).find('.instagram-feed').instagram({
				image_size: 'standard_resolution',
				show: '6',
				hash: '#nordinteractive',
				clientId: '33cb4122262a4e43bf6db744ffe32998',
				onComplete: function() {
					var count = 0;
					$(this).find('.instagram-placeholder').each(function() {
						count++;
						$(this).addClass("img"+count);
					});
				}
			});
		});
	}
	


})( jQuery );