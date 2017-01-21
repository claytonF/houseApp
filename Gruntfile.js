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
		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'dist/css',
					src: 'style.css',
					dest: 'dist/css',
					ext: '.min.css'
				}]
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
			},
			bootstrapValidator: {
				expand: true,
				src: 'components/bootstrap-validator/dist/validator.min.js',
				dest: 'dist/js/',
				flatten: true
			}		
		},
		concat: {
			dist: {
				src: ['components/knockout/dist/knockout.js','components/jquery/dist/jquery.min.js','components/bootstrap-sass/assets/javascripts/bootstrap.min.js','components/bootstrap-validator/dist/validator.min.js'],
				dest: 'dist/js/libs.js'
			}
		}

	});

	grunt.registerTask('default', ['cssmin']);
	grunt.registerTask('buildcss', ['sass']);
	grunt.registerTask('deploy', ['sass','cssmin','copy']);

};