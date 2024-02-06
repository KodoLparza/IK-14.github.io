function set_list(id, itms) {
    var n = 12, from = 0, shift=0, $= jQuery,
        o = $(id),
        $items = o.find(itms),
        f = document.getElementById('input1'),
        pager = document.getElementById('pageNavigator2').getElementsByTagName('a'),
        j=$items.length, search = '', pages=1,
        filter = function(v) {
            if (from > pages-1) from = pages-1;
            j=0;
            if (from<0) from = 0;
            for (var i=0,itm; itm=$items[i]; i++) {
                var show = ($(itm).data('title').toLowerCase().indexOf(v.toLowerCase())>-1);
                itm.style.display = (show && j>=from*n && j<from*n+n) ? '' : 'none';
                if (show) j++;
            }
            pages = Math.ceil(j/n);
            set_pager();
        } ,
        set_pager = function() {
            for (var i=0, itm; itm = pager[i]; i++) {
                var hide = false, s = false;
                if (i-2>$items.length/n&&i<pager.length-2) {
                    itm.parentNode.removeChild(itm);
                    i--;
                    continue;
                }
                if (i<2) {
                    if (!from || pages<6) hide = true
                } else if (i>pager.length-3) {
                    if (from>=pages-1 || pages<6) hide = true;
                } else {
                    var id = i-2, offset = 0;
                    if (!itm.onclick) itm.onclick = function(e) {from = this.p; f.onkeyup(); return (false)}
                    shift = (from-2);
                    if (shift<0 || pages<6) {
                        shift=0;
                    } else if (shift>pages-5) {shift=pages-5;}
                    itm.p = shift+id;
                    if (itm.p == from) s = true;
                    var v = [(itm.p)*n+1,(itm.p+1)*n];
                    itm.innerHTML = itm.p+1//'['+v[0]+'-'+((v[1]>j)?j:v[1])+']';
                    //itm.title = itm.p
                    if (itm.p<0 || v[0]>j) hide = true;
                }
                if (i>1 && i<7) itm.className = (s) ? 's' : '';
                itm.style.display = (hide || pages<2) ? 'none' : '';
            }
        };

    $map_modal = addBootstrapModal({cls:'map_modal'});

    this.$map_modal = $map_modal;

    o.on('click','.itm', function() {
        $map_modal.find('.modal-body').html($(this).find('.c').html());
        $map_modal.modal('show');
    })

    f.onkeyup = function() {filter((this.value == this.defaultValue) ? '' : this.value);}
    pager[0].onclick = function(e) {from = 0; f.onkeyup(); return getFalse(e)}
    pager[1].onclick = function(e) {--from; f.onkeyup(); return getFalse(e)}
    pager[pager.length-2].onclick = function(e) {++from; f.onkeyup(); return getFalse(e)}
    pager[pager.length-1].onclick = function(e) {from = pages-1; f.onkeyup(); return getFalse(e)}


    $(f).on('focus', function() {$('.minisearch').addClass('focus')}).on('blur', function(e) {setTimeout(function() {$('.minisearch').removeClass('focus')},200)});

    $('.minisearch .close').on('click',function(e) {jQuery('#input1').val('').trigger('keyup'); return (false);});

    filter('');

    return (this)
}

window.make_accordion = function(o, opts) {
    var $ = jQuery, $o = $(o), def = {closable:true}, i=0;
    opts = $.extend(def, opts || {});

    var $itms = opts.pads || $o.children('li') , $tabs = opts.tabs || $('h3.i', $o);

    //sx.setClass($o, 'active');
    $.each($tabs, function(j) {if ($itms.length<2) $itms.eq(0).addClass('open'); this.i = j; this.onclick = function() {
        var open = $itms.eq(this.i).hasClass('open');
        $itms.removeClass('open')
        if (!open) $itms.eq(this.i).addClass('open');
    }
    });

    return {o:$o, tabs:$tabs, itms:$itms, opts:opts}
}

window.addBootstrapModal = function(opts) {
    opts = jQuery.extend({}, opts);

    return (jQuery('<div class="modal '+(opts.cls||'')+'">\n' +
        '    <div class="modal-dialog'+((opts.large)?' modal-lg':'')+'">\n' +
        '        <div class="modal-content">\n' +
        '            <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>\n' +
        '            <div class="modal-body'+((opts.loading)?' ajax-block':'')+'">'+(opts.content||'')+'</div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>').appendTo(document.body));
}

jQuery.loadScripts = function(scripts) {
    var deferred = jQuery.Deferred();

    function loadScript(i) {
        if (i < scripts.length) {
            jQuery.ajax({
                url: scripts[i],
                dataType: "script",
                cache: true,
                success: function() {
                    loadScript(i + 1);
                }
            });
        } else {
            deferred.resolve();
        }
    }
    loadScript(0);

    return deferred;
}

window.set_newplayer_param = function(href, elemId, w, h) {
    w = w != null ? w : '100%';
    h = h != null ? h : '470';

    var type=(href||'').split('.').pop();

    switch (type) {
        case 'flv':
            type = ' type="video/x-flv"';
        break;

        default:
            type = ' type="video/'+type+'"';
    }

    var html = '<video controls="true" preload="none" id="videojsplayer" class="video-js vjs-big-play-centered"  controls>' +
        '<source src="'+href+'"'+type+'>'+/* type="video/x-flv"*/
        '<p class="vjs-no-js">Для просмотра этого видео, пожалуйста включите JavaScript, или задумайтесь об обновлении браузера, который <a href="http://videojs.com/html5-video-support/" target="_blank">поддерживает HTML5 видео</a></p>' +
        '</video>';

    jQuery('#'+elemId).html(html);

    var init = function() {

        var player = videojs('videojsplayer', {
        width:w,
        height:h,
        fluid: true,
        controlBar: {
            'pictureInPictureToggle': false
        }
        //  techOrder: ['html5', 'flvjs']
    });};

    init();

    //(window.videojs) ? init() : jQuery.loadScripts(['scripts/fsin2019/vendor/video/video.min.js','scripts/fsin2019/vendor/video/video.min.js','scripts/fsin2019/vendor/video/video.min.js']).then(init);
};

window.print_page = function() {
    var href = jQuery('#print_page_link').attr('href') || document.location.href+((href.indexOf('?')>-1)?'&':'?')+'_print=true';
    window.open(href, '_blank');
};

window.initScroller = function() {
    var $item = $(this).find('.itm'),
        $target,
        $control = $(this).find('.arr').on('click', function() {
            $target = $(this.getAttribute('data-target'));
            $target.scrollLeft($target.scrollLeft()+$item.outerWidth()*($(this).hasClass('arrl')?-1:1));
            console.log($item.width(),$target.scrollLeft())
        })
}

jQuery(function($) {
    $('[data-init]').each(function() {
        var _f = $(this).data('init');
        $.isFunction(window[_f]) && window[_f].apply(this);
    });

    $('#menu').on('click','.sw',function() {
        if ($(this).hasClass('mobile')) {
            var $menu = $('#sbar').toggleClass('open'), offset = $('.menu2>ul>li>a.active').parent().prev().position();
            if (offset && offset.top > $menu.height() / 2) $menu.scrollTop(offset.top);
        } else {
            this.parentNode.classList.toggle('open');
        }
    });

    var target, $imgModal, $videoModal;
    $(document.body).on('click',' a[data-target]', function(e) {

        e.preventDefault();
       target = this.getAttribute('data-target');
        switch(target) {
            case 'modal':
                if (!$imgModal) $imgModal = addBootstrapModal({cls:'imgModal', content:'<div class="text-center"><img class="bigImg"></div>'});
                $('.bigImg',$imgModal).attr('src',this.href);
                $imgModal.modal('show');
            break;

            case 'video':
                if (!$videoModal) $videoModal = addBootstrapModal({cls:'videoModal', large:true, content:'<div id="showVideo"/>'}).on('hide.bs.modal', function() {
                    videojs(document.getElementById('videojsplayer')).dispose();
                    $('#showVideo').empty();
                });

                $videoModal.modal('show');
                set_newplayer_param(this.href,'showVideo');

            break;
        }
    })
})

function addToTitle(title) {
    tmpDoc = (self.parent == null || self.parent == self) ? self.document : self.parent.document;
    var pos = tmpDoc.title.indexOf("(");
    if (pos >= 0)
        tmpDoc.title = tmpDoc.title.substring(0, pos - 1);
    tmpDoc.title = tmpDoc.title + " ( " + title + " )";
}