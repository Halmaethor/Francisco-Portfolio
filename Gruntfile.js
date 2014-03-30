module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		sass: {
			dist: {
				options: {
					outputStyle: 'compressed',
					includePaths: [
						'bower_components/normalize-scss/',
						'bower_components/bourbon/app/assets/stylesheets/'
					]
				},
				files: {
					'css/main.min.css': 'scss/main.scss'
				}
			}
		},

		/*sass: {
			dist: {
				options: {
					compass: 'config.rb',
					includePaths: [
						'bower_components/normalize-scss/'
					]
				},
				files: {
					'css/main.min.css': 'scss/main.scss'
				}
			}
		},

		compass: {
			dist: {
				options: {
					config: 'config.rb',
					importPath: [
						'bower_components/normalize-scss/'
					]
				}
			}
		},*/

		concat: {
			dist: {
				src: ['js/touche.js', 'js/main.js'],
				dest: 'js/script.js',
			},
		},

		'closure-compiler': {
			dist: {
				closurePath: 'dummy-closure',
				js: 'js/script.js',
				jsOutputFile: 'js/script.min.js',
				maxBuffer: 500,
				options: {
					compilation_level: 'SIMPLE_OPTIMIZATIONS',
					language_in: 'ECMASCRIPT5_STRICT'
				},
				noreport: true
			}
		}
	});

	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-closure-compiler');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('build:dev',['sass', 'concat']);
	grunt.registerTask('build:prod',['sass', 'concat', 'closure-compiler']);
}