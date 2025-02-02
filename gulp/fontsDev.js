const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const fs = require('fs');
const gulp = require('gulp');
const fonter = require('gulp-fonter-fix');
const ttf2woff2 = require('gulp-ttf2woff2');

const srcFolder = './src';
const destFolder = './build';

gulp.task('ttfToFonts', () => {
	return (
		gulp
			.src(`${srcFolder}/assets/fonts/*/*.ttf`, {})
			.pipe(
				fonter({
					formats: ['woff', 'eot'],
				})
			)
			.pipe(gulp.dest(`${destFolder}/assets/fonts/`))
			.pipe(gulp.src(`${srcFolder}/assets/fonts/*/*.ttf`))
			.pipe(gulp.dest(`${destFolder}/assets/fonts/`))
			.pipe(ttf2woff2())
			.pipe(gulp.dest(`${destFolder}/assets/fonts/`))
			.pipe(
				plumber(
					notify.onError({
						title: 'FONTS',
						message: 'Error: <%= error.message %>',
					})
				)
			)
	);
});

gulp.task('fontsStyle', () => {
	let fontsFile = `${srcFolder}/scss/base/_fonts.scss`;
	fs.readdir(`${destFolder}/assets/fonts/`, function(err, fontFolders) {
		if (fontFolders) {
			fs.writeFile(fontsFile, '', cb);
			let newFileOnly;
			fontFolders.forEach((folder) => {
				fs.readdir(`${destFolder}/assets/fonts/${folder}`, function(err, fontFiles) {
					if (fontFiles) {
						for (let i = 0; i < fontFiles.length; i++) {
							let fontFileName = fontFiles[i].split('.')[0];
							if (newFileOnly !== fontFileName) {
								let fontName = folder;

								let fontWeight = '400';
								let fontStyle = 'normal';

								if (fontFileName.includes('Thin')) {
									fontWeight = '100';
								} else if (fontFileName.includes('ExtraLight')) {
									fontWeight = '200';
								} else if (fontFileName.includes('Light')) {
									fontWeight = '300';
								} else if (fontFileName.includes('Regular')) {
									fontWeight = '400';
								} else if (fontFileName.includes('Medium')) {
									fontWeight = '500';
								} else if (fontFileName.includes('SemiBold')) {
									fontWeight = '600';
								} else if (fontFileName.includes('Bold')) {
									fontWeight = '700';
								} else if (fontFileName.includes('ExtraBold') || fontFileName.includes('Heavy')) {
									fontWeight = '800';
								} else if (fontFileName.includes('Black')) {
									fontWeight = '900';
								}

								if (fontFileName.includes('Italic')) {
									fontStyle = 'italic';
								}

								fs.appendFile(
									fontsFile,
									`@font-face {\n\tfont-family: '${fontName}';\n\tfont-display: swap;\n\tsrc: local('${fontName}'), url("../assets/fonts/${folder}/${fontFileName}.woff2") format("woff2"), url("../assets/fonts/${folder}/${fontFileName}.woff") format("woff"), url("../assets/fonts/${folder}/${fontFileName}.ttf") format("truetype"), url("../assets/fonts/${folder}/${fontFileName}.eot") format("embedded-opentype");\n\tfont-weight: ${fontWeight};\n\tfont-style: ${fontStyle};\n}\r\n`,
									cb
								);
								newFileOnly = fontFileName;
							}
						}
					}
				});
			});
		}
	});

	return gulp.src(`${srcFolder}`);
	function cb() {}
});


gulp.task('fontsDev', gulp.series('ttfToFonts', 'fontsStyle'));
