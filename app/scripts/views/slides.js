define(['backbone', 'views/slide'], function(Backbone, SlideView) {
	var SlidesView = Backbone.View.extend({
		el: $('.slides'),

		initialize: function() {
			this.currentSlideIndex = 1;
			this.numSlides = this.collection.length;
			this.transitionSpeed = 400;

			this.renderAll();

			App.Vent.on('init', this.hideAllButFirst, this);
			App.Vent.on('changeSlide', this.changeSlide, this);
		},

		hideAllButFirst: function() {
			this.$el.children(':nth-child(n+2)').hide();
		},

		changeSlide: function(opts) {
			var newSlide;
			var slides = this.$el.children();
			var self = this;

			this.setCurrentSlideIndex(opts);
			newSlide = this.getNextSlide(slides);
			this.animateToNewSlide(slides, newSlide, opts.direction);

			App.router.navigate('/slides/' + this.currentSlideIndex);
		},

		setCurrentSlideIndex: function(opts) {

			if ( opts.slideIndex ) {
				return this.currentSlideIndex = ~~opts.slideIndex
			}

			this.currentSlideIndex += opts.direction === 'next' ? 1 : -1;

			if ( this.currentSlideIndex > this.numSlides ) {
				this.currentSlideIndex = 1;
			}

			if ( this.currentSlideIndex <= 0 ) {
				this.currentSlideIndex = this.numSlides;
			}
		},

		getNextSlide: function(slides) {
			return slides.eq(this.currentSlideIndex - 1);
		},

		animateToNewSlide: function(slides, newSlide, direction) {
			slides.filter(':visible')
				.animate({
					top: direction === 'next' ? '100%' : '-100%',
					opacity: 'hide'

				}, this.transitionSpeed, function() {
					$(this).css('top', 0);

					newSlide
						.css('top', direction === 'next' ? '-100%' : '100%')
						.animate({
							top: 0,
							opacity: 'show'
						}, self.transitionSpeed);
				});
		},

		renderAll: function() {
			this.$el.empty();
			this.collection.each(this.render, this);
		},

		render: function(slide) {
			var slideView = new SlideView({ model: slide });
			this.$el.append(slideView.render().el);

			return this;
		}
	});

	return SlidesView;
});