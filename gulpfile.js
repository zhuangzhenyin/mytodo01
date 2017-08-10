var gulp = require('gulp'); //引入gulp
// var minHtml = require('gulp-minify-html');
var $ = require('gulp-load-plugins')();	//引入所有的包
var open = require('open');//不包括在所有的包内，要单独引进

//压缩html
gulp.task("html",function () {
	gulp.src("src/*.html") //读取文件
		.pipe(gulp.dest("build/")) //复制到开发环境
		.pipe($.minifyHtml()) //压缩html
		.pipe(gulp.dest("dev/")) //放到压缩文件夹
		.pipe($.connect.reload());
});

//压缩js
gulp.task("js",function () {
	gulp.src("src/js/*.js") //读取文件
		// .pipe($.concat("index.js")) //合并js
		.pipe(gulp.dest("build/js/")) //复制到开发环境
		.pipe($.uglify())	//压缩js
		.pipe(gulp.dest("dev/js/")) //放到压缩文件夹
		.pipe($.connect.reload());
});


//压缩css
gulp.task("css",function () {
	gulp.src("src/css/*.css") //读取文件
		.pipe(gulp.dest("build/css")) //复制到开发环境
		.pipe($.cssmin())	//压缩css
		.pipe(gulp.dest("dev/css")) //放到压缩文件夹
		.pipe($.connect.reload());
});

//压缩图片
gulp.task("img",function () {
	gulp.src("src/images/*") //读取文件 所有的图片
		.pipe(gulp.dest("build/images")) //复制到开发环境
		.pipe($.imagemin())	//压缩图片
		.pipe(gulp.dest("dev/images")) //放到压缩文件夹
		.pipe($.connect.reload());
});

//建立lib文件--插件
gulp.task("lib",function () {
	gulp.src("bower_components/**/dist/*.js")
		.pipe(gulp.dest("build/lib/"))
		.pipe(gulp.dest("dev/lib/"));
});
//音乐播放
gulp.task("miusic",function () {
	gulp.src("src/*.mp3")
		.pipe(gulp.dest("build/"))
		.pipe(gulp.dest("dev/"));
});
//总任务
gulp.task("build",["html","css","js","img","lib","miusic"]);

//清除
gulp.task("clear",function () {
    gulp.src(["dev/","build/"])
        .pipe($.clean());
});

//监控刷新
gulp.task("server",function () {
	$.connect.server({
		root:"build/",
		port:8080,
		livereload:true
	})

	open("http://localhost:8080");

	gulp.watch("src/*.html",["html"]); //参数：监控对象 执行对象
	gulp.watch("src/css/*.css",["css"]);
	gulp.watch("src/js/*.js",["js"]);
	gulp.watch("src/images/*",["img"]);
});

//默认任务
gulp.task("default",["server"]);
