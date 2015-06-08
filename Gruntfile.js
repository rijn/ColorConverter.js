module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            "target": {
                "files": {
                    './ColorConverter.min.js': [
                        './ColorConverter.js',
                    ],
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            javascript: {
                files: [
                    './*.js',
                ],
                tasks: [
                    'uglify'
                ],
                options: {
                    nospawn: true
                }
            },
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['uglify','watch']);
}
