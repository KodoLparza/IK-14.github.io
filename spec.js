var defaultfont = 100;
function get_size_value(str) {
    str.replace("%", "");
    var val = parseInt(str);
    if (isNaN(val)) return defaultfont; else return val;
}

function apply_font_size(id, modifier) {
    var elem = document.getElementById(id) || document.body;
    var val = get_size_value(elem.style.fontSize);
    val = modifier(val);
    elem.style.fontSize = val + "%";
}

function set_text_size(id) {

    var value = readCookie( "thlPortalTextSize" );
    apply_font_size(id || "page", function (v) {
        if( value != null ){
            return value;
        }else{
            return defaultfont;
        }
    });

    var style = readCookie( "thlPortalStyle" ) || 'theme1 font1 kern1';
    if (style) {
        document.body.className = document.body.className.replace(/(theme\d)|(font\d)|(kern\d)/g,'') + ' '+style;
        style = style.split(' ');
        jQuery('.set a.sw').removeClass('s').filter('.'+style[1]+',.'+style[2]).addClass('s')
    }


}

function text_size_increase() {
    apply_font_size("page", function (v) {
        var value;
        if ( v < (defaultfont+50/* + 35*/) ) {
            value = v + 10;
        } else {
            value=v;
        }
        createCookie( "thlPortalTextSize", value, 7 );
        return value;
    });
}

function text_size_decrease() {
    apply_font_size("page", function (v) {
        var value;
        if ( v > (defaultfont/* - 20*/) ) {
            value = v - 10;
        } else {
            value=v;
        }
        createCookie( "thlPortalTextSize", value, 7 );
        return value;
    });
}

function createCookie(name,value,days) {
    var expires = "", date;
    if (days) {
        date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires="+date.toGMTString();
    }

    var str = "";//document.location.hostname.split('.');
    document.cookie = name+"="+value+expires+"; path=/; domain="+document.location.hostname.split('.').splice(-2).join('.')/*+((str.length<1) ? "" : "; domain=."+ str(str.length-2)+'.'+str(str.length-1))*/;

    if (name === 'thlPortalTextSize' || name === 'thlPortalStyle') window.tell_childs();
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}

function set_style(o) {
    var p = document.getElementsByTagName('body')[0], cl = p.className,
        style = [cl.match(/theme\d/),cl.match(/font\d/),cl.match(/kern\d/) ];
    if (!o) o  = {};

    style[0] = o.theme || ((style[0]) ? style[0] : 'theme1');
    style[1] = o.font || ((style[1]) ? style[1] :'font1');
    style[2] = o.kern || ((style[2]) ? style[2] :'kern1');
    //style[3] =  (o.noimage || o.noimage === undefined && style[3]) ? 'noimg' : '';
    //style[3] =  (o._1col || o._1col === undefined && style[3]) ? '_1col' : '';

    //jQuery('.set a.sw').removeClass('s').filter('.'+style[1]+',.'+style[2]).addClass('s')



    p.className = p.className.replace(/(theme\d)|(font\d)|(kern\d)/g,'').replace(/\s*$/,'') + ' ' + style.join(' ');

    createCookie('thlPortalStyle', style.join(' ')/*p.className*/, 7);

    return (false);
}



function handle_easy() {

    var cssHtml = '<link href="styles/fsin2019/easy.css" ' +
        'rel="stylesheet" type="text/css" media="screen" class="spec_css" />', $ = jQuery;

    var o, setHints = function(flag) {
        $(/*#menu .itm, .menu2 a, .ftr_menu .itm, .logo,*/' [data-hint], a[title]').each(function() {
            o = $(this);
            if (o.hasClass('_nohint')) return (true);
            o.attr('title',(flag)?o.text():'').tooltip((flag)?{animation:false}:'destroy');
        })

        $('img[alt], img[title]').each(function() {
            $(this).attr('title', this.alt||this.title ).tooltip((flag)?{animation:false}:'destroy');})
    };

    window.get_easy_params = function() {
        return {
            isSpecTheme : jQuery('.spec_css').length > 0,
            thlPortalStyle : readCookie("thlPortalStyle")
        }
    };

    window.tell_childs = function() {
        if (window.frames.length===0) return (false);
        var style = readCookie('thlPortalStyle'), size = readCookie('thlPortalTextSize');
        try {window.frames[0].postMessage('{"for":"webreception","style":'+(style?('"'+style+'"'):null)+',"size":'+(size?('"'+size+'"'):'""')+'}','*');
        } catch(e) {}
    }

    window.toggle_easy = function (isSpecTheme, thlPortalStyle) {
        var $css = jQuery('.spec_css');
        isSpecTheme = isSpecTheme !== void 0 ? isSpecTheme : $css.length;
        if (isSpecTheme) {
            $css.remove();
            jQuery('body').css('fontSize', '');
            eraseCookie("thlPortalStyle");
            eraseCookie("thlPortalTextSize");
            try {
                if (jQuery.fn.datepicker) jQuery('input[type=text]').datepicker('hide');
            } catch(e) {}
        } else {
            var base = jQuery('base').attr('href');
            jQuery('head').append(jQuery((base) ? cssHtml.replace('styles', base+'styles') : cssHtml));
            thlPortalStyle = thlPortalStyle !== void 0 ? thlPortalStyle : readCookie("thlPortalStyle");
            thlPortalStyle ? set_text_size() : set_style({theme: 'theme1', font: 'font1', kern: 'kern1'});
            //jQuery('.bnrs a').each(function() {this.title = jQuery(this).find('img').attr('alt')});
            //jQuery('.cab b.title').each(function() {jQuery('body').addClass('__logged_in')});

        }

        setHints(!isSpecTheme);

    };

    if (readCookie("thlPortalStyle")) {
        document.write(cssHtml);
        jQuery(function($) {
            set_text_size();
            //$('.bnrs a').each(function () {this.title = jQuery(this).find('img').attr('alt')});
            //jQuery('.cab b.title').each(function() {jQuery('body').addClass('__logged_in')});
            setHints(true);
        });

        tell_childs();
    }


}

handle_easy();

jQuery(function($) {
    $('.spec_version').addClass('_nohint').tooltip({animation:false, placement:'bottom', title:'Версия для слабовидящих', container:'body'});
})