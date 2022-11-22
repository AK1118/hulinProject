function searchGiantInit(moduleid, layout, options) {

  //绑定手机搜索框的事件
  function bindSearchMobileEvent() {
    $('#searchMobile_' + moduleid + '.module-search-mobile input[name=mobileKeyword]').off('keypress.submit').on('keypress.submit', function (evt) {
      evt = evt || window.event;
      if (evt.keyCode == 13) {
        syncData(2);
        formSumbit($('#search_' + moduleid));
        return false;
      }
    });
    var flag = 0;

    //弹出搜索页面
    $('#search_' + moduleid + ' :text[name=Keyword]').off('click.mobile').on('click.mobile', function (evt) {
      if ($(window).width() < 768 && $(this).is(':focus') && $('#searchMobile_' + moduleid).is(':visible')) {
        evt.preventDefault();
        $(this).blur();
        $('#searchMobile_' + moduleid + '.module-search-mobile').animate({
            right: '0px',
            opacity: '1'
          },
          500, function () {
            $('#searchMobile_' + moduleid + '.module-search-mobile :text[name=mobileKeyword]').focus();
            syncData(1);
          });
        flag = 1;
      }
    });
    //隐藏搜索页面
    $('#searchMobile_' + moduleid + ' .search-mobile-back').off('click.back').on('click.back', function () {
      if ($('.search-select-mobile-dropdown-container.module' + moduleid + ' .btn-group').length > 0) {
        $('#searchMobile_' + moduleid + ' .search-type-list .dropdown-toggle').click();
      }
      setTimeout(function () {
        $('#searchMobile_' + moduleid + '.module-search-mobile').animate({
            right: '-992px',
            opacity: '0'
          },
          500, function () {
            syncData(2);
            flag = 0;
          });
      }, 600)


    });
    document.addEventListener('touchmove', function (event) {
      if (flag == 1) {
        event.preventDefault();
      }
    })

    $('#searchMobile_' + moduleid + ' .search-mobile-button').off().on('click', function (evt) {
      syncData(2);
      formSumbit($('#search_' + moduleid));
      return false;
    });

    addScript('/scripts/bootstrap/bootstrap-select/js/bootstrap-select.min.js', function () {
      $('#searchMobile_' + moduleid + ' .search-type-list').selectpicker({
        width: 'fit',
        container: '.search-select-mobile-dropdown-container.module' + moduleid,
        mobile: isMobileBroswer()
      });
      $('#module_' + moduleid + ' .searchTypePanel select').selectpicker({
        width: 'fit',
        container: '.ModuleSearchSelectDropdownContainer.module' + moduleid,
        mobile: isMobileBroswer()
      });
      if ( $.inArray(parseInt(layout), [109, 110, 111]) > -1 ) {
        var colorRes = {
          'black':['#f6f6f6','#575757','#000000'],
          'blue':['#f1f5f8','#445464','#1e88e5'],
          'brown':['#f3efee','#56504f','#6b3a2b'],
          'cyan':['#10aa9c','#ecf8f7','#303a39'],
          'green':['#f1f9f1','#3b4a3c','#4caf50'],
          'orange':['#fff4ee','#3a322d','#fd6e27'],
          'pink':['#feedf3','#3b3135','#ed1f65'],
          'purple':['#f8edfa','#4f4950','#a41ebb'],
          'red':['#feebec','#434242','#f10215'],
          'yellow':['#fffcef','#3e3b31','#ffd231']
        }

        for ( i in colorRes ) {
          if ( options['SearchColor'] == i ) {
            console.log(colorRes[i]);
            var HoverBgStyle = colorRes[i][0];
            var FontStyle = colorRes[i][1];
            var HoverStyle = colorRes[i][2];
          }
        }

        var style = '<style>';
        style += '.module' + moduleid + ' .dropdown-menu>li>a{color:'+ FontStyle +';outline: none;font-size: 14px !important;}';
        style += '.module' + moduleid + ' .dropdown-menu>li>a:focus,.module' + moduleid + ' .dropdown-menu>li>a:hover{color:'+ HoverStyle +';background-color:'+ HoverBgStyle +';}';
        style += '.bootstrap-select.btn-group .dropdown-menu.inner{overflow:hidden !important} .bootstrap-select.btn-group .dropdown-menu.open{overflow:initial !important} .bootstrap-select.btn-group .dropdown-menu.open::after{content: \'\';width: 0;height: 0;border: 10px solid;border-color: transparent transparent #ffffff;position: absolute;top: -20px;left: 50%;transform: translateX(-50%);}';
        style += '</style>';

        $('#module_' + moduleid + ' .dropdown-menu.open').before(style);
        $('#module_' + moduleid + ' .dropdown-menu.open').css({'margin-top':'20px','border': '0px','box-shadow': '0px 0px 18px 5px rgb(0 0 0 / 9%)'});
        $('#module_' + moduleid + ' .dropdown-menu.open ul li').css({'border-bottom':'0px'});
        $('#module_' + moduleid + ' .dropdown-menu.open ul li a').css({'padding-top':'10px','padding-bottom':'10px','margin-left':'5px','margin-right':'5px','text-align':'center'});
      }
      $('#module_' + moduleid + ' .dropdown-menu,#searchMobile_' + moduleid + ' .dropdown-menu').css('opacity', $('#module_' + moduleid).css('opacity')).find('a').css('fontSize', '12px');
    });
  }

  $('#module_' + moduleid + ' .btnicon').off().on('click',function(){
      $('#module_' + moduleid ).find('.ModuleSearchForm ').addClass('searchform-fixed');
      $('#module_' + moduleid ).find('.content').addClass('searchform-slide');
      $('#module_' + moduleid ).find('.ModuleSearchForm').addClass('searchform-fade');
      $('#module_' + moduleid ).find('.content').css('opacity','1');
      $('#module_' + moduleid ).find('.content').css('visibility','visible');
      $('#module_' + moduleid ).find('.index_mark').css('display','block');
	})
  $('#module_' + moduleid + ' #menu-close').off().on('click',function(){
    $('#module_' + moduleid ).find('.btnicon').css('display','block');
    $('#module_' + moduleid ).find('.ModuleSearchForm ').removeClass('searchform-fixed');
    $('#module_' + moduleid ).find('.content').removeClass('searchform-slide');
		$('#module_' + moduleid ).find('.ModuleSearchForm').removeClass('searchform-fade');
		$('#module_' + moduleid ).find('.content').css('opacity','0');
    $('#module_' + moduleid ).find('.content').css('visibility','hidden');
    $('#module_' + moduleid ).find('.index_mark').css('display','none');


	})

  //弹出框和非弹出框输入的数据做一下同步
  function syncData($type) {
    $type = $type || 1;//1为正常输入框同步到弹出框 2为弹出框同步到正常输入框
    if ($type == 1) {
      var searchItem = $('#module_' + moduleid + ' .searchTypePanel select').val(),
        searchKey = $('#search_' + moduleid + ' :text[name=Keyword]').val();
      $('#searchMobile_' + moduleid + ' input[name=mobileKeyword]').val(searchKey);
      $('#searchMobile_' + moduleid + ' .search-type-list').val(searchItem);
      $('#searchMobile_' + moduleid + ' .search-type-list').selectpicker('render');
    } else {
      var searchItem = $('#searchMobile_' + moduleid + ' .search-type-list').val(),
        searchKey = $('#searchMobile_' + moduleid + ' input[name=mobileKeyword]').val();
      $('#search_' + moduleid + ' :text[name=Keyword]').val(searchKey);
      $('#module_' + moduleid + ' .searchTypePanel select').val(searchItem);
      $('#module_' + moduleid + ' .searchTypePanel select').selectpicker('render');
    }
  }

  //提交表单，并且提交关键字SEO分析
  function formSumbit(form) {
    if (form) {
      // 如果表单存在这个节点并且值为空就赋值，用于做是否在编辑状态下的判断
      if ($(form).find('input[name="view"]')) {
          if ($(form).find('input[name="view"]').val() == '') {
              $(form).find('input[name="view"]').val('1')
          }
      }
      //提交关键字SEO分析
      $.post("/index.php?c=front/Seo&a=keywordParse", form.serializeArray());
      //提交查询表单
      //form.submit();
      if($(form).find(':text[name=Keyword]').val() == ''){
        var tips = '请输入需要搜索的内容'
        if(getCookie('Lang') == 'cn' || getCookie('Lang') == 'big5') {
          if(getCookie('Lang') == 'big5') tips = '請輸入需要蒐索的內容'
        }
        else tips = 'Please enter the content you want to search'
        alert(tips)
      }else{
        form.submit();
      }
    }
  }

  $('#search_' + moduleid + ' :text[name=Keyword]').off('keypress.submit').on('keypress.submit', function (evt) {
    evt = evt || window.event;
    if (evt.keyCode == 13) {
      formSumbit($(this).closest('form'));
      return false;
    }
  });

  $('#search_' + moduleid + ' .searchIcon,#search_' + moduleid + ' button[type="submit"]').off().on('click', function (evt) {
    formSumbit($(this).closest('form'));
    return false;
  });

  if ($('.ModuleSearchSelectDropdownContainer.module' + moduleid).length == 0) {
    $('body').append('<div class="ModuleSearchSelectDropdownContainer module' + moduleid + '"></div>');
  }
  if ($('.search-select-mobile-dropdown-container.module' + moduleid).length == 0) {
    $('body').append('<div class="search-select-mobile-dropdown-container module' + moduleid + '"></div>');
  }

  $(function () {


    var mobileSearch = $('#search_' + moduleid + " #searchMobile_" + moduleid).clone();
    $("body #searchMobile_" + moduleid).remove();
    $('body').append(mobileSearch);
    bindSearchMobileEvent();
    var searchform = $('#search_' + moduleid);
    if (window.location.getQueryString('view') == '1') {
      $('#search_' + moduleid).find('input[name="view"]').val('1');
    }
    if(window.location.pathname == '/PageSearch' && $(window).width() < 768 && window['CanDesign']!= 'True'){
      if(window.location.getQueryString('isSearch') == 1)
      {
        $('#module_'+moduleid).css('cssText','position:fixed;top:0');
      }
      $('#search_' + moduleid + ' :text[name=Keyword]').focus()
      $('#search_' + moduleid + ' :text[name=Keyword]').click()
      $('#searchMobile_' + moduleid + ' .search-mobile-back').off('click.back').on('click.back', function () {
        //window.location.href = '/';
        history.back(-1)
      })
    }
    $('#search_' + moduleid + ' .searchTypePanel select,#searchMobile_' + moduleid + ' .search-type-list').change(function () {
      if ($(this).val() == '1') {
        searchform.attr('action', options['NVAProductList'] + '/0');
      }
      if ($(this).val() == '2') {
        searchform.attr('action', options['NVANewsList'] + '/0');
      }
      if ($(this).val() == '3') {
        searchform.attr('action', options['NVADownList'] + '/0');
      }
    });
  });
}