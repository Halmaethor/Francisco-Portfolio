// Tween objects
var scrollTween = new TweenLite(window, 1, {scrollTo: 0, ease: Quart.easeInOut, paused: true});

$('a.scroller').on('click', gotoSection);

function gotoSection() {
	var id = $(this).attr('data-section');

	scrollTween.pause().invalidate();
	scrollTween.vars.scrollTo = $(id).offset().top;
	scrollTween.restart();

	return false;
}

// Mustache stuff
var projectTemplate = 
'<div class="project"> \
	<div class="project-header"> \
		<img src="img/project_corner.png" alt=""> \
		{{name}} \
	</div> \
	<div class="project-content"> \
		<img src="img/projects/{{image}}" alt="" class="project-image"> \
		<div class="project-details"> \
			<p class="project-description">{{description}}</p> \
			<div class="project-footer"></div> \
		</div> \
	</div> \
</div>';

var projectsContainer = $('#projects');
var projectsShowMore = $('#show-more-projects');
for(var x = 0; x < numVisibleProjects; ++x) {
	projectsContainer.append( Mustache.render( projectTemplate, projects[x] ) );
}
projectsContainer.find('.project').addClass('project-visible');

for(var x = numVisibleProjects; x < projects.length; ++x) {
	projectsContainer.append( Mustache.render( projectTemplate, projects[x] ) );
}
var projectsHidden = projectsContainer.find('.project:not(.project-visible)');

var projectsTween = TweenLite.fromTo(projectsContainer.get(0), 1, 
	{ css: { height: 0 } },
	{
		css: { height: 0 }, ease: Quart.easeInOut, paused: true,
		onStart: function() {
			projectsContainer.addClass('in-transition');
		},
		onComplete: function() {
			projectsContainer.removeAttr('style');

			projectsShowMore.text('Show less projects');
			projectsContainer.addClass('projects-open');
			projectsContainer.removeClass('in-transition');
		},
		onReverseComplete: function() {
			projectsHidden.hide();
			projectsContainer.removeAttr('style');

			projectsShowMore.text('Show more projects');
			projectsContainer.removeClass('projects-open');
			projectsContainer.removeClass('in-transition');
		}
	}
);
projectsHidden.hide();
projectsContainer.removeAttr('style');

if( projects.length <= numVisibleProjects ) {
	projectsShowMore.hide();
} else {
	projectsShowMore.on('click', function() {
		if( projectsContainer.hasClass('in-transition') ) {
			return false;
		}

		var smallHeight = getProjectsSmallHeight();
		projectsTween.invalidate();
		projectsTween.vars.startAt.css.height = smallHeight;
		if( projectsContainer.hasClass('projects-open') ) {
			projectsTween.vars.css.height = getProjectsBigHeight();

			projectsTween.reverse();
		} else {
			projectsContainer.css('height', smallHeight);
			projectsHidden.show();
			projectsTween.vars.css.height = getProjectsBigHeight();

			projectsTween.play();
		}

		return false;
	});
}

function getProjectsSmallHeight() {
	var lastVisibleProject = projectsContainer.find('.project:nth(' + (numVisibleProjects - 1) + ')');

	return Math.ceil(lastVisibleProject.position().top + lastVisibleProject.outerHeight()) + 20;
}

function getProjectsBigHeight() {
	var lastVisibleProject = projectsContainer.find('.project:last');

	return Math.ceil(lastVisibleProject.position().top + lastVisibleProject.outerHeight()) + 20;
}

$('.project').on('touchend', function() {
	$(this).toggleClass('active');
});

$('.submit-button a').on('click', function() {
	var subject = '[WORK PROPOSAL]';
	var personName = $('[name="person-name"]').val();
	var companyName = $('[name="company-name"]').val();

	if( companyName !== '' ) {
		subject += ' ' + companyName;

		if( personName !== '' ) {
			subject += ' - ' + personName;
		}
	} else if( personName !== '' ) {
		subject += ' ' + personName;
	}

	window.location = $(this).attr('href') + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent( $('[name=body]').val() );

	return false;
});