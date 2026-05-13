/* =============================================================
 * script.js — TOPページ + 共通動作
 * jQuery 3.7.1
 * 機能：SPメニュー / スクロールトップ / スムーススクロール / FAQアコーディオン / コースタブ
 * ============================================================= */
(function ($) {
  'use strict';

  $(function () {

    /* ---------- SPメニュー ---------- */
    var $body = $('body');
    var $menuBtn = $('.js-menu');
    var $spNav = $('.js-spnav');

    $menuBtn.on('click', function () {
      var isOpen = $(this).hasClass('is-open');
      if (isOpen) {
        $(this).removeClass('is-open').attr('aria-expanded', 'false');
        $spNav.removeClass('is-open').attr('aria-hidden', 'true');
        $body.removeClass('is-menu-open');
      } else {
        $(this).addClass('is-open').attr('aria-expanded', 'true');
        $spNav.addClass('is-open').attr('aria-hidden', 'false');
        $body.addClass('is-menu-open');
      }
    });

    // SPナビ内リンククリックで閉じる
    $spNav.on('click', 'a', function () {
      $menuBtn.removeClass('is-open').attr('aria-expanded', 'false');
      $spNav.removeClass('is-open').attr('aria-hidden', 'true');
      $body.removeClass('is-menu-open');
    });

    /* ---------- スクロールトップボタン ---------- */
    var $returntop = $('.js-returntop');
    var SHOW_THRESHOLD = 400;

    $(window).on('scroll', function () {
      if ($(window).scrollTop() > SHOW_THRESHOLD) {
        $returntop.addClass('is-show');
      } else {
        $returntop.removeClass('is-show');
      }
    });

    $returntop.on('click', function () {
      $('html, body').animate({ scrollTop: 0 }, 500);
    });

    /* ---------- スムーススクロール（同一ページ内アンカー） ---------- */
    $('a[href^="#"]').not('[href="#"]').on('click', function (e) {
      var href = $(this).attr('href');
      var $target = $(href);
      if (!$target.length) return;
      e.preventDefault();
      var headerH = $('.header_wrap').outerHeight() || 0;
      var pos = $target.offset().top - headerH - 16;
      $('html, body').animate({ scrollTop: pos }, 600);
    });

    /* ---------- FAQアコーディオン ---------- */
    $('.js-faq').on('click', '.faq_q', function () {
      var $q = $(this);
      var $a = $q.next('.faq_a');
      var isOpen = $q.attr('aria-expanded') === 'true';
      if (isOpen) {
        $q.attr('aria-expanded', 'false');
        $a.stop().slideUp(250, function () { $a.attr('hidden', true); });
      } else {
        $q.attr('aria-expanded', 'true');
        $a.removeAttr('hidden').hide().stop().slideDown(250);
      }
    });

    /* ---------- コースタブ ---------- */
    $('.js-tabs').on('click', '.course_tab_btn', function () {
      var $btn = $(this);
      $btn.addClass('is-active').siblings().removeClass('is-active');
      // データ属性を取得（実装時はここでパネル切替を行う想定）
      var tab = $btn.data('tab');
      $btn.closest('.course_wrap').attr('data-active-tab', tab);
    });

  });
})(jQuery);
