$.widget( "hsko.carousel", {
	
    _create: function() {
		
		var self = this;
		
		// Setup the DOM
		self.element
			.addClass("carousel")
			.wrapInner('<div class="carousel-main"><div class="carousel-slides"></div></div>');
		self.element.children(".carousel-main").prepend('<span class="carousel-arrow left"></span><span class="carousel-arrow right"></span>');
		self.element.append('<nav class="carousel-nav"></nav>');
		
		const slides = self.element.find(".carousel-slides").children();
		self.slides = slides; // Cache for use in external functions
		const numSlides = slides.length;
		
		// Build the navigation
		const $navContainer = $(".carousel-nav");
		for (let i = 0; i < numSlides; i++) {
			$navContainer.append('<span data-slidenum="' + i + '"></span>');
		}
		
		// Allow the hover animation on navigation items to finish its current iteration
		const $navItems = self.element.find(".carousel-nav > span");
		$navItems.hover(
			function() {
				$(this).addClass("animated");
			},
			function() {
				$(this).one('animationiteration webkitAnimationIteration', function() {
					$(this).removeClass("animated");
				});
			}
		);
		
		// Activate the first slide
		slides.first().addClass("active");
		
		// Animate the slides
		self._animateSlides();
		
		// Allow the slides to be flipped through with the arrows
		self.element.find(".carousel-arrow.left").click( function() {
			self._resetSlideAnimationTimer();
			self._changeSlide( function(currSlide) {
				let prevSlide = currSlide.prev();
				if (prevSlide.length == 0) prevSlide = slides.last();
				return prevSlide;
			});
		});
		self.element.find(".carousel-arrow.right").click( function() {
			self._resetSlideAnimationTimer();
			self._changeSlide();
		});
		
		// Hook click event to the navigation items
		$navItems.click( function() {
			self._resetSlideAnimationTimer();
			const targetSlideNum = $(this).data("slidenum");
			self._changeSlide( function() {
				return slides.eq(targetSlideNum);
			});
		});
		
    },
	
	_animateSlides: function() {
		var self = this;
		self.slideAnimationTimer = setInterval( function() {
			self._changeSlide();
		}, 5000);
	},
	
	_resetSlideAnimationTimer: function() {
		clearInterval(this.slideAnimationTimer);
		this._animateSlides();
	},
	
	// Changes the current slide to the specified one based off the current one, or the next one
	_changeSlide: function(getTargetSlideFunc) {
		var self = this;
		self.slides.filter(".active").fadeOut( 300, function() {
			const currSlide = $(this);
			currSlide.removeClass("active");
			let nextSlide = null;
			if (getTargetSlideFunc == null) {
				nextSlide = currSlide.next();
				if (nextSlide.length == 0) nextSlide = self.slides.first();
			} else {
				nextSlide = getTargetSlideFunc(currSlide);
			}
			nextSlide.fadeIn( 200, function() {
				$(this).addClass("active");
			});
		});
	}
	
});