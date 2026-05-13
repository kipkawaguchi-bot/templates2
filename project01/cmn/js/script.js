/* ===========================================================
 * script.js — jQuery ベース
 * - DOM ready 内に処理を集約
 * - メニュー開閉（ダミー）
 * - スクロールイベント枠
 * =========================================================== */
$(function () {

	// ---------- menu toggle ----------
	$('.js-toggle').on('click', function () {
		var $btn = $(this);
		var expanded = $btn.attr('aria-expanded') === 'true';
		$btn.attr('aria-expanded', !expanded);
		$('.js-nav').toggleClass('is-active');
		$('body').toggleClass('is-menu-open');
	});

	// ---------- smooth scroll（同一ページアンカー） ----------
	$('a[href^="#"]').on('click', function (e) {
		var href = $(this).attr('href');
		if (href === '#' || href === '') return;
		var $target = $(href);
		if (!$target.length) return;
		e.preventDefault();
		var top = $target.offset().top - 64;
		$('html, body').animate({ scrollTop: top }, 400);
	});

	// ---------- scroll event 枠 ----------
	var lastScroll = 0;
	$(window).on('scroll', function () {
		var y = $(window).scrollTop();
		// is-scrolled: 一定量スクロールしたら付与
		$('.js-header').toggleClass('is-scrolled', y > 10);
		// 拡張用: 上下スクロール判定
		// var dir = y > lastScroll ? 'down' : 'up';
		lastScroll = y;
	});

	// ---------- resize event 枠 ----------
	var resizeTimer;
	$(window).on('resize', function () {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function () {
			// 拡張用
		}, 200);
	});

});
