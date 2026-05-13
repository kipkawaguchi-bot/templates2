$(function () {

    $('.js-menu-open').on('click', function() {
        $('.header_menu').addClass('is-open');
        $('.headerOverlay').addClass('is-open');
        $('html').addClass('is-noscroll');
    });
    $('.js-menu-close,.headerOverlay').on('click', function() {
        $('.header_menu').removeClass('is-open');
        $('.headerOverlay').removeClass('is-open');
        $('html').removeClass('is-noscroll');
    });

    var topBtn = $(".js-floating");

    $(window).scroll(function () {
        if ($(this).scrollTop() > 10) {
            topBtn.addClass('floating');
        } else {
            topBtn.removeClass('floating');
        }
    });

    $(window).on('scroll', function () {
        var scrollTop = $(this).scrollTop();
        var windowHeight = $(this).height();
        var reserveTop = $('#reserve').offset().top;
    
        if (scrollTop + windowHeight >= reserveTop) {
            topBtn.addClass('is-hide');
        } else {
            topBtn.removeClass('is-hide');
        }
    });

    function smoothScroll(targetSelector, offset = 0) {
        const $target = $(targetSelector);
        if (!$target.length) return;

        const position = $target.offset().top - offset;
        $('html, body').animate({ scrollTop: position }, 400, 'swing');
    }

    $('.js-anklnk a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        smoothScroll($(this).attr('href'));
    });

    $('.js-top a').on('click', function (e) {
        e.preventDefault();
        const href = $(this).attr('href');
        smoothScroll(href === '#' || href === '' ? 'html' : href);
    });

    const section = document.querySelector('#reserve');
    const bg = section.querySelector('.reserve_bg');
    const ver1 = bg.querySelector('.is-ver1');
    const ver2 = bg.querySelector('.is-ver2');
    
    let currentY = 0;
    let targetY = 0;
    
    function animate() {
        currentY += (targetY - currentY) * 0.1;
    
        // 上
        ver1.style.transform = `translate3d(0, ${-currentY}px, 0)`;
    
        // 下
        ver2.style.transform = `translate3d(0, ${ currentY}px, 0)`;
    
        requestAnimationFrame(animate);
    }
    
    window.addEventListener('scroll', () => {
        const rect = section.getBoundingClientRect();
        targetY = -rect.top * 0.3;
    });
    
    animate();
    

});
