module.exports = function(grunt) {

"use strict";

require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		sass: {
			build: {
				files: {
					'src/css/style.css': 'src/sass/bootstrap.scss'
				}
			}
		},
		watch: {
			css: {
				files: ['components/bootstrap-sass/assets/stylesheets/*.scss', 'components/bootstrap-sass/assets/stylesheets/mixins/*.scss'],
				tasks: ['buildcss']
			}
		}
	});

	grunt.registerTask('default', []);
	grunt.registerTask('buildcss', ['sass']);

};