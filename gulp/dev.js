const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const typograf = require('gulp-typograf');
const svgsprite = require('gulp-svg-sprite');
const webpHTML = require('gulp-webp-retina-html');
const imageminWebp = require('imagemin-webp');
const rename = require('gulp-rename');
const prettier = require('@bdchauvette/gulp-prettier');
const filter = require('gulp-filter');
const sharpResponsive = require('gulp-sharp-responsive');
const browserSync = require('browser-sync').create();

gulp.task('clean:dev', function(done) {
	if (fs.existsSync('./build/')) {
		return gulp.src('./build/', { read: false }).pipe(clean({ force: true }));
	}
	done();
});

gulp.task('browser-sync', function(done) {
	browserSync.init({
		server: {
			baseDir: './build/',
		},
		notify: false,
		open: true,
	});
	done();
});

const plumberNotify = (title) => {
	return {
		errorHandler: notify.onError({
			title: title,
			message: 'Error <%= error.message %>',
			sound: false,
		}),
	};
};

gulp.task('pug:dev', function() {
	return gulp
		.src(['./src/pug/pages/*.pug'])
		.pipe(changed('./build/', { hasChanged: changed.compareContents }))
		.pipe(plumber(plumberNotify('Pug')))
		.pipe(
			pug({
				pretty: true,
			})
		)
		.pipe(
			typograf({
				locale: ['ru', 'en-US'],
				htmlEntity: { type: 'digit' },
				safeTags: [
					['<\\?php', '\\?>'],
					['<no-typography>', '</no-typography>'],
				],
			})
		)
		.pipe(
			webpHTML({
				extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
				retina: {
					1: '',
					2: '@2x',
					3: '@3x',
				},
			})
		)
		.pipe(
			prettier({
				tabWidth: 4,
				useTabs: true,
				printWidth: 182,
				trailingComma: 'es5',
				bracketSpacing: false,
			})
		)
		.pipe(gulp.dest('./build/'));
});

gulp.task('sass:dev', function() {
	return gulp
		.src('./src/scss/*.scss')
		.pipe(changed('./build/css/'))
		.pipe(plumber(plumberNotify('SCSS')))
		.pipe(sourceMaps.init())
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(sourceMaps.write())
		.pipe(gulp.dest('./build/css/'));
});

gulp.task('images:dev', function(done) {
	// Генерация оригинальных изображений и их WebP
	function generateOriginalImages() {
		const fileFilter = filter((file) => !file.isDirectory(), { restore: true });
		return gulp
			.src(['./src/assets/images/**/*', '!./src/assets/images/icons/**/*', '!./src/assets/images/favicons/**/*'])
			.pipe(fileFilter)
			.pipe(changed('./build/assets/images/'))
			.pipe(
				imagemin([
					imageminWebp({
						quality: 85,
					}),
				])
			)
			.pipe(rename({ extname: '.webp' }))
			.pipe(gulp.dest('./build/assets/images/'));
	}

	// Генерация ретина-версий (@2x и @3x)
	function generateRetinaImages() {
		return gulp
			.src([
				'./src/assets/images/**/*.{jpg,jpeg,png}',
				'!./src/assets/images/icons/**/*',
				'!./src/assets/images/favicons/**/*',
			])
			.pipe(
				sharpResponsive({
					formats: [
						{
							width: (metadata) => metadata.width * 2,
							rename: { suffix: '@2x' },
						},
						{
							width: (metadata) => metadata.width * 3,
							rename: { suffix: '@3x' },
						},
					],
				})
			)
			.pipe(gulp.dest('./build/assets/images/'));
	}

	// Генерация WebP для ретина-версий
	function generateRetinaWebp() {
		return gulp
			.src([
				'./build/assets/images/**/*@2x.{jpg,jpeg,png}',
				'./build/assets/images/**/*@3x.{jpg,jpeg,png}',
				'!./src/assets/images/icons/**/*',
				'!./src/assets/images/favicons/**/*',
			])
			.pipe(
				imagemin([
					imageminWebp({
						quality: 85,
					}),
				])
			)
			.pipe(rename({ extname: '.webp' }))
			.pipe(gulp.dest('./build/assets/images/'));
	}

	// Копирование оригинальных изображений без изменений
	function copyOriginals() {
		return gulp
			.src(['./src/assets/images/**/*', './src/assets/images/favicons/**/*', '!./src/assets/images/icons/**/*'])
			.pipe(changed('./build/assets/images/'))
			.pipe(gulp.dest('./build/assets/images/'));
	}

	// Последовательное выполнение задач
	const runTasksInSequence = gulp.series(
		generateOriginalImages,
		generateRetinaImages,
		generateRetinaWebp,
		copyOriginals
	);

	return runTasksInSequence(done);
});

const svgStack = {
	mode: {
		stack: {
			sprite: './sprite.stack.svg',
			example: true,
		},
	},
	shape: {
		id: {
			separator: '-',
			generator: (name, file) => {
				const cleanName = name
					.replace(/.*[\\/]/, '')
					.replace(/\s+/g, '-')
					.replace(/_/g, '-')
					.replace(/\.\w+$/, '');
				return cleanName;
			},
		},
		transform: [
			{
				svgo: {
					js2svg: { indent: 4, pretty: true },
				},
			},
		],
	},
};

const svgSymbol = {
	mode: {
		symbol: {
			sprite: './sprite.symbol.svg',
			example: true,
		},
	},
	shape: {
		id: {
			separator: '-',
			generator: (name, file) => {
				const cleanName = name
					.replace(/.*[\\/]/, '')
					.replace(/\s+/g, '-')
					.replace(/_/g, '-')
					.replace(/\.\w+$/, '');
				return cleanName;
			},
		},
		transform: [
			{
				svgo: {
					js2svg: { indent: 4, pretty: true },
					plugins: [
						{
							name: 'removeAttrs',
							params: {
								attrs: '(fill|stroke)',
							},
						},
					],
				},
			},
		],
	},
};

gulp.task('svgStack:dev', function() {
	return gulp
		.src('./src/assets/images/icons/**/*.svg')
		.pipe(plumber(plumberNotify('SVG Stack')))
		.pipe(
			svgsprite({
				...svgStack,
			})
		)
		.pipe(gulp.dest('./build/assets/images/icons'));
});

gulp.task('svgSymbol:dev', function() {
	return gulp
		.src('./src/assets/images/icons/**/*.svg')
		.pipe(plumber(plumberNotify('SVG Symbol')))
		.pipe(
			svgsprite({
				...svgSymbol,
			})
		)
		.pipe(gulp.dest('./build/assets/images/icons'));
});

gulp.task('data:dev', function() {
	return gulp
		.src('./src/data/**/*')
		.pipe(changed('./build/data/'))
		.pipe(gulp.dest('./build/data/'));
});

gulp.task('sounds:dev', function() {
	return gulp
		.src('./src/assets/sounds/**/*')
		.pipe(changed('./build/assets/sounds/'))
		.pipe(gulp.dest('./build/assets/sounds/'));
});

gulp.task('js:dev', function() {
	return gulp
		.src('./src/js/*.js')
		.pipe(changed('./build/js/'))
		.pipe(plumber(plumberNotify('JS')))
		.pipe(webpack(require('./../webpack.config.js')))
		.pipe(gulp.dest('./build/js/'));
});

const serverOptions = {
	livereload: true,
	open: true,
};

gulp.task('server:dev', function() {
	return gulp.src('./build/').pipe(browserSync.stream());
});

gulp.task('watch:dev', function() {
	gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'));
	gulp.watch(['./src/pug/**/*.pug'], gulp.parallel('pug:dev'));
	gulp.watch('./src/assets/images/**/*', gulp.parallel('images:dev'));
	gulp.watch('./src/data/**/*', gulp.parallel('data:dev'));
	gulp.watch('./src/assets/sounds/**/*', gulp.parallel('sounds:dev'));
	gulp.watch('./src/js/**/*.js', gulp.parallel('js:dev'));
	gulp.watch('./src/assets/images/icons/*', gulp.series('svgStack:dev', 'svgSymbol:dev'));
	gulp.watch('./build/**/*').on('change', browserSync.reload);
});
