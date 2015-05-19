module.exports = function(grunt) {

"use strict";

require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		sass: {
			build: {
				files: {
					'dist/css/style.css': 'dist/sass/bootstrap.scss'
				}
			}
		},
		watch: {
			css: {
				files: ['components/bootstrap-sass/assets/stylesheets/*.scss', 'components/bootstrap-sass/assets/stylesheets/bootstrap/mixins/*.scss', 'components/bootstrap-sass/assets/stylesheets/bootstrap/*.scss'],
				tasks: ['buildcss']
			}
		},
		copy: {
			knockoutjs: {
				expand: true,
				src: 'components/knockout/dist/knockout.js',
				dest: 'dist/js/',
				flatten: true
			},
			bootstrapjs: {
				expand: true,
				src: 'components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
				dest: 'dist/js/',
				flatten: true
			}		
		}
	});

	grunt.registerTask('default', []);
	grunt.registerTask('buildcss', ['sass']);

};