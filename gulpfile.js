"use strict";

var gulp = require("gulp"),
    server = require("browser-sync"),
    run = require("run-sequence"),
    spa = require("browser-sync-spa");

gulp.task("serve", function () {
    server.use(spa({}));

    server.init({
        server: "./",
        files:  "./*",
        notify: true,
        open: true,
        ui: false
    });
    //
    gulp.watch("sass/**/*.{scss,sass}", ["style"]);
    gulp.watch("js/**/*.js", ["scripts"]);
    gulp.watch("*.html", ["html"]);
});

gulp.task("html", function () {
    gulp.src([
            "*.html"
        ], {
            base: "."
        })
        .pipe(server.reload({stream: true}));
});
