$(document).ready(function() {
    CurrentUserEmail = "";
    CodeGetEmail();
    TC_PageAccountInit();
    if (!CurrentUserEmail) {
        CodePanel();
    } else {
        InitializeX();
        window.setTimeout(function() {
            TC_SmartLearn();
        }, 1000);
    }
});
var myThreadNumber = (new Date()).getTime();

var ActiveTextarea = null;

function InitializeX() {
    document.title = "Build Testcases - " + myThreadNumber + " " + CurrentUserEmail;
    var fname = String(CurrentUserEmail).substr(0, 1).toLocaleUpperCase()
    $('#divTopBar').find('td.tdbutton.user').html(fname).attr("title", CurrentUserEmail);
    //$('#divTopBar').find('td.tdbutton.user').html("<div class='divUserName'>" + fname + "</div>").attr("title",CurrentUserEmail);
    $("#divMyAccount div.xclose").show();

    TC_PageListFiltersInit();
    TC_TeamRefresh();

    $('#divTopBar td.tdbutton').unbind().bind({
        mouseover: function() {
            this.style.background = '#707070';
        },
        mouseout: function() {
            if (!$(this).data('selected')) {
                this.style.background = '#303030';
            }
        },
        click: function() {
            $("#divTCPreview").hide();
            $('#div_copy').slideUp();
            HistoryIDdata = {};

            if (!($(this).hasClass('smart') || $(this).hasClass('save') || $(this).hasClass('status'))) {
                $('#div_smart').slideUp();
                TC_SmartResize("");
            }

            if (! ($(this).hasClass('list') || $(this).hasClass('listonly')) ) {
                $('#divTopBar td.tdbutton.listonly').hide();
            }

            if ($(this).hasClass('list')) {
                $('#divTopBar').find('td.tdbutton').data('selected', 0).css({ 'background': '#303030' });
                $(this).data('selected', 1).css({ 'background': '#707070' });
                $('#divList').show();
                $('#divTestcase').hide();
                $('#divTopBar').find('td.tdbutton').not('.list').not('.new').not('.user').not('.listonly').hide();
                $('#divTopBar td.tdbutton.listonly').show();
                if (!$(this).data("loadedlist")) {
                    $('#divTopBar td.tdbutton.refresh-list').click();
                    $(this).data("loadedlist", 1);
                } else {
                    TC_ListHeight();
                }

            } else if ($(this).hasClass('refresh-list')) {
                TC_ListGet();
            } else if ($(this).hasClass('copy-list')) {
                TC_Copy_ListSelect(this);

            } else if ($(this).hasClass('columns-list')) {
                TC_ListResize(1, "TC_PageListFiltersInit");

            } else if ($(this).hasClass('search-list')) {
                if ($('#divList_filter tr.search div.divsearch').css("display") == "none") {
                    $('#divList_filter td.tdlistspace.s2').slideDown(100);
                    $('#divList_filter tr.search div.divsearch').slideDown(200, function() {
                        TC_ListHeight();
                    });
                } else {
                    $('#divList_filter td.tdlistspace.s2').slideUp(100);
                    $('#divList_filter tr.search div.divsearch').slideUp(200, function() {
                        TC_ListHeight();
                    });
                }

            } else if ($(this).hasClass('export-list')) {
                TC_Export_Selected();

            } else if ($(this).hasClass('user')) {
                CodePanel();

            } else if ($(this).hasClass('new')) {
                //TC_Save();
                TC_Display(null);

            } else if ($(this).hasClass('save')) {
                TC_Save(1);

            } else if ($(this).hasClass('closemore')) {
                $('#divTopBar td.tdbutton.more').click();

            } else if ($(this).hasClass('more') && !$(this).hasClass('XM')) {
                if ($('#divTopBar div.divMore').css("display") == "none") {
                    $('#divTopBar div.divMore').slideDown(100, function() {
                        $('#divTopBar div.divMore').css({ left: (30 - $('#divTopBar div.divMore').get(0).offsetWidth) + "px" });
                    });
                } else {
                    $('#divTopBar div.divMore').slideUp();
                }

            } else if ($(this).hasClass('status')) {
                if ($('#divTopBar').find('input.txttitle').data("status") == "Inwork") {
                    TC_UpdateStatus("Done");
                } else {
                    TC_UpdateStatus("Inwork");
                }

            } else if ($(this).hasClass('export')) {
                TC_Export();

            } else if ($(this).hasClass('preview')) {
                $('#divTopBar').find('td.tdbutton').data('selected', 0).css({ 'background': '#303030' });
                $(this).data('selected', 1).css({ 'background': '#707070' });
                $('#divList').hide();
                $('#divTestcase').hide();
                $("#divTCPreview").show();
                TC_StepsPreview();

            } else if ($(this).hasClass('prerequisites')) {
                $('#divTopBar').find('td.tdbutton').data('selected', 0).css({ 'background': '#303030' });
                $(this).data('selected', 1).css({ 'background': '#707070' });
                $('#divTestcase').show();
                $('#divTestcase_prerequisites').show();
                $('#divTestcase_steps').hide();
                $('#divTestcase_history').hide();
                TC_PrereResize()

            } else if ($(this).hasClass('steps')) {
                $('#divTopBar').find('td.tdbutton').data('selected', 0).css({ 'background': '#303030' });
                $(this).data('selected', 1).css({ 'background': '#707070' });
                $('#divTestcase').show();
                $('#divTestcase_prerequisites').hide();
                $('#divTestcase_steps').show();
                $('#divTestcase_history').hide();
                $('#divAllSteps').css({ height: ($('#divTestcase').get(0).offsetHeight - $('#divStepsHeader').get(0).offsetHeight - 10) + 'px' });

            } else if ($(this).hasClass('history')) {
                $('#divTopBar').find('td.tdbutton').data('selected', 0).css({ 'background': '#303030' });
                $(this).data('selected', 1).css({ 'background': '#707070' });
                $('#divTestcase').show();
                $('#divTestcase_prerequisites').hide();
                $('#divTestcase_steps').hide();
                $('#divTestcase_history').show();
                TC_HistoryList();

            } else if ($(this).hasClass('copy')) {
                if ($('#divTopBar').find('input.txttitle').data("status") == "Done") {
                    StatusShow(5, "<div style='color:red;background:yellow;padding:10px' >This Testcase is done, can not copy from any of others!</div>");
                    return;
                }
                TC_CopyListGet();

            } else if ($(this).hasClass('story')) {
                TC_StoryInit();

            } else if ($(this).hasClass('smart')) {
                if (!$('#div_smart').data("onside")) {
                    $('#div_smart').data("onside", "right");
                }
                if ($('#div_smart').css("display") != 'none') {
                    $('#div_smart').data("smarton", 0);
                    $('#div_smart').slideUp(
                        200,
                        function() {
                            TC_SmartResize($('#div_smart').data("onside"));
                        });
                } else {
                    $('#div_smart').data("smarton", 1);
                    $('#div_smart').slideDown(
                        200,
                        function() {
                            TC_SmartResize($('#div_smart').data("onside"));
                        });
                }

            }

            TC_TitleWidth();
            stopPropagation();
        }
    });

    $('#divTestcase_prerequisites div.divCoverageDetail div.titlex').css({ cursor: 'pointer' }).unbind().bind({
        mouseover: function() { this.style.background = '#D0D0D0' },
        mouseout: function() { this.style.background = '#E0E0E0' },
        click: function() {
            var eids = {};
            $("#divCoverageDetail div.contentx div.story").each(function() {
                if ($(this).data("dbid")) {
                    eids[$(this).data("dbid")] = 1;
                }
            });

            TC_StoryOpenList("divCoverageDetail", eids);
        }
    });

    TC_SmartInit("bottom");

    $('#div_copy').find('td.tdbutton').unbind().bind({
        mouseover: function() { this.style.background = '#707070' },
        mouseout: function() { this.style.background = '#303030' },
        click: function() {
            if ($(this).hasClass('go')) {
                if ($('#sel_copy_idxs').val()) {
                    TC_Copy($('#sel_copy_idxs').val(), null, this, "copy");
                } else {
                    StatusShow(5, "<div style='color:red;background:yellow;padding:10px' >Please select one item!</div>");
                }
            } else if ($(this).hasClass('append')) {
                if ($('#sel_copy_idxs').val()) {
                    TC_Copy($('#sel_copy_idxs').val(), null, this, "append");
                } else {
                    StatusShow(5, "<div style='color:red;background:yellow;padding:10px' >Please select one item!</div>");
                }
            } else if ($(this).hasClass('cancel')) {
                $('#div_copy').slideUp()
            }
        }
    });

    $('#div_copy').find('input.txtfilter_copy').unbind().bind({
        click: function() {
            if (!$('#sel_copy_idxs').data("setwidth")) {
                $('#sel_copy_idxs').css({
                    width: $('#sel_copy_idxs').get(0).offsetWidth + "px",
                    height: $('#sel_copy_idxs').get(0).offsetHeight + "px"
                });

                $(this).css({ width: ($('#sel_copy_idxs').get(0).offsetWidth - 10) + "px" });

                $('#sel_copy_idxs').data("setwidth", 1);
            }
        },

        keyup: function() {
            var inpv = $(this).val().replace(/^\s+|\s+$/g, '').replace(/\s+/g, '\\\s*.*');
            if (inpv.length) {
                $(this).css({ background: "#FFFFCC" });

                $('#sel_copy_idxs').find("option").each(function() {
                    if (String($(this).html()).match(new RegExp(inpv, "i"))) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            } else {
                $(this).css({ background: "" });
                $('#sel_copy_idxs').find("option").show();
            }

            var idx = $('#divTopBar').find('input.txttitle').data('idx');
            if (idx) {
                $('#sel_copy_idxs').find("option.IDX" + idx).hide();
            }
        }
    });

    
    TC_TitleWidth();
    $('#divTopBar').find('input.txttitle').bind({
        blur: function() {
            var name = String($(this).val()).replace(/^\s*|\s*$/, '');
            $(this).val(name);

            if (!name) {
                $(this).css('background', '#FFFF66');
            } else {
                $(this).css('background', '#D0D0D0');
            }
        },
        click: function() {
            $('#divTopBar').find('td.tdbutton').data('selected', 0).css({ 'background': '#303030' });
            $('#divList').hide();
            $('#divTestcase').show();
            $('#divTopBar').find('td.tdbutton').not('.list').not('.new').show();
            $('#divTopBar').find('td.tdbutton.steps').click();
        }
    });
    //$('#divAllSteps').css({height: (ws[1] - 30 - $('#divTopBar').get(0).offsetHeight - $('#divStepsHeader').get(0).offsetHeight) + 'px'});

    $('#divStepsHeader').find('td.addstep').unbind().bind({
        mouseover: function() { this.style.background = '#707070' },
        mouseout: function() { this.style.background = '' },
        click: function() {
            TC_StepsAdd();
        }
    }).css({ color: 'red', cursor: 'pointer' });


    $('#divStepsHeader').find('td.tdsteps.DBL').unbind().bind({
        mouseover: function() { $(this).find('div').get(0).style.color = '#0066FF' },
        mouseout: function() { $(this).find('div').get(0).style.color = '#707070' },
        dblclick: function() {
            var colNums = Array();
            if ($(this).hasClass('CN1')) {
                colNums.push(1);
            } else if ($(this).hasClass('CN2')) {
                colNums.push(2);
            } else {
                colNums.push(1, 2);
            }

            for (var i = 0; i < colNums.length; i++) {
                var colNum = colNums[i];
                $('#divAllSteps').find('textarea.C' + colNum).each(function() {
                    $(this).scrollTop(100000);
                    var srtop = $(this).scrollTop();
                    if (srtop) {
                        thisx = this;
                        var rowNum = $(this).data('rownum');
                        $(thisx).animate({
                                'height': (srtop + thisx.offsetHeight - 10) + 'px'
                            },
                            500,
                            function() {
                                TC_StepsTableRowHeight(rowNum);
                            }
                        );
                    }
                });
            }

        }
    });

    var ws = winDimensions();
    $('#divAllSteps').find('textarea').css({ width: (ws[0] - 220) / 2 + 'px' });
    /*
    $('#divAllSteps').resize(function() {
        var ws = winDimensions(); 
        if(!ActiveTextarea){ 
            $('#divAllSteps').find('textarea').css({width: (ws[0] - 170)/2 + 'px'}); 
        }
        TC_StepsTableColWidth();
    });
    */

    $("#divTestcase_prerequisites textarea").unbind().bind({
        keyup: function(ev) {
            ev = ev || window.event;
            TC_InputCheck(this);

            if (ev.keyCode == 13) { //enter
                TC_InputLineStyleAuto(this);
                return;
            } else if (ev.keyCode == 18) { //Alt
                $(this).data("alt_key_down", 0);
            }
        },

        keydown: function(ev) {
            ev = ev || window.event;
            if (ev.keyCode == 18) { //Alt
                $(this).data("alt_key_down", 1);
            } else if (ev.keyCode == 73 && $(this).data("alt_key_down")) { //alt + i
                TC_InputIndent(this, "indent");
            } else if (ev.keyCode == 85 && $(this).data("alt_key_down")) { //alt + u
                TC_InputIndent(this, "unindent");
            }
        },
    });

    $("#divTestcase_prerequisites div.title").css({ cursor: 'pointer' }).attr("title", "click to show/hide this column").unbind().bind({
        mouseover: function() { this.style.background = '#F0F0F0' },
        mouseout: function() { this.style.background = "" },
        click: function() {
            var side = "left";
            if ($(this).hasClass("right")) {
                side = "right";
            }

            var div = $("#divTestcase_prerequisites td." + side).find("div.content");
            if (div.css("display") == "none") {
                div.show();
                TC_PrereResize(side, "show", div);
            } else {
                div.hide();
                TC_PrereResize(side, "hide", div)
            }
        }
    });

    TC_StepsEvents();

    window.setTimeout(function() {
        $('#divTopBar').find('td.tdbutton.list').click();
    }, 500);
}

function TC_TitleWidth()
{
    var ws = winDimensions();
    var c = 1;
    $('#divTopBar td.M').each(function(){
        if(this.style.display != 'none'){
            c++;
        }
    });
    var tw = ws[0] - c * 80;
    if (tw > 800) {
        tw = 800
    }
    $('#divTopBar').find('input.txttitle').css({ width: tw + 'px' });
}

function TC_PrereResize(side, act, div) {
    var ws = winDimensions();
    if (side) {
        var opside = side == "left" ? "right" : "left";
        var opdiv = $("#divTestcase_prerequisites td." + opside).find("div.content");

        if (act == "show") {
            if (opdiv.css("display") == "none") {
                div.css({ width: (ws[0] - $("#divTestcase_prerequisites td." + opside).get(0).offsetWidth - 25) + 'px' });

                if (side == "left") {
                    $('#divTestcase_prerequisites').find('textarea.prere').css({
                        width: ($('#divTestcase_prerequisites').find('td.left').find('div.content').get(0).offsetWidth - 26) + 'px',
                    });
                } else {
                    $('#divTestcase_prerequisites').find('textarea.coverage').css({
                        width: ($('#divTestcase_prerequisites').find('td.right').find('div.content').get(0).offsetWidth - 26) + 'px',
                    });

                    $('#divTestcase_prerequisites').find('div.divCoverageDetail').css({
                        width: ($('#divTestcase_prerequisites').find('td.right').find('div.content').get(0).offsetWidth - 16) + 'px',
                    });

                    $("#divCoverageDetail div.contentx").css({ height: ($("#divCoverageDetail").get(0).offsetHeight - $("#divCoverageDetail div.titlex").get(0).offsetHeight - 16) + "px" });
                }
            } else {
                TC_PrereResize();
            }

            if (side == "right") {
                TC_StoryCoveredNameWith();
            }
        } else if (opdiv.css("display") != "none") {
            opdiv.css({ width: (ws[0] - $("#divTestcase_prerequisites td." + side).get(0).offsetWidth - 25) + 'px' });

            if (opside == "left") {
                $('#divTestcase_prerequisites').find('textarea.prere').css({
                    width: ($('#divTestcase_prerequisites').find('td.left').find('div.content').get(0).offsetWidth - 26) + 'px'
                });
            } else {
                $('#divTestcase_prerequisites').find('textarea.coverage').css({
                    width: ($('#divTestcase_prerequisites').find('td.right').find('div.content').get(0).offsetWidth - 26) + 'px'
                });

                $('#divTestcase_prerequisites').find('div.divCoverageDetail').css({
                    width: ($('#divTestcase_prerequisites').find('td.right').find('div.content').get(0).offsetWidth - 16) + 'px'
                });

                $("#divCoverageDetail div.contentx").css({ height: ($("#divCoverageDetail").get(0).offsetHeight - $("#divCoverageDetail div.titlex").get(0).offsetHeight - 16) + "px" });

                TC_StoryCoveredNameWith();
            }
        } else {
            TC_PrereResize();
        }

    } else {
        $('#divTestcase_prerequisites').find('div.content').show().css({
            width: (ws[0] / 2 - 25) + 'px',
            height: (ws[1] - 35 - $('#divTopBar').get(0).offsetHeight - $('#divTestcase_prerequisites').find('tr.title').get(0).offsetHeight) + 'px'
        });

        $('#divTestcase_prerequisites').find('textarea.prere').css({
            width: ($('#divTestcase_prerequisites').find('td.left').find('div.content').get(0).offsetWidth - 26) + 'px',
            height: ($('#divTestcase_prerequisites').find('td.left').find('div.content').get(0).offsetHeight - 26) + 'px'
        });

        $('#divTestcase_prerequisites').find('textarea.coverage').css({
            width: ($('#divTestcase_prerequisites').find('td.right').find('div.content').get(0).offsetWidth - 26) + 'px',
            height: ($('#divTestcase_prerequisites').find('td.right').find('div.content').get(0).offsetHeight - 26) * 0.1 + 'px'
        });

        $('#divTestcase_prerequisites').find('div.divCoverageDetail').css({
            width: ($('#divTestcase_prerequisites').find('td.right').find('div.content').get(0).offsetWidth - 16) + 'px',
            height: ($('#divTestcase_prerequisites').find('td.right').find('div.content').get(0).offsetHeight - 20 - $('#divTestcase_prerequisites').find('textarea.coverage').get(0).offsetHeight) + 'px'
        });

        $("#divCoverageDetail div.contentx").css({ height: ($("#divCoverageDetail").get(0).offsetHeight - $("#divCoverageDetail div.titlex").get(0).offsetHeight - 16) + "px" });

        TC_StoryCoveredNameWith();
    }
}

function TC_PageListFiltersInit() {
    $('#divList_filter tr.search td.tdlistsearch div.divsearch div.content tr.fixed .fixed').not('.logic.groupstart').attr("disabled", true).css({ color: "gray" });
    $('#divList_filter tr.search input.txtsearch.value.n1').val(CurrentUserEmail);

    $('#divList_filter tr.search td.tdsearch div.button2').unbind().bind({
        mouseover: function() { this.style.background = '#F0F0F0' },
        mouseout: function() { this.style.background = '' },
        click: function() {
            if ($(this).hasClass("search")) {
                TC_ListGet();
            } else if ($(this).hasClass("add")) {
                $(this).parent().parent().parent().append(
                    `<tr class='condition' >
                        <td class='tdsearch' >
                            <select class='selectsearch logic groupstart'>
                                <option value=''>&nbsp;</option>
                                <option value='('>(</option>
                            </select>
                        </td>

                        <td class='tdsearch' >
                            <select class='selectsearch field'>
                                <option value='idx'>ID</option>
                                <option value='name'>Name</option>
                                <option value='module'>Module</option> 
                                <option value='status'>Status</option>   
                                <option value='created_by'>Created By</option>                                                     
                                <option value='updated_by'>Updated By</option>
                                <option value='updated_when'>Updated Date</option>
                            </select>
                        </td>
                        <td class='tdsearch' >
                            <select class='selectsearch logic x'>
                                <option class='equal'        value='='>=</option>
                                <option class='lessthan'     value='&lt;'>&lt;</option>
                                <option class='notgreatthan' value='&lt;='>&lt;=</option>
                                <option class='greatthan'    value='&gt;'>&gt;</option>
                                <option class='notleassthan' value='&gt;='>&gt;=</option>
                                <option class='notequal'     value='&lt;&gt;'>&lt;&gt;</option>
                                <option class='contains'     value='LIKE'>contains</option>
                            </select>
                        </td>
                        <td class='tdsearch value'>
                            <input class='txtsearch value'  type='text' />
                        </td>

                        <td class='tdsearch' >
                            <select class='selectsearch logic groupeend'>
                                <option value=''>&nbsp;</option>
                                <option value=')'>)</option>
                            </select>
                        </td>

                        <td class='tdsearch' >
                            <select class='selectsearch logic andor'>
                                <option value='AND'>AND</option>
                                <option value='OR'>OR</option>
                            </select>
                        </td>

                        <td class='tdsearch '><div class='button2 delete' style='color:red' >&nbsp;x&nbsp;</div></td>
                    </tr>`
                );

                $('#divList_filter tr.search div.button2.delete').unbind().bind({
                    mouseover: function() { this.style.background = '#F0F0F0' },
                    mouseout: function() { this.style.background = '' },
                    click: function() {
                        $(this).parent().parent().remove();
                        TC_PageListFilterSearchHeight()
                    }
                });

                $('#divList_filter tr.search select.selectsearch.field').unbind().bind({
                    change: function() {
                        $(this).parent().parent().find('select.selectsearch.logic.x option').show();
                        $(this).parent().parent().find('input.txtsearch.value').attr("title", "");

                        if ($(this).val() == 'created_by' || $(this).val() == 'updated_by') {
                            $(this).parent().parent().find('select.selectsearch.logic.x').val("LIKE").find('option').not(".contains").hide();

                        } else if ($(this).val() == 'updated_when') {
                            $(this).parent().parent().find('select.selectsearch.logic.x').val(">").find('option.contains').hide();
                            $(this).parent().parent().find('select.selectsearch.logic.x').find('option.equal').hide();
                            $(this).parent().parent().find('input.txtsearch.value').attr("title", "date format must be: YYYY-MM-DD");
                        }
                    }
                });

                TC_PageListFilterSearchHeight()
            }
        }
    });

    $('#divList_list').unbind().bind({
        scroll: function() {
            $('#divList_filter').scrollLeft($('#divList_list').scrollLeft());
        },
    });

    $('#divList_filter tr.search td.tdcoulmns-display td.tdlisth').not(".CN0").not(".CN1").not(".CN2").css({ cursor: "pointer" }).unbind().bind({
        mouseover: function() { this.style.background = '#F0F0F0' },
        mouseout: function() { this.style.background = '' },
        click: function() {
            if ($(this).data("display")) {
                $(this).data("display", 0);
                $(this).css({ color: "#E0E0E0" });

                $('#divList_filter table.table_headers tr').find("td:eq(" + $(this).data("colnum") + ")").hide();
                $('#divList_list   table tr').find("td:eq(" + $(this).data("colnum") + ")").hide();
                $('#divTopBar td.tdbutton.columns-list').click();
            } else {
                $(this).data("display", 1);
                $(this).css({ color: "#000000" });

                $('#divList_filter table.table_headers tr').find("td:eq(" + $(this).data("colnum") + ")").show();
                $('#divList_list   table tr').find("td:eq(" + $(this).data("colnum") + ")").show();
                $('#divTopBar td.tdbutton.columns-list').click();
            }
        }
    });
}

function TC_PageListFilterSearchHeight() {
    $('#divList_filter tr.search td.tdsearch div.button2.search').css({
        "height": "",
        "line-height": ""
    });

    window.setTimeout(function() {
        $('#divList_filter tr.search td.tdsearch div.button2.search').css({
            "height": ($('#divList_filter tr.search td.tdsearch div.button2.search').parent().get(0).offsetHeight - 20) + "px",
            "line-height": ($('#divList_filter tr.search td.tdsearch div.button2.search').parent().get(0).offsetHeight - 20) + "px"
        });
    }, 100, );
}

function TC_StoryInit() {
    var divstory = $("#divStory");
    if (divstory.lenght) {
        divstory.remove();
    }
    $("body").append(
        `<div class = 'div_story' id='divStory' >
            <div class='title'   style='padding:0px;background:#303030;color:#FFFFFF;text-align: center;font-weight: bold;height: 50px;line-height:50px;' >Story</div>
            <div class='content' style='padding:0px;overflow:auto;' >
                <div class='cmd' style='padding:5px;text-align:left;background:#E0E0E0' >
                    Story Name
                    <input class='txtStoryID' type='text' style='width:60px;font-weight:bold;color:blue' title='Story ID' />
                    <input class='txtfilter'  type='text' style='width:50%;font-weight:bold;color:blue'  title='Story name' />&nbsp;&nbsp;
                    <input class='button new'      type='button' value='New'    style='padding:5px;width:60px' />&nbsp;
                    <input class='button num'      type='button' value='Number' style='padding:5px;width:60px' title='Number each line'/>&nbsp;
                    <input class='button save'     type='button' value='Save'   style='padding:5px;width:60px' />&nbsp;
                    <input class='button open'     type='button' value='Open'   style='padding:5px;width:60px' />&nbsp;
                    <input class='button close'    type='button' value='Close'  style='padding:5px;width:60px' />
                </div>     
                <div style='padding:5px;text-align:left;position:relative' >   
                    <div class='list divStoryList' style='' >Story List</div>                     
                    <table></tr>    
                        <td >
                            <div class='richtext' contenteditable=true title='Richtext Field' data-widthpercent=0.1 data-synctext=1 ></div>
                        </td>  
                        <td><textarea class='content' data-string=''  data-widthpercent=0.1 
                                      title='Plaintext Field&#10&#10Hot keys:&#10 [Alt + i] or right-click: Indent the selected line&#10 [Alt + u]: Unindent the selected line' wrap=off ></textarea>
                        </td>

                        <td><textarea class='used' readonly=true data-widthpercent=0.1 
                                      title='These are the lines have been covered;&#10Double-click to change width' 
                                      style='color:green;background:#F4F4F4' wrap=off ></textarea>
                        </td>
                    </tr></table>
                    
                </div>    
            </div>
        </div> `
    );

    TC_StoryWidthHeight(0.1);
    $("#divStory div.richtext").css({ overflow: "auto" }).unbind().bind({
        paste: function() {
            if ($(this).data('synctext')) {
                clipdata = window.event.clipboardData;
                if (clipdata) {
                    //console.log(clipdata);
                    //data = clipdata.getData("text/html");  
                    var str = $("#divStory textarea.content").val();
                    if (String(str).length) {
                        str = str + "\n";
                    }
                    $("#divStory textarea.content").val(str + clipdata.getData("text"));
                } else {
                    console.warn("failed to get clipboard!");
                }
            }
        },

        dblclick: function() {
            TC_StoryWidthHeight(0, "dblclick", this);
        },

        contextmenu: function(ev) {
            $("#divStory div.richtext").click();

            ev = ev || window.event;

            $(this).append(
                `<div class='right-click-menu' style='top:` + ev.pageY + `px; left:` + ev.pageX + `px' >
                    <div class='button7 del_all' title='Delete all contents' >Delete All</div>                    
                    <div class='button7 append_new_line' title='Add a new line' >Append New Line</div>
                    <div class='button7 synctext' title='Sync this to Plaintext field: ` + ($("#divStory div.richtext").data('synctext') ? "YES" : "NO") + `' >` +
                ($("#divStory div.richtext").data('synctext') ?
                    "<span class='span-chkbox' style='color:green;border-color:green'>✓</span>&nbsp;Sync Text" :
                    "<span class='span-chkbox' style='color:red;border-color:red'>✘</span>&nbsp;Sync Text") + `</div>
                    <div class='button7 close' title='Close this menu' >x</div>
                </div>`
            ).find("div.button7").css({ cursor: "pointer" }).unbind().bind({
                mouseover: function() { this.style.background = '#E0E0E0' },
                mouseout: function() { this.style.background = '' },
                click: function() {
                    if ($(this).hasClass("close")) {
                        $("#divStory div.richtext").click();

                    } else if ($(this).hasClass("del_all")) {
                        $("#divStory div.richtext").html("");

                    } else if ($(this).hasClass("synctext")) {
                        if ($("#divStory div.richtext").data('synctext')) {
                            $("#divStory div.richtext").data('synctext', 0);
                        } else {
                            $("#divStory div.richtext").data('synctext', 1);
                        }

                    } else if ($(this).hasClass("append_new_line")) {
                        $("#divStory div.richtext").append("<div><br /></div>");
                    }
                }
            });

            $("#divStory div.richtext div.right-click-menu").attr("contenteditable", false);
            return false;
        },

        click: function() {
            try {
                $(this).find("div.right-click-menu").remove();
            } catch (e) {
                //
            }

        },

    });

    $("#divStory textarea").css({ overflow: "auto" }).unbind().bind({
        keydown: function(ev) {
            if ($(this).hasClass("content")) {
                ev = ev || window.event;
                if (ev.keyCode == 18) { //Alt
                    $(this).data("alt_key_down", 1);
                } else if (ev.keyCode == 73 && $(this).data("alt_key_down")) { //alt + i
                    TC_InputIndent(this, "indent");
                } else if (ev.keyCode == 85 && $(this).data("alt_key_down")) { //alt + u
                    TC_InputIndent(this, "unindent");
                }
            } else if ($(this).hasClass("used")) {
                return false;
            }
        },

        keyup: function(ev) {
            if ($(this).hasClass("content")) {
                ev = ev || window.event;
                if (TC_InputCheck(this)) {
                    TC_StoryCoveredSync($(this).val(), StoryOpenIDData);
                }

                if (ev.keyCode == 13) { //enter
                    TC_InputLineStyleAuto(this);
                    return;
                } else if (ev.keyCode == 18) { //Alt
                    $(this).data("alt_key_down", 0);
                }

                TC_StorySync(this, $("#divStory textarea.used").get(0));
            }
        },

        dblclick: function() {
            TC_StoryWidthHeight(0, "dblclick", this);
        },

        mousedown: function(ev) {
            ev = ev || window.event;
            //console.log("mouse:",ev.which);
            if (ev.which == 3) {
                TC_InputIndent(this, "indent");
                ev.preventDefault();
                return;
            }
        },

        contextmenu: function() {
            return false;
        },

        mouseup: function() {
            var srltop = $(this).scrollTop();
            if (srltop) {
                if ($(this).hasClass("content")) {
                    $("#divStory textarea.used").scrollTop(srltop);
                } else {
                    $("#divStory textarea.content").scrollTop(srltop);
                }
            }

            if ($(this).hasClass("content")) {
                TC_StorySync(this, $("#divStory textarea.used").get(0));
            }
        },

        //scroll:function(){

        //}
    });

    $("#divStory div.content input.button").css({ cursor: 'pointer' }).unbind().bind({
        mouseover: function() {
            this.style.background = '#D0D0D0';
        },
        mouseout: function() {
            this.style.background = '#E0E0E0';
        },
        click: function() {
            if ($(this).hasClass("save")) {
                //$("#divStory div.content input.button.num").click();
                TC_StorySave(this);

            } else if ($(this).hasClass("new")) {
                $("#divStory div.content div.cmd input.txtStoryID").val("").css({ 'background': '#FFFFFF' });
                $("#divStory textarea.content").data("string", "").css({ 'background': '#FFFFFF' });
                $("#divStory textarea").val("");
                $("#divStory div.richtext").html("");

                var msg = "After finalize the story, <br />Please click the button [Number] to add line number into the story!";
                TC_StoryWarn(100, msg, 15);
                TC_StoryWidthHeight(0.1);
                $("#divStory div.content div.cmd input.txtfilter").val("").css({ 'background': '#FFFFFF' }).data("dbid", "").data("tmpid", "").focus(); //

            } else if ($(this).hasClass("num")) {
                TC_StoryNumberLines();

            } else if ($(this).hasClass("close")) {
                $("#divStory").remove();

            } else if ($(this).hasClass("open")) {
                TC_StoryOpenList("divStory")
            }
        }
    });

    var msg = "After finalize the story, <br />Please click the button [Number] to add line number into the story!";
    TC_StoryWarn(100, msg, 15);
}

function TC_StoryWarn(topx, msg, sec) {
    var tmpid = (new Date()).getTime();
    $('body').append(
        `<div class = 'div_status_bar' id='divTmp` + tmpid + `' title='click to close' >
            <div style='color:red;background:yellow;padding:10px' >` + msg + `</div>       
            <div class='div_count_down2' style='border-width:3px;border-color:red'></div>                     
        </div>`).find("#divTmp" + tmpid).css({
        top: topx + 'px',
        left: ($("#divStory div.richtext").get(0).offsetWidth + 5) + 'px',
        right: '',
        display: 'block',
        width: $("#divStory textarea.content").get(0).offsetWidth + 'px'
    }).bind({
        click: function() {
            $(this).remove();
        }
    });

    $("#divTmp" + tmpid + " div.div_count_down2").animate({ width: '0%' },
        sec * 1000,
        function() {
            $("#divTmp" + tmpid).remove();
        }
    );
}

function TC_StoryNumberLines() {
    var lines = $("#divStory textarea.content").val().split(/\n/);
    var isNumber = 0;
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].match(/^\[(\d+(\.\d+)*)\]\s+/)) {
            isNumber++;
        }
    }

    var mlen = String(lines.length).length;
    var numbers = new Array();
    for (var i = 0; i < lines.length; i++) {
        var ms = lines[i].match(/^\[(\d+(\.\d+)*)\]\s+/);
        if (ms && ms.length) {
            numbers.push(ms[1]);
            //console.log(ms);
        } else {
            if (isNumber && i >= 1) {
                var lastNs = String(numbers[i - 1]).split('.');
                //console.log("lastNs=",lastNs);
                if (lastNs.length > 1) {
                    var lastN = String(lastNs.pop()).replace(/^0+/, '');
                    lastN = (lastN ? lastN * 1 + 1 : 1);
                    numbers.push(lastNs.join('.') + '.' + (lastN < 100 ? xrepeat("0", 3 - String(lastN).length) : "") + lastN);
                } else {
                    numbers.push(lastNs[0] + '.001');
                }
            } else {
                numbers.push(i + '.000');
            }

            if (String(numbers[i]).length > mlen) {
                mlen = String(numbers[i]).length;
            }
        }
    }

    //console.log("numbers=", numbers);
    for (var i = 0; i < lines.length; i++) {
        var rp = mlen - String(numbers[i]).length;
        lines[i] = "[" + (rp > 0 ? xrepeat("0", rp) : "") + numbers[i] + "]  " + String(lines[i]).replace(/^\[(\d+(\.\d+)*)\]/, '').replace(/^\s{2}/, '');
    }

    $("#divStory textarea.content").val(lines.join("\n"));
}

function TC_StorySync(this1, this2) {
    var pos = getCursortPosition(this1);
    var valp = $(this1).val().substring(0, pos);
    var lines1 = String(valp).split(/\n/);

    var lines = $(this2).val().split(/\n/);
    for (var i = 0; i < lines.length; i++) {
        lines[i] = String(lines[i]).replace(/^\*+/, '');

        if (i == lines1.length - 1) {
            lines[i] = "*" + lines[i];
        }
    }
    $(this2).val(lines.join("\n"));

    var srltop = $(this1).scrollTop();
    if ($(this1).hasClass("content")) {
        $("#divStory textarea.used").scrollTop(srltop);
    } else {
        $("#divStory textarea.content").scrollTop(srltop);
    }
}

function TC_StoryWidthHeight(p, act, thisx) {
    var p = p ? p : 0.4;
    var ws = winDimensions();
    var w = ws[0] - 50;
    var h = ws[1] - $("#divStory div.title").get(0).offsetHeight - $("#divStory div.content div.cmd").get(0).offsetHeight - 23;

    if (act) {
        p = 0.1
        if ($(thisx).data("widthpercent") == 0.1) {
            $(thisx).data("widthpercent", 0.8);
            p = 0.8
        } else {
            $(thisx).data("widthpercent", 0.1);
        }

        if ($(thisx).hasClass("richtext")) {
            $("#divStory div.richtext").css({ width: w * p + "px", height: h + "px", "overflow": "auto" });
            $("#divStory textarea").css({ width: w * (1 - p) / 2 + "px", height: h + "px" });
        } else if ($(thisx).hasClass("content")) {
            $("#divStory textarea.content").css({ width: w * p + "px", height: h + "px" });
            $("#divStory div.richtext").css({ width: w * (1 - p) / 2 + "px", height: h + "px", "overflow": "auto" });
            $("#divStory textarea.used").css({ width: w * (1 - p) / 2 + "px", height: h + "px" });
        } else {
            $("#divStory textarea.content").css({ width: w * (1 - p) / 2 + "px", height: h + "px" });
            $("#divStory div.richtext").css({ width: w * (1 - p) / 2 + "px", height: h + "px", "overflow": "auto" });
            $("#divStory textarea.used").css({ width: w * p + "px", height: h + "px" });
        }
    } else {
        $("#divStory textarea.content").css({ width: w * (1 - p) / 2 + "px", height: h + "px" });
        $("#divStory div.richtext").css({ width: w * (1 - p) / 2 + "px", height: h + "px", "overflow": "auto" });
        $("#divStory textarea.used").css({ width: w * p + "px", height: h + "px" });
    }
}

function TC_StorySave(thisx) {
    var sidobj = $("#divStory div.content div.cmd input.txtStoryID");
    var sid = sidobj.val().replace(/\s+/g, '');
    if (!sid) {
        sidobj.css('background', '#FFFF66');
        StatusShow(5, "<div style='color:red;background:yellow;padding:10px' >Please input a Story ID!</div>");
        return;
    }
    sidobj.val(sid);

    var obname = $("#divStory div.content div.cmd input.txtfilter");
    var name = obname.val().replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
    if (!name) {
        obname.css('background', '#FFFF66');
        StatusShow(5, "<div style='color:red;background:yellow;padding:10px' >Please input a Story Name!</div>");
        return;
    }
    obname.val(name);

    var content = $("#divStory textarea.content").val().replace(/\s+\n*$/g, '');
    if (!content) {
        $("#divStory textarea.content").css('background', '#FFFF66');
        StatusShow(5, "<div style='color:red;background:yellow;padding:10px' >Please input contents for the story!</div>");
        return;
    }

    var dbid = (obname.data("dbid") ? obname.data("dbid") : "");
    var tmpid = "";
    if (!dbid) {
        tmpid = obname.data("tmpid");
        if (!tmpid) {
            tmpid = (new Date()).getTime();
            obname.data("tmpid", tmpid);
        }
    }

    $.ajax({
        url: 'TC_StorySave.php',
        data: { 'name': name, 'content': content, 'tmpid': tmpid, "dbid": dbid, "sidx": sid, 'html': $("#divStory div.richtext").html() },
        type: 'POST', //must use POST, as there're too many ids for some connented users.
        //timeout:60000, 
        dataType: 'text',
        async: true,
        cache: false,
        success: function(data) {
            if (data == 1) {
                $("#divStory textarea.content").css('background', '#FFFFFF');
                sidobj.css('background', '#FFFFFF');
                obname.css('background', '#FFFFFF');
                StatusShow(5, "<div style='background:#009966;padding:10px' >Saving story: done!</div>");
            } else {
                StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Saving story error! <div>" + data + "</div></div>");
            }
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Saving story error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus=" + textStatus + "</div>");
        },
    });
}

function TC_StoryOpenList(divid, eids) {

    var valfilter = "";
    var txf = $("#" + divid + " div.list input.txtListFilter");
    if (txf.length) {
        valfilter = txf.val();
    }

    $("#" + divid + " div.list").empty();
    if (!eids) {
        eids = [];
    }

    $.ajax({
        url: 'TC_StoryOpenList.php',
        data: { eids: eids },
        type: 'POST', //must use POST, as there're too many ids for some connented users.
        //timeout:60000, 
        dataType: 'json',
        async: true,
        cache: false,
        success: function(data) {
            if (data['list']) {
                $("#" + divid + " div.list").append(data['list']).css({ height: ($("#" + divid).get(0).offsetHeight * 0.9) + 'px' }).slideDown()
                    .find("tr.list").css({ cursor: 'pointer' }).unbind().bind({
                        mouseover: function() {
                            this.style.background = '#FFFFFF';
                        },
                        mouseout: function() {
                            this.style.background = '';
                        },
                        click: function() {
                            TC_StoryOpenID($(this).data("dbid"), divid);
                            $("#" + divid + " div.list").slideUp();
                        }
                    });

                var t = $("#" + divid + " div.list input.txtListFilter");
                if (t.length) {
                    t.val(valfilter).css({ width: (t.parent().get(0).offsetWidth - 11) + "px" }).unbind().bind({
                        keyup: function() {
                            var inpv = $(this).val().replace(/^\s+|\s+$/g, '').replace(/\s+/g, '\\\s*.*');
                            var nshow = 0;
                            if (inpv.length) {
                                $(this).css({ background: "#FFFFCC" });

                                $("#" + divid + " div.list tr.list").each(function() {
                                    if (String($(this).html()).match(new RegExp(inpv, "i"))) {
                                        $(this).show();
                                        nshow++;
                                    } else {
                                        $(this).hide();
                                    }
                                });
                            } else {
                                $(this).css({ background: "" });
                                $("#" + divid + " div.list tr.list").show();
                                nshow = $("#" + divid + " div.list tr.list").length;
                            }

                            $("#" + divid + " div.list span.filterstatus").html("(" + nshow + "/" + $("#" + divid + " div.list tr.list").length + ")")
                        }
                    }).keyup();
                }

                $("#" + divid + " div.list td.tdlistFilter.button.close").unbind().bind({
                    mouseover: function() {
                        this.style.background = '#A0A0A0';
                    },
                    mouseout: function() {
                        this.style.background = '#E0E0E0';
                    },
                    click: function() {
                        $("#" + divid + " div.list").slideUp();
                    }
                });

            } else {
                StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Open story list error! <div>" + data['error'] + "</div></div>");
            }
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Open story list error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus=" + textStatus + "</div>");
        },
    });
}

var StoryOpenIDData = {};

function TC_StoryOpenID(dbid, divid, seldata) {
    if (divid == "divStory") {
        $("#divStory div.content div.cmd input.txtfilter").val("").data("dbid", "").data("tmpid", "");
        $("#divStory textarea").val("");
        $("#divStory div.richtext").html('');
    }

    var idx = '';
    if ($('#divTopBar').find('input.txttitle').data('idx')) {
        idx = $('#divTopBar').find('input.txttitle').data('idx');
    }

    StoryOpenIDData = {};
    $.ajax({
        url: 'TC_StoryOpenID.php',
        data: { dbid: dbid, idx: idx },
        type: 'POST', //must use POST, as there're too many ids for some connented users.
        //timeout:60000, 
        dataType: 'json',
        async: true,
        cache: false,
        success: function(data) {
            if (data['name']) {
                if (divid == "divStory") {
                    //console.log(data);
                    $("#divStory div.content div.cmd input.txtfilter").val(data['name']).data("dbid", data['id']);
                    $("#divStory div.content div.cmd input.txtStoryID").val(data['sid']);
                    $("#divStory textarea.content").val(data['content']);
                    $("#divStory div.richtext").html(data['html']);

                    TC_StoryCoveredSync(data['content'], data);
                    StoryOpenIDData = data;

                    var msg = "DO NOT DELETE the line number [xxx.xxx]!<br />If you delete a line's content, keep its line number there!";
                    TC_StoryWarn($("#divStory textarea.content").get(0).offsetHeight, msg, 15);
                } else if (divid == "divCoverageDetail") {
                    TC_StoryCoveredAdd(data, seldata, idx);
                }
            } else {
                StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Open story error! <div>" + data['error'] + "</div></div>");
            }
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Open story error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus=" + textStatus + "</div>");
        },
    });
}

function TC_StoryCoveredSync(content, data) {
    var cs = String(content).split(/\n/);
    var str = new Array();

    for (var i = 0; i < cs.length; i++) {
        var lineNs = TC_StoryLineNums(cs[i], i);

        if (data.hasOwnProperty("covered")) {
            if (data["covered"].hasOwnProperty(lineNs[1])) {
                var s1 = "";
                var nk = 0;
                var reg = new RegExp('^\\\s*\\\[' + lineNs[1] + '\\\]', "i");
                for (var j = 0; j < data["covered"][lineNs[1]].length; j++) {
                    if (data["covered"][lineNs[1]][j][1].match(reg)) {
                        sx1 = cs[i].replace(/^\[(\d+(\.\d+)*)\]/, '');
                        sx2 = data["covered"][lineNs[1]][j][1].replace(/^\[(\d+(\.\d+)*)\]/, '');
                        var diff = stringDiff(null, null, sx1, sx2, 1);
                        if (diff == 0) {
                            nk++;
                            s1 = cs[i].replace(/^\[(\d+(\.\d+)*)\]/, '').replace(/^\s{2}/, '');
                        } else {
                            //console.log(diff,sx1," | ",sx2);
                        }
                    }
                }

                if (!s1) {
                    s1 = data["covered"][lineNs[1]][0][1].replace(/^\[(\d+(\.\d+)*)\]/, '').replace(/^\s{2}/, '');
                }

                str.push("[" + lineNs[0] + "] [" + xrepeat("0", 3 - String(nk).length) + nk + "] " + s1);
            } else {
                str.push("[" + lineNs[0] + "]");
            }
        } else {
            str.push("[" + lineNs[0] + "]");
        }
    }

    $("#divStory textarea.used").val(str.join("\n"));
}

function TC_StoryLineNums(s, i) {
    var ms = String(s).match(/^\[(\d+(\.\d+)*)\]\s+/);
    var lineNum = i;
    if (ms && ms.length) {
        lineNum = ms[1];
    }
    var lineNumx = String(lineNum).replace(/^0+/, '');
    if (lineNumx.match(/^\./)) {
        lineNumx = '0' + lineNumx;
    }

    return [lineNum, lineNumx]
}

function TC_StoryCoveredAdd(data, seldata, idx) {
    var listx = new Array();
    var lines = data['content'].split(/\n/);
    $("#divCoverageDetail div.contentx div.story div.contentxx").hide();

    //console.log(idx);
    //console.log(data);
    //console.log(seldata);
    for (var i = 0; i < lines.length; i++) {
        var sel = 0;
        var styles = new Array();
        var style3 = "";
        var lineNs = TC_StoryLineNums(lines[i], i);

        if (seldata && seldata.hasOwnProperty(lineNs[1])) {
            sx2 = seldata[lineNs[1]].replace(/^\[(\d+(\.\d+)*)\]/, '');
            sx1 = lines[i].replace(/^\[(\d+(\.\d+)*)\]/, '');
            var diff = stringDiff(null, null, sx1, sx2, 1);
            if (diff == 0) {
                sel = 1;
                styles.push("color:green");
                style3 = " style='background:green' ";
            }
        }

        var style2 = "";
        if (data.hasOwnProperty("covered") && data["covered"].hasOwnProperty(lineNs[1])) {
            var idxs = new Array();
            for (var j = 0; j < data["covered"][lineNs[1]].length; j++) {
                sx2 = data["covered"][lineNs[1]][j][1].replace(/^\[(\d+(\.\d+)*)\]/, '');
                sx1 = lines[i].replace(/^\[(\d+(\.\d+)*)\]/, '');
                var diff = stringDiff(null, null, sx1, sx2, 1);
                if (diff == 0) {
                    if (idx != data["covered"][lineNs[1]][j][0]) {
                        idxs.push(data["covered"][lineNs[1]][j][0]);
                    }
                }
            }
            if (idxs.length) {
                var R = 0;
                var G = 102;
                if (idxs.length > 1) {
                    R = idxs.length * 40;
                    if (R > 255) {
                        R = R % 255;
                    }

                    //G += idxs.length*10;
                    //if(G > 255){
                    //    G = G % 255;
                    //}
                }
                var icolor = 'rgb(' + R + ',' + G + ',204)';
                style2 = " style='background:" + icolor + "'  title='(" + idxs.length + ") " + idxs.join(', ') + "' ";
            }
        }

        if (String(lines[i]).match(/^(\s*\[(\d+(\.\d+)*)\])*\s*(\d+\.)(\d+\.)*\s+/)) {
            styles.push("font-weight:bold");
        }

        listx.push(
            "<tr class='ROW" + i + "' data-row='" + i + "' data-rownum='" + lineNs[1] + "' data-selected=" + sel + " >" +
            "<td class='tdliststoryN rowhis'  " + style2 + ">&nbsp;</td>" +
            "<td class='tdliststoryN rownum'  " + style3 + ">" + lineNs[0] + "</td>" +
            "<td class='tdliststoryT rowtext' " + (styles.length ? " style='" + styles.join(";") + "'" : "") + ">" + encodeHtml(String(lines[i]).replace(/^\[(\d+(\.\d+)*)\]/, '').replace(/^\s{2}/, '')) + "</td>" +
            "</tr>"
        );
    }

    var clss = "contentxStory1";
    if ($("#divCoverageDetail div.contentx div.story").length) {
        clss = "contentxStory";
    }

    var numstory = $("#divCoverageDetail div.contentx div.story").length + 1;
    $("#divCoverageDetail div.contentx").append(
        `<div class='story ` + clss + ` S` + data['id'] + `' data-dbid='` + data['id'] + `' >
            <div class='titlexx'     style='padding:5px;background:#F0F0F0;text-align:left' >
                <a class='num' style='font-size:small;color:#A0A0A0' >` + xrepeat("0", 2 - String(numstory).length) + numstory + `&nbsp;</a>                
                <input class='button6 name'   type='button' value='` + data['sid'] + " " + data['name'] + `' style='text-align:left' />&nbsp;                
                <input class='button6 unsel'  type='button' value='U' style='color:blue;visibility:hidden' title='Unselect all' data-dbid='` + data['id'] + `' />
                <input class='button6 delete' type='button' value='X' style='color:red ;visibility:hidden' title='Delete this stroy' data-dbid='` + data['id'] + `' />
            </div>
            <div class='contentxx'   style='padding:5px;overflow:auto;display:none' title='Click to set the coverage point' ><table>` + listx.join("") + `</table></div>
        </div>
        `
    ).find("div.titlexx input.button6").css({ cursor: 'pointer' }).unbind().bind({
        mouseover: function() {
            this.style.background = '#D0D0D0';
        },
        mouseout: function() {
            this.style.background = '#F0F0F0';
        },
        click: function() {
            if ($(this).hasClass("name")) {
                if ($(this).parent().parent().find("div.contentxx").css("display") == "none") {
                    $(this).parent().parent().find("div.contentxx").slideDown();
                    $(this).parent().find(".button6.unsel").css({ visibility: 'visible' });
                    $(this).parent().find(".button6.delete").css({ visibility: 'visible' });
                } else {
                    $(this).parent().parent().find("div.contentxx").slideUp();
                    $(this).parent().find(".button6.unsel").css({ visibility: 'hidden' });
                    $(this).parent().find(".button6.delete").css({ visibility: 'hidden' });
                }
            } else if ($(this).hasClass('unsel')) {
                $("#divCoverageDetail div.contentx div.S" + $(this).data("dbid")).find("tr").each(function() {
                    if ($(this).data("selected")) {
                        $(this).data("selected", 0);
                        $(this).find("td.rowtext").css({ color: "#000000" });
                        $(this).find("td.rownum").css({ background: "" });
                    }
                });

            } else if ($(this).hasClass('delete')) {
                $(this).hide();
                var _this = this;
                var dbid = $(this).data("dbid");
                $(this).parent().append(
                    `<div style='padding:5px;background:yellow' >
                        <div style='padding:5px;color:red' >Do you really want to delete this story?</div>
                        <div style='padding:5px'>
                            <input class='button yes' type='button' value='YES' style='width:50px' />&nbsp;
                            <input class='button no'  type='button' value='NO'  style='width:50px' />
                        </div>
                    </div>`
                ).find("input.button").unbind().bind({
                    mouseover: function() {
                        this.style.background = '#D0D0D0';
                    },
                    mouseout: function() {
                        this.style.background = '#F0F0F0';
                    },
                    click: function() {
                        if ($(this).hasClass("yes")) {
                            TC_StoryCoveredDel(dbid, _this);

                        } else if ($(this).hasClass('no')) {
                            $(_this).show();
                        }

                        $(this).parent().parent().remove();
                    }
                });
            }
        }
    });

    for (var i = 0; i < lines.length; i++) {
        $("#divCoverageDetail div.contentx div.story.S" + data['id'] + " tr.ROW" + i).data("string", lines[i]);
    }

    var h = $("#divCoverageDetail").get(0).offsetHeight - $("#divCoverageDetail div.titlex").get(0).offsetHeight - 16;
    $("#divCoverageDetail div.contentx").css({ height: h + "px" }).find("tr").unbind().bind({
        mouseover: function() {
            $(this).css({ background: '#F0F0F0' });
        },
        mouseout: function() {
            $(this).css({ background: '' });
        },
        click: function() {
            if ($(this).data("selected")) {
                $(this).data("selected", 0);
                $(this).find("td.rowtext").css({ color: "#000000" });
                $(this).find("td.rownum").css({ background: "" });
            } else {
                $(this).data("selected", 1);
                $(this).find("td.rowtext").css({ color: "#00CC66" });
                $(this).find("td.rownum").css({ background: "#00CC66" });
            }
        }
    });

    TC_StoryCoveredUpdate();
    TC_StoryCoveredNameWith(data['id'])
}

function TC_StoryCoveredNameWith(idx) {
    $("#divCoverageDetail div.story").each(function() {
        var id = $(this).data("dbid");
        if (!idx || (idx && (id == idx))) {
            var bw = $("#divCoverageDetail div.story.S" + id).get(0).offsetWidth -
                $("#divCoverageDetail div.story.S" + id + " div.titlexx a.num").get(0).offsetWidth -
                $("#divCoverageDetail div.story.S" + id + " div.titlexx input.button6.delete").get(0).offsetWidth -
                $("#divCoverageDetail div.story.S" + id + " div.titlexx input.button6.unsel").get(0).offsetWidth -
                4 * 10;
            /*            
            console.log(
                    id,
                    $("#divCoverageDetail div.story.S" + id).get(0).offsetWidth, 
                    $("#divCoverageDetail div.story.S" + id + " div.titlexx a.num").get(0).offsetWidth,
                    $("#divCoverageDetail div.story.S" + id + " div.titlexx input.button6.delete").get(0).offsetWidth,
                    $("#divCoverageDetail div.story.S" + id + " div.titlexx input.button6.unsel").get(0).offsetWidth,
                    bw
            );    
            */
            if (bw > 30) {
                $("#divCoverageDetail div.story.S" + id + " div.titlexx input.button6.name").css({ width: bw + "px" });
            }
        }
    });
}

function TC_StoryCoveredUpdate() {
    var names = new Array();
    var rolestr = "";
    var rolego = 0;
    var vals = $("#divTestcase_prerequisites div.divCoverage textarea.coverage").val().split(/\n+/);

    for (var i = 0; i < vals.length; i++) {
        if (vals[i].match(/\s*(\d+)\s+CAPA/i)) {
            names.push(vals[i].replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' '));
        } else if (vals[i].match(/^\s*Covered\s+Roles/i)) {
            rolego = 1;
        }

        if (rolego) {
            rolestr += vals[i] + "\n";
        }
    }

    var c = 0;
    $("#divCoverageDetail div.contentx div.story input.button6.name").each(function() {
        if (names.indexOf(this.value) == -1) {
            names.push(this.value);
            c++;
        }
    });

    if (c) {
        names.sort();
        //for(var i=0; i < names.length; i++){
        //    names[i] = (i+1) + ") " + names[i];
        //}
        $("#divTestcase_prerequisites div.divCoverage textarea.coverage").val("Covered part of the stories (" + names.length + "):\n    " + names.join("\n    ") + "\n\n" + rolestr).keyup();
    }
    //TBD;
}

function TC_StoryCoveredDel(dbid, _this) {
    var idx = '';
    if ($('#divTopBar').find('input.txttitle').data('idx')) {
        idx = $('#divTopBar').find('input.txttitle').data('idx');
    }
    if (!idx) {
        $('#divTopBar').find('input.txttitle').css('background', '#FFFF66');
        StatusShow(5, "<div style='color:red;background:yellow;padding:10px' >Please save before anything!</div>");
        return;
    }

    $.ajax({
        url: 'TC_StoryCoveredDel.php',
        data: { idx: idx, dbid: dbid },
        type: 'POST', //must use POST, as there're too many ids for some connented users.
        //timeout:60000, 
        dataType: 'text',
        async: true,
        cache: false,
        success: function(data) {
            if (data == 1) {
                $(_this).parent().parent().remove();
                TC_StoryCoveredUpdate();
            } else {
                StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Delete covered story error! <div>" + data + "</div></div>");
            }
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Delete covered story error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus=" + textStatus + "</div>");
        },
    });
}

function TC_PageAccountInit() {
    var ws = winDimensions();
    $("#divMyAccount div.contentx").css({ height: (ws[1] - $("#divMyAccount div.titlex").get(0).offsetHeight) + 'px' }).append(
        `<div class='divlogin' id='div_login' >  
                <div class='divlogintitle'  ><li>Login</li></div> 
                <div style='padding:5px;text-align:center'>               
                    <table class='login' style='border-collapse:collapse;border-spacing:0px;background:#F0F0F0'> 
                        <tr style='display:none' >   
                            <td class='span4' colspan=3 style='padding:10px 10px 0px 10px'>
                                Encrypt / Decrypt Key
                                <input class='txtunderline' type='password' id='EncryptDecryptCode'  value=''  style='width:380px;padding:5px' />*  
                                <div style='padding:5px;color:#C0C0C0;font-size:small' >*Your unique key to Encrypt / Decrypt your data.&#10This key will never be saved in this system.</div>                        
                            </td>                            
                        </tr>      
                        <tr >   
                            <td class='span4' colspan=3 style='padding:10px'>
                                Email Address
                                <input class='txtunderline' type='text'    id='emailaddr'   value='' style='width:250px;padding:5px' />
                                Validation Code
                                <input class='txtunderline' type='text'    id='verifyCode'  value=''  style='width:60px;padding:5px' title='Input numbers only'/>                          
                            </td>                            
                        </tr>            
                        <tr style='padding:5px'>   
                            <td class='button bordernone send'   title='Get Validation Code' >Get Validation Code</td>
                            <td class='button bordernone verify' title='Login' >Login</td>  
                            <td class='button bordernone clean'  title='Logoff' >Logoff</td>                     
                        </tr>  
                        <tr style='padding:0px'>   
                            <td colspan=3 style='padding:0px' >
                                <div class='div_count_down2' ></div>
                            </td>                 
                        </tr>      
                    </table> 
                </div>
                <div id='span_sendcode' style='padding:5px;text-align:left;color:#C0C0C0;font-size:small'>&nbsp;</div>
            </div>
            <br />

            <div class='divlogin' id='div_teams' style='display:none' >
                <div class='divlogintitle'   ><li>Teams</li></div> 
                <div style='padding:5px;text-align:left;'>
                     <input class='button addnewteam'  type='button' style='padding:0px;width:50px' title='Add a new team' value='+' />&nbsp;
                     <input class='button refreshteam' type='button' style='padding:0px;width:50px' title='Refresh your teams' value='R' />&nbsp;
                     <span style='padding:0px;color:#C0C0C0;font-size:small'>*Only after verified (Verified is YES) by the Team memeber and it's not expired, 
                            Team members can access the items of each other.</span>
                </div>
                <div class='content' ></div>
            </div>
            <br />

            <div class='xclose' title='Close' >x</div>`
    ).find(".button").unbind().bind({
        mouseover: function() {
            this.style.background = '#D0D0D0';
        },
        mouseout: function() {
            this.style.background = '#E0E0E0';
        },
        click: function() {
            if ($(this).hasClass('send')) {
                CodeSend(this)
            } else if ($(this).hasClass('verify')) {
                CodeVerify()
            } else if ($(this).hasClass('refreshteam')) {
                TC_TeamRefresh()
            } else if ($(this).hasClass('addnewteam')) {
                TC_TeamAddNew(1, 1)
            } else if ($(this).hasClass('clean')) {
                CodeClean()
            }
        },
    });

    $("#emailaddr").unbind().bind({
        keyup: function() {
            var em = $(this).val().replace(/\s+/g, '').toUpperCase();
            $(this).val(em);
        },

        blur: function() {
            var em = $(this).val().replace(/\s+/g, '').toUpperCase();
            $(this).val(em);
        },
    });

    $("#divMyAccount div.xclose").unbind().bind({
        mouseover: function() {
            this.style.background = '#D0D0D0';
        },
        mouseout: function() {
            this.style.background = '';
        },
        click: function() {
            CodePanel(1)
        },
    });

    $("#verifyCode").unbind().bind({
        keyup: function(ev) {
            ev = ev || window.event;
            //console.log(ev.keyCode); 
            if (ev.keyCode == 13) { //enter
                CodeVerify()
            }
        }
    });

    $("#EncryptDecryptCode").unbind().bind({
        click: function() {
            this.type = 'text';
        },

        blur: function() {
            this.type = 'password';


        },

        keyup: function() {
            /*
            var val = $(this).val().replace(/^\s+|\s+$/g,'');
            $(this).val(val)
            if(val){         
                var td = $("#div_teams div.content table td.mykeycode");
                if(td.length){
                    td.html(val.replace(/./g,'*'));
                }
            }
            */
        }
    });
}

function TC_TeamAddNew(isOwner, isNew, teamid, name) {
    if (!CurrentUserEmail) {
        retrun;
    }
    teamid = teamid ? teamid : (new Date()).getTime();
    name = name ? name : '';

    $("#div_teams div.content").append(
        `<div class='teams ID` + teamid + `' style='padding:5px' >
            <table class='teamsTable'>
                <tr class='myself title' >
                    <td class='tdteam bordernoright ` + (isOwner ? "bttn deleteTeam" : "") + ` CN0' ` + (isOwner ? " title='Delete this Team' " : "") + ` >` + (isOwner ? "x" : "") + `</td>
                    <td class='tdteam bordernoleft  TeamName ThisTeamStatus' colspan=4 style='text-align:left' >
                        <div>
                            #` + ($("#div_teams div.content div.teams").length + 1) + ` Team Name: <input class='txtTeamName' type='text' value='` + name + `' data-string='` + name + `' ` + (isOwner ? "" : "disabled=true") + ` />&nbsp;&nbsp;
                            <span class='thisteamstatus' ></span>
                        <div>
                        <div class='div_count_down1' ></div>
                    </td>                                                  
                </tr>
                <tr class='myself' style='background:#F4F4F4' >
                    <td class='tdteam borderlefton ` + (isOwner ? "addteam bttn" : "") + ` CN0' title='Add new team member' >` + (isOwner ? "&nbsp;+&nbsp;" : "--") + `</td>  
                    <td class='tdteam CN1' >No.</td>
                    <td class='tdteam CN2' >Team Member (Email Address)</td>
                    <td class='tdteam CN3' >Verified*</td>
                    <td class='tdteam' >Remark</td>                                                   
                </tr>
                ` + (isNew ?
            `<tr class='myself' >
                        <td class='tdteam xbg3 borderlefton CN0' >` + (isOwner ? "Owner" : "--") + `</td>
                        <td class='tdteam xbg3 CN1' >1</td>
                        <td class='tdteam xbg3 CN2' >` + CurrentUserEmail.toUpperCase() + `</td>
                        <td class='tdteam xbg3 CN3' >--</td>
                        <td class='tdteam xbg3' >--</td>               
                    </tr>` : "") + `
            </table>
        </div>`
    ).find("div.teams.ID" + teamid + " td.tdteam.bttn").css({ color: 'blue', cursor: 'pointer' }).unbind().bind({
        mouseover: function() {
            this.style.background = '#D0D0D0';
        },
        mouseout: function() {
            this.style.background = '';
        },

        click: function() {
            if ($(this).hasClass("addteam")) {
                TC_TeamAddMember(0, ["", "", "", "", "", "", ""], 1, teamid);
            } else if ($(this).hasClass("deleteTeam")) {
                $("#div_teams div.content div.teams.ID" + teamid + " span.thisteamstatus").html(
                    `<a style='color:red'>Are you sure to delete this Team?</a>&nbsp;&nbsp;
                    <span class='button yes' style=''>&nbsp;YES&nbsp;</span>&nbsp;&nbsp;
                    <span class='button no'  style=''>&nbsp;NO&nbsp;</span>
                    `
                ).find("span.button").css({ cursor: 'pointer' }).unbind().bind({
                    mouseover: function() {
                        this.style.background = '#D0D0D0';
                    },
                    mouseout: function() {
                        this.style.background = '';
                    },

                    click: function() {
                        if ($(this).hasClass("yes")) {
                            TC_TeamUpdate("", "deleteTeam", "", "", teamid);
                        } else {
                            $(this).parent().empty();
                        }
                    }
                });
            }
        },
    });

    $("#div_teams div.content div.teams.ID" + teamid + " td.ThisTeamStatus").css({ cursor: 'pointer' }).unbind().bind({
        mouseover: function() {
            this.style.background = '#D0D0D0';
        },
        mouseout: function() {
            this.style.background = '';
        },

        click: function() {
            if ($(this).data("hidden")) {
                $(this).data("hidden", 0);
                $("#div_teams div.content div.teams.ID" + teamid + " tr").not(".title").show();
            } else {
                $(this).data("hidden", 1);
                $("#div_teams div.content div.teams.ID" + teamid + " tr").not(".title").hide();
            }
        }
    });

    $("#div_teams div.content div.teams.ID" + teamid + " input.txtTeamName").unbind().bind({
        click: function() {
            stopPropagation();
        },
        blur: function() {
            var teamname = $(this).val().replace(/^\s+|\s+$|\"+|\'/g, '').replace(/\s+/g, '-');
            if (!teamname) {
                TC_TeamMsg(teamid, "<a style='color:red'>This Team name is empty!</a>");
                return;
            }

            //console.log($(this).data("string"),teamname, $(this).data("string") != teamname);
            if (!$(this).data("string") || $(this).data("string") != teamname) {
                TC_TeamUpdate([], "updateName", "", "", teamid);
            }
        }
    });
}

function TC_TeamAddMember(num, mb, isTeamOwner, teamid) {
    //num, [dbid, email,isVerified,verifiedDue,verifiedExpired,isowner, quit], isTeamOwner, teamid
    //       0,   1,    2          3,          4,              5,      6      

    var remark = new Array();
    if (mb[3] && isTeamOwner) {
        if ((new Date()).getTime() < mb[3] * 1000) {
            remark.push(
                "<div style='padding:3px;' >A confirmed code was sent to this member, to Confirm, </div>" +
                "<div style='padding:3px;color:red' >you must ask for that code before " + (new Date(mb[3] * 1000)) + "</div>");
        }
    }

    var isExpired = 0;
    if (mb[4]) {
        if ((new Date()).getTime() < mb[4] * 1000) {
            remark.push("<div style='padding:3px' >Expired on " + (new Date(mb[4] * 1000)) + "</div>");
        } else {
            isExpired = 1;
            remark.push("<div style='padding:3px;color:red' >Expired @ " + (new Date(mb[4] * 1000)) + "</div>");
        }
    }

    if (mb[6]) {
        remark.push("<div style='padding:3px;color:red' >QUIT</div>");
    }

    if (!isTeamOwner && !mb[2] && !mb[5] && mb[1] != CurrentUserEmail) {
        mb[1] = mb[1].replace(/./g, '*');
    }

    var ismyself = 0;
    if (mb[1] == CurrentUserEmail) {
        ismyself = 1;
    }

    var action = "";
    if (mb[2]) {
        if (mb[1] == CurrentUserEmail) {
            action = "<div class='button4 quit' title='Quit from this Team' >Quit</div>";
        } else {
            action = "YES";
        }
    } else if (isTeamOwner) {
        if (!ismyself) {
            action = "<div class='button4 request' title='Send an notification to request verification'    >Request</div>" +
                "<div class='button4 confirm' title='Input verification code to confirm this request' " + (num ? "" : " style='display:none' ") + " >Confirm</div>";
        } else {
            action = "--";
        }
    } else if (mb[1] == CurrentUserEmail) {
        action = "<div class='button4 iamin' title='Confirm to join this Team' >Confirm</div>";
    } else {
        if (mb[5]) {
            action = "--";
        } else {
            action = "NO";
        }
    }

    var ownact = "--";
    if (isTeamOwner) {
        if (ismyself) {
            if (mb[5]) {
                ownact = "Owner"
            } else {
                ownact = "--"
            }
        } else {
            ownact = "x";
        }
    } else if (mb[5]) {
        ownact = "Owner";
    }

    var thisTable = $("#div_teams div.content div.teams.ID" + teamid + " table");
    thisTable.append(
        "<tr class='members' >" +
        "<td class='tdteam " + (isTeamOwner ? (ismyself ? "" : " delete ") : "") + " borderlefton CN0' data-dbid='" + (mb[0] ? mb[0] : "") + "' >" + ownact + "</td>" +
        "<td class='tdteam CN1' >" + (num ? num : thisTable.find("tr.members").length + 1) + "</td>" +
        "<td class='tdteam CN2' ><input class='txtteam email' type='text' value=\"" + (mb[1] ? mb[1] : "") + "\" " +
        "data-string=\"" + (mb[1] ? mb[1] : "") + "\" data-dbid='" + (mb[0] ? mb[0] : "") + "' " +
        "data-verified='" + (mb[2] ? mb[2] : 0) + "' " + ((mb[2] || !isTeamOwner || ismyself) ? " disabled=true" : "") + " /></td>" +
        "<td class='tdteam verified CN3' >" + action + "</td>" +
        "<td class='tdteam remark' >" + remark.join("") + "</td>" +
        "</tr>"
    );

    TC_TeamInputEvent(teamid);
}

function TC_TeamInputEvent(teamid) {
    $("#div_teams div.content div.teams.ID" + teamid + " tr.members").unbind().bind({
        mouseover: function() {
            this.style.background = '#F4F4F4';
        },
        mouseout: function() {
            this.style.background = '';
        },
    });

    $("#div_teams div.content div.teams.ID" + teamid + " input.txtteam").unbind().bind({
        click: function() {
            if ($(this).hasClass("keycode")) {
                this.type = 'text';
            }
        },

        keyup: function() {
            var em = $(this).val().replace(/\s+/g, '');
            var ischange = 0;
            if ($(this).hasClass("email")) {
                em = em.toUpperCase();
                if (em != String($(this).data("string")).toUpperCase() || !EmailCheck(em) || em == CurrentUserEmail.toUpperCase()) {
                    ischange = 1;
                }
            } else {
                if (em != $(this).data("string")) {
                    ischange = 1;
                }
            }

            if (ischange || !em) {
                $(this).css({ background: "#FFFFCC" });
            } else {
                $(this).css({ background: "#FFFFFF" });

            }

            $(this).val(em);
        },

        blur: function() {
            var tr = $(this).parent().parent();
            var _e = tr.find("input.txtteam.email");
            if (_e.length) {
                var em = _e.val().replace(/\s+/g, '').toUpperCase();

                var e = 0;
                $("#div_teams div.content div.teams.ID" + teamid + " input.txtteam.email").each(function() {
                    var emx = $(this).val().replace(/\s+/g, '').toUpperCase();
                    if (emx == em) {
                        e++;
                    }
                });

                if (e > 1) {
                    TC_TeamMsg(teamid, "<a style='color:red'>This Team member (" + em + ") is existing!</a>")
                } else {
                    if (em) {
                        var tmpid = _e.data("tmpid");
                        if (!tmpid) {
                            tmpid = (new Date()).getTime();
                            _e.data("tmpid", tmpid);
                        }

                        if (EmailCheck(em) && em != String(_e.data("string")).toUpperCase()) {
                            _e.val(em).css({ background: "#FFFFCC" });
                            TC_TeamUpdate([_e.data("dbid"), em, tmpid], "update", "", _e, teamid);
                        }
                    }
                }
            }
        }
    });

    $("#div_teams div.content div.teams.ID" + teamid + " td.delete").css({ color: "red", cursor: 'pointer' }).unbind().bind({
        mouseover: function() {
            this.style.background = '#D0D0D0';
        },
        mouseout: function() {
            this.style.background = '';
        },
        click: function() {
            var dbid = $(this).data("dbid");
            var tmpid = $(this).parent().find("input.txtteam.email").data("tmpid");
            if (dbid || tmpid) {
                TC_TeamUpdate("", "delete", [dbid, tmpid ? tmpid : ""], this, teamid);
            } else {
                TC_TeamMsg(teamid, "<a style='color:red'>this Team member is not saved yet!</a>");
            }
        }
    });

    $("#div_teams div.content div.teams.ID" + teamid + " div.button4").unbind().bind({
        mouseover: function() {
            this.style.background = '#D0D0D0';
        },
        mouseout: function() {
            this.style.background = '';
        },
        click: function() {
            var emobj = $(this).parent().parent().find("input.txtteam.email");
            var em = emobj.val().replace(/\s+/g, '').toUpperCase();
            var e = 0;
            $("#div_teams div.content div.teams.ID" + teamid + " input.txtteam.email").each(function() {
                var emx = $(this).val().replace(/\s+/g, '').toUpperCase();
                if (emx == em) {
                    e++;
                }
            });

            if (e > 1) {
                TC_TeamMsg(teamid, "<a style='color:red'>This Team member (" + em + ") is existing!</a>");
            } else {
                if (em && EmailCheck(em)) {
                    if ($(this).hasClass("request")) {
                        TC_TeamVerifyRequest(em, this, teamid);
                    } else if ($(this).hasClass("quit")) {
                        TC_TeamVerifyConfirm(em, this, '', teamid, emobj.data("dbid"), "quit")
                    } else if ($(this).hasClass("iamin")) {
                        TC_TeamVerifyConfirm(em, this, '', teamid, emobj.data("dbid"), "confirm")
                    } else if ($(this).hasClass("confirm")) {
                        TC_TeamVerifyConfirmX(em, this, teamid, emobj.data("dbid"))
                    }
                } else {
                    TC_TeamMsg(teamid, "<a style='color:red'>this Team member (" + em + ") is invalid!</a>");
                }
            }
        }
    });
}

function TC_TeamMsg(teamid, msg, seconds) {
    try {
        $("#div_teams div.content div.teams.ID" + teamid + " div.div_count_down1").stop(true, true).css({ "width": "", "border-color": "red" });
    } catch (e) {

    }

    $("#div_teams div.content div.teams.ID" + teamid + " span.thisteamstatus").html(msg);
    seconds = seconds ? seconds : 10;
    if (seconds) {
        $("#div_teams div.content div.teams.ID" + teamid + " div.div_count_down1").animate({
                'width': '0px'
            },
            seconds * 1000,
            function() {
                $("#div_teams div.content div.teams.ID" + teamid + " div.div_count_down1").css({ "border-color": "#F4F4F4" });
                $("#div_teams div.content div.teams.ID" + teamid + " span.thisteamstatus").empty();
            });
    }
}


function TC_TeamVerifyConfirmX(sendTo, _this, teamid, id) {
    var _this = _this;

    var requestStatus = $(_this).parent().find("div.button4.request").css("display");
    $(_this).parent().find("div.button4").hide();
    $(_this).parent().find("div.confirmcode").remove();

    $(_this).parent().append(
        "<div class='confirmcode' style='padding:5px' >" +
        "<table style='width:100%' >" +
        "<tr><td colspan=2><input class='txtTeamConfirmcode' type='text' " +
        "title='please input the confirmed code, as a 4-digital number.&#10Ask this member for the code.' /></td></tr>" +
        "<tr>" +
        "<td class='button3 confirm' >Confirm</td>" +
        "<td class='button3 cancel'  >Close</td>" +
        "</tr>" +
        "</table>" +
        "</div>"
    ).find("td.button3").unbind().bind({
        mouseover: function() {
            this.style.background = '#D0D0D0';
        },
        mouseout: function() {
            this.style.background = '';
        },

        click: function() {
            if ($(this).hasClass('confirm')) {
                var code = $(this).parent().parent().find("input.txtTeamConfirmcode").val().replace(/\s+/g, '');
                if (code.match(/^\d{4}$/)) {
                    //$(_this).parent().find("div.button4").show();
                    //$(this).parent().parent().parent().parent().remove();             
                    TC_TeamVerifyConfirm(sendTo, _this, code, teamid, id);
                } else {
                    $(this).parent().parent().find("input.txtTeamConfirmcode").css({ background: "#FFFFCC" });
                    TC_TeamMsg(teamid, "<a style='color:red' >Confirmed code input (" + code + ") is not valid!</a>");
                }
            } else if ($(this).hasClass('cancel')) {
                $(_this).parent().find("div.button4.confirm").show();
                if (requestStatus != "none") {
                    $(_this).parent().find("div.button4.request").show();
                }
                $(this).parent().parent().parent().parent().remove();
            }
        },
    });
}

function TC_TeamVerifyConfirm(sendTo, _this, confirmcode, teamid, id, bymyself) {
    var _this = _this;

    $.ajax({
        url: 'TC_TeamVerifyConfirm.php',
        data: { 'sendTo': sendTo, 'confirmcode': confirmcode, "id": id, "bymyself": bymyself ? bymyself : '' },
        type: 'GET', //must use POST, as there're too many ids for some connented users.
        //timeout:60000, 
        dataType: 'text',
        async: true,
        cache: false,
        success: function(data) {
            if (data && String(data).match(/^\d+$/)) {
                $(_this).parent().parent().find("td.tdteam.remark").html("<div style='padding:3px' >Expired @ " + (new Date(data * 1000)) + "</div>");
                $(_this).parent().parent().find("input.txtteam.email").data("verified", 1);
                TC_TeamToListFilter();
                $(_this).parent().html("YES");
            } else if (bymyself && bymyself == "quit" && data == "QUIT") {
                $(_this).parent().html("QUIT");
            } else {
                TC_TeamMsg(teamid, "<a style='color:red' >" + data + "</a>");
            }
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Confirm for " + sendTo + ", error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus=" + textStatus + "</div>");
        },
    });
}

function TC_TeamVerifyRequest(sendTo, _this, teamid) {
    var _this = _this;
    $(_this).hide();

    $(_this).parent().find("div.confirmcode").remove();
    TC_TeamMsg(teamid, "<a style='color:blue' >Inviting " + sendTo + " ... </a>");
    $(_this).parent().parent().find("td.tdteam.remark").html("<div style='padding:3px;color:blue' >sending ...</div>");

    $.ajax({
        url: 'TC_TeamVerifyRequest.php',
        data: { 'sendTo': sendTo, 'teamid': teamid, "teamname": $("#div_teams div.content div.teams.ID" + teamid + " input.txtTeamName").val() },
        type: 'GET', //must use POST, as there're too many ids for some connented users.
        //timeout:60000, 
        dataType: 'text',
        async: true,
        cache: false,
        success: function(data) {
            if (data) {
                TC_TeamMsg(teamid, data);
                if (String(data).match(/Email\s+sends\s+successfully/i)) {
                    $(_this).parent().find("div.button4.confirm").show();

                    var duet = $("#div_teams div.content div.teams.ID" + teamid + " span.thisteamstatus div.verifieddue").html();
                    if (duet) {
                        $(_this).parent().parent().find("td.tdteam.remark").html(
                            "<div style='padding:3px;' >A confirmed code was sent to this member, to Confirm, </div>" +
                            "<div style='padding:3px;color:red' >you must ask for that code before " + (new Date(duet * 1000)) + "</div>"
                        );
                    } else {
                        $(_this).parent().parent().find("td.tdteam.remark").html(
                            "<div style='padding:3px;color:red' >Failed to invite!</div>"
                        );
                    }
                } else {
                    $(_this).parent().parent().find("td.tdteam.remark").html(
                        "<div style='padding:3px;color:red' >Failed to invite!</div>"
                    );
                }
            }
        },

        complete: function() {
            window.setTimeout(function() {
                $(_this).show();
            }, 120000);
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Request to " + sendTo + ", error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus=" + textStatus + "</div>");
        },
    });
}

function TC_TeamUpdate(emails, act, dbids, _this1, teamid) {
    var teamname = $("#div_teams div.content div.teams.ID" + teamid + " input.txtTeamName").val().replace(/^\s+|\s+$|\"+|\'/g, '').replace(/\s+/g, '-');
    if (!teamname) {
        TC_TeamMsg(teamid, "<a style='color:red'>This Team name is empty!</a>");
        return;
    }
    $("#div_teams div.content div.teams.ID" + teamid + " input.txtTeamName").val(teamname).data("string", teamname);

    //console.log(emails,act,dbid,_this1,_this2);
    var _this1 = _this1;
    var emails = emails;
    $.ajax({
        url: 'TC_TeamUpdate.php',
        data: { emails: emails, "action": act, "dbids": dbids, "teamid": teamid, "teamname": teamname },
        type: 'POST', //must use POST, as there're too many ids for some connented users.
        //timeout:60000, 
        dataType: 'text',
        async: true,
        cache: false,
        success: function(data) {
            //console.log(data);
            if (data == 1) {
                if (act == "delete") {
                    //console.log("_this=", $(_this));
                    $(_this1).unbind().css({ cursor: "default" });
                    $(_this1).parent().css({ "text-decoration": "line-through" }).find("input").each(function() {
                        var val = $(this).val();
                        $(this).parent().html(val);
                        $(this).remove();
                    });
                } else if (act == "deleteTeam") {
                    $("#div_teams div.content div.teams.ID" + teamid).remove();

                } else if (act == "updateName") {
                    TC_TeamMsg(teamid, "<a style='color:green'>This Team name is updated!</a>");

                } else {
                    _this1.css({ background: "#FFFFFF" }).data("string", emails[1]);
                }

                if (act != "updateName") {
                    TC_TeamToListFilter();
                }
            } else if (data) {
                TC_TeamMsg(teamid, "<a style='color:red' >" + data + "</a>");
            }
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Update (" + act + ") Teams error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus=" + textStatus + "</div>");
        },
    });
}

function TC_TeamToListFilter() {
    //return;

    var emails = new Array();
    $("#div_teams div.content input.txtteam.email").each(function() {
        var em = $(this).val().replace(/\s+/g, '').toUpperCase();
        if (em != CurrentUserEmail.toUpperCase() && $(this).data("verified")) {
            if (EmailCheck(em)) {
                emails.push(em);
            }
        }
    });

    //console.log(emails);
    $('#divList_filter tr.search td.tdlistsearch div.divsearch div.content tr.condition').not(".fixed").remove();
    var tr = $('#divList_filter tr.search td.tdlistsearch div.divsearch div.content tr.fixed');

    if (emails.length) {
        tr.find('select.logic.groupstart').attr("disabled", true).val("(").css({ color: "gray" });
        tr.find('select.logic.andor').val("OR");

        for (var i = 0; i < emails.length; i++) {
            tr.find('div.button2.add').click();
            var itr = $('#divList_filter tr.search td.tdlistsearch div.divsearch div.content tr.condition').get(i + 1);
            $(itr).find("select").attr("disabled", true).css({ color: "gray" });
            $(itr).find("select.selectsearch.field").val("created_by");
            $(itr).find("select.selectsearch.logic.x").val("=");
            $(itr).find("input.txtsearch.value").val(emails[i]).attr("disabled", true);
            $(itr).find("div.button2.delete").unbind().remove();

            if (i == emails.length - 1) {
                $(itr).find('select.logic.groupeend').val(")");
            } else {
                $(itr).find('select.logic.andor').val("OR");
            }
        }
    } else {
        tr.find('select.logic.groupstart').attr("disabled", "").val("").css({ color: "" });
        tr.find('select.logic.andor').val("AND");
    }

    $('#divList_filter tr.search div.divsearch').slideDown(200);
    $('#divList_list').empty();

    if ($("#divMyAccount").css("display") != "none") {
        tr.find('div.button2.search').click();
    } else {
        window.setTimeout(function() {
            $('#divTopBar td.tdbutton.search-list').click();
        }, 5000);
    }
}

function TC_TeamRefresh() {
    $("#div_teams").show();

    $("#div_teams div.content div.teams").remove();
    $.ajax({
        url: 'TC_TeamGetList.php',
        //data: {},
        type: 'POST', //must use POST, as there're too many ids for some connented users.
        //timeout:60000, 
        dataType: 'json',
        async: true,
        cache: false,
        success: function(data) {
            //console.log(data);             
            if (data.hasOwnProperty("data")) {
                for (var teamidx in data["data"]) {
                    var isTeamOwner = 0;
                    if (data["data"][teamidx]["owner"] == CurrentUserEmail) {
                        isTeamOwner = 1;
                    }
                    TC_TeamAddNew(isTeamOwner, 0, teamidx, data["data"][teamidx]["name"]);

                    var n = 0;
                    for (var i = 0; i < data["data"][teamidx]["members"].length; i++) {
                        var mb = data["data"][teamidx]["members"][i];
                        n++;
                        TC_TeamAddMember(n, mb, isTeamOwner, teamidx);
                        //num, [dbid, email,isVerified,verifiedDue,verifiedExpired,isowner],isTeamOwner,teamid
                    }
                }
                TC_TeamToListFilter();
            } else if (data["error"]) {
                StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Update Teams error! <div>" + data["error"] + "</div></div>");
            }
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Update Teams error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus=" + textStatus + "</div>");
        },
    });
}

function TC_StepsEvents() {
    $('#divAllSteps').find('textarea').unbind().bind({
        mouseover: function() {
            ActiveTextarea = this;
            $(this).scrollTop(1);
            if ($(this).scrollTop()) {
                $(this).attr("title", "Double-click to expand\n\nHot keys:\n [Alt + i] Indent the selected line\n [Alt + u] Unindent the selected line");
            } else {
                $(this).attr("title", "Hot keys:\n [Alt + i] Indent the selected line\n [Alt + u] Unindent the selected line");
            }
        },
        mouseout: function() { ActiveTextarea = null },
        resize: function() {
            if (ActiveTextarea == this) {
                TC_StepsTableColWidth($(this).data('colnum'), this)
                TC_StepsTableRowHeight($(this).data('rownum'), this);
            }
        },

        click: function() {
            if (!$(this).data('string')) {
                $(this).data('string', $(this).val());
            }

            /*
            if($(this).hasClass("C1")){
                $('#div_smart').find('td.tdbutton2.left').click();

            }else if($(this).hasClass("C2")){
                $('#div_smart').find('td.tdbutton2.right').click()
            }
            */
            TC_SmartCheck(this);

            $('#divAllSteps').find('table').data("addAfterRow", $(this).data('rownum'));
        },

        keydown: function(ev) {
            ev = ev || window.event;
            if (ev.keyCode == 18) { //Alt
                $(this).data("alt_key_down", 1);
            } else if (ev.keyCode == 73 && $(this).data("alt_key_down")) { //alt + i
                TC_InputIndent(this, "indent");
            } else if (ev.keyCode == 85 && $(this).data("alt_key_down")) { //alt + u
                TC_InputIndent(this, "unindent");
            }
        },

        keyup: function(ev) {
            ev = ev || window.event;
            //console.log(ev.keyCode); 
            TC_InputCheck(this);

            if (ev.keyCode == 13) { //enter
                TC_InputLineStyleAuto(this);
                return;
            } else if (ev.keyCode == 18) { //Alt
                $(this).data("alt_key_down", 0);
            }

            if ($('#div_smart').data("smarton")) {
                var nowtime = (new Date()).getTime();
                if (ev.keyCode == 16 || (ev.keyCode == 17)) { //Shift || CtrlKey
                    if ($(this).data("KeyDownTime" + ev.keyCode)) {
                        if (nowtime - $(this).data("KeyDownTime" + ev.keyCode) < 500) {
                            $(this).data("KeyDownCount" + ev.keyCode, $(this).data("KeyDownCount" + ev.keyCode) + 1);
                            if ($(this).data("KeyDownCount" + ev.keyCode) > 1) {
                                if (ev.keyCode == 16 && $('#div_smart').find("div.lines").find("div.divfinding").length) {
                                    $('#div_smart').find("div.lines").find("div.divfinding")[0].click();
                                } else if ($('#div_smart').find("div.steps").find("div.divfinding").length) {
                                    $('#div_smart').find("div.steps").find("div.divfinding")[0].click();
                                }

                                $(this).data("KeyDownTime" + ev.keyCode, 0);
                                $(this).data("KeyDownCount" + ev.keyCode, 0);
                            }
                        } else {
                            $(this).data("KeyDownTime" + ev.keyCode, nowtime);
                            $(this).data("KeyDownCount", 1);
                        }
                    } else {
                        $(this).data("KeyDownTime" + ev.keyCode, nowtime);
                        $(this).data("KeyDownCount" + ev.keyCode, 1);
                    }
                }
            }

            TC_SmartCheck(this);
        },

        blur: function() {
            TC_InputLineClean(this);
            TC_InputCheck(this);
            TC_SmartAdd($(this).val());
        },

        dblclick: function() {
            $(this).scrollTop(100000);
            var srtop = $(this).scrollTop();
            //console.log('before:',srtop);
            if ($(this).scrollTop()) {
                var thisx = this;
                $(this).animate({
                        'height': (srtop + this.offsetHeight) + 'px'
                    },
                    1000,
                    function() {
                        TC_StepsTableRowHeight($(thisx).data('rownum'), thisx);
                    }
                );
            }
        }
    });

    var tw1 = $('#divAllSteps').find('tr.S1').find('td.desc').find('div').get(0).offsetWidth;
    var tw2 = $('#divAllSteps').find('tr.S1').find('td.expected').find('div').get(0).offsetWidth;
    $('#divAllSteps').find('textarea.C1').each(function() {
        //console.log(this.offsetWidth, tw1);
        if (this.offsetWidth < tw1) {
            $(this).css({ width: tw1 + 'px' });
        }
    });


    $('#divAllSteps').find('textarea.C2').each(function() {
        //console.log(this.offsetWidth, tw2);
        if (this.offsetWidth < tw2) {
            $(this).css({ width: tw2 + 'px' });
        }
    });

    $('#divAllSteps').find('td.delete').unbind().bind({
        mouseover: function() { this.style.background = '#707070' },
        mouseout: function() { this.style.background = '' },
        click: function() {
            $('#divAllSteps').find('tr.S' + $(this).data('rownum')).remove();
        }
    }).css({ color: 'red', cursor: 'pointer' });

    $('#divAllSteps').find('td.tdsteps.number').find('input').unbind().bind({
        mouseover: function() { this.style.color = '#0066FF' },
        mouseout: function() { this.style.color = '#000000' },

        click: function() {
            if (!$(this).data('string')) {
                $(this).data('string', $(this).val());
            }
            $('#divAllSteps').find('table').data("addAfterRow", $(this).data('rownum'));
        },

        keyup: function() {
            TC_InputCheck(this);
        },

        blur: function() {
            TC_InputCheck(this);
        },

        dblclick: function() {
            var srtop = 0;
            var rowNum = $(this).data('rownum');
            var thisx = null;
            $('#divAllSteps').find('tr.S' + rowNum).find('textarea').each(function() {
                $(this).scrollTop(100000);
                if ($(this).scrollTop() > srtop) {
                    srtop = $(this).scrollTop();
                    thisx = this;
                }
            });

            if (srtop) {
                $(thisx).animate({
                        'height': (srtop + thisx.offsetHeight - 10) + 'px'
                    },
                    1000,
                    function() {
                        TC_StepsTableRowHeight(rowNum, thisx);
                    }
                );
            }
        }
    });

    TC_StepsTableColWidth();
}

function TC_StepsTableRowHeight(rowNum, obj) {
    var h = 0;
    if (obj) {
        h = obj.offsetHeight - 10;
    } else {
        $('#divAllSteps').find('tr.S' + rowNum).find('textarea').each(function() {
            if (this.offsetHeight > h) {
                h = this.offsetHeight;
            }
        });
    }

    $('#divAllSteps').find('tr.S' + rowNum).find('textarea').each(function() {
        if (obj && this == obj) {
            //
        } else {
            $(this).css({ height: h + 'px' });
        }
    });

    $('#divAllSteps').find('tr.S' + rowNum).find('input').css({ height: h + 'px', 'line-height': h + 'px' });

}

function TC_StepsTableColWidth(colNum, thisx) {
    if (thisx) {
        $('#divAllSteps').find('textarea.C' + colNum).each(function() {
            if (thisx != this) {
                $(this).css({ width: (thisx.offsetWidth - 10) + 'px' });
            }
        })
    }

    window.setTimeout(function() {
        var colws = new Array();
        $('#divAllSteps').find('tr.S1').find('td').find('div').each(function() {
            colws.push(this.offsetWidth)
        });

        for (var i = 0; i < colws.length; i++) {
            if (colws[i]) {
                $('#divStepsHeader').find('td.CN' + i).find('div').css({ width: colws[i] + 'px' });
            }
        }


    }, 100);
}

function TC_StepsAdd(rownum, stepid) {
    if (!rownum) {
        var maxrownum = 1;
        $('#divAllSteps').find('tr.trstep').each(function() {
            if ($(this).data('num') > maxrownum) {
                maxrownum = $(this).data('num');
            }
        });

        rownum = maxrownum + 1;
    }

    var xbg = '';
    if (rownum % 2 == 0) {
        xbg = ' xbg';
    }
    var tw1 = $('#divAllSteps').find('tr.S1').find('td.desc').find('textarea').get(0).offsetWidth - 10;
    var tw2 = $('#divAllSteps').find('tr.S1').find('td.expected').find('textarea').get(0).offsetWidth - 10;

    if (!stepid) {
        stepid = TC_StepNextID();
    }

    var str = "<tr class='trstep S" + rownum + xbg + "' data-num=" + rownum + " data-stepid=" + stepid + " > " +
        "<td class='tdsteps number borderlefton' style='width: 100px;' title='Double-click to expand all in the row'><input class='txtStepNum" + xbg + "' type='text' value='Step-" + stepid + "' data-rownum=" + rownum + " /></td>" +
        "<td class='tdsteps desc'     ><textarea class='textarea_steps cfont C1" + xbg + "' data-colnum=1 data-rownum=" + rownum + " style='width:" + tw1 + "px;'></textarea></td>" +
        "<td class='tdsteps expected' ><textarea class='textarea_steps cfont C2" + xbg + "' data-colnum=2 data-rownum=" + rownum + " style='width:" + tw2 + "px;'></textarea></td>" +
        "<td class='tdsteps delete cfont' title='delete this step' data-rownum=" + rownum + " style='width: 50px;'>&nbsp;x&nbsp;</td>" +
        "</tr>";

    if ($('#divAllSteps').find('table').data("addAfterRow")) {
        $('#divAllSteps').find('tr.trstep.S' + $('#divAllSteps').find('table').data("addAfterRow")).after(str);
        $('#divAllSteps').find('table').data("addAfterRow", 0);
    } else {
        $('#divAllSteps').find('table').append(str);
    }

    TC_StepsEvents();
}

function TC_StepsPreview() {
    $("#divTCPreview").find("div.title").html($('#divTopBar').find('input.txttitle').val());
    var tables = new Array("<table>");

    tables.push("<tr class='trheader' >");
    tables.push("<td class='tdpreview CN0' ><div style='text-align:center;font-weight:bold' >No.</div></td>");
    tables.push("<td class='tdpreview CN1' ><div style='text-align:center;font-weight:bold' >Description</div></td>");
    tables.push("<td class='tdpreview CN2' ><div style='text-align:center;font-weight:bold' >Expected Result</div></td>");
    tables.push("</tr>");

    $('#divAllSteps').find('.trstep').each(function() {
        var xbg = '';
        if ($(this).find('input.txtStepNum').hasClass("xbg")) {
            xbg = "class='xbg'";
        }
        tables.push("<tr " + xbg + ">");
        tables.push("<td class='tdpreview CN0' ><div>" + encodeHtml($(this).find('input.txtStepNum').val()) + "</div></td>");
        tables.push("<td class='tdpreview CN1' ><div>" + encodeHtml($(this).find('td.tdsteps.desc').find('textarea').val().replace(/^\'+|^\"+|\'*\n*$|\"*\n*$/g, '')) + "</div></td>");
        tables.push("<td class='tdpreview CN2' ><div>" + encodeHtml($(this).find('td.tdsteps.expected').find('textarea').val().replace(/^\'+|^\"+|\'*\n*$|\"*\n*$/g, '')) + "</div></td>");
        tables.push("</tr>");
    });

    tables.push("</table>");

    $("#divTCPreview").find("div.content").html(tables.join(""));

    window.setTimeout(function() {
        var colws = new Array();
        $('#divAllSteps').find('tr.S1').find('td').find('div').each(function() {
            colws.push(this.offsetWidth)
        });

        for (var i = 0; i < 3; i++) {
            if (colws[i]) {
                $("#divTCPreview").find("div.content").find('td.CN' + i).find("div").css({ width: colws[i] + 'px' });
            }
        }
    }, 100);
}

function TC_Display(data, idx) {
    $('#divTopBar').find('td.tdbutton').data('selected', 0).css({ 'background': '#303030' });
    $('#divList').hide();
    $('#divTestcase').show();
    $("#divTCPreview").hide();
    $('#divTopBar').find('td.tdbutton').not('.list').not('.new').show();
    $('#divTopBar').find('td.tdbutton.steps').click();

    $('#divTopBar').find('input.txttitle').val("").data('idx', '').data("status", "Inwork").data('checkin_time', 0).data('created_by', '').data('module', "");
    $('#divTopBar').find('td.tdbutton.status').html("Inwork");

    $('#divTestcase_prerequisites').find('textarea').val("").data('string', "");
    $("#divCoverageDetail div.contentx").empty();
    $('#divAllSteps').find('td.delete').click();

    var sc1 =
        `- Open the browser to be used for testing
- Locate the browser version
- Capture screenshot`;
    $('#divAllSteps').find('textarea.C1').val(sc1).css({ background: '#FFFFFF' }).data("string", sc1);

    var sc2 =
        `-The browser version displays

- Screenshot is captured`;
    $('#divAllSteps').find('textarea.C2').val(sc2).css({ background: '#FFFFFF' }).data("string", sc2);

    $('#divAllSteps').find('input.txtStepNum').val("Step-1").css({ background: '#FFFFFF' }).data("string", "");

    $('#divAllSteps').find('table').data("addAfterRow", 0);

    $('#divAllSteps').find('.trstep').each(function() {
        $(this).data('stepid', '');
    });

    $('#divTestcase_history').empty();

    if (data) {
        if (data.hasOwnProperty('name')) {
            $('#divTopBar').find('input.txttitle').val(data['name']).data('idx', idx).data('checkin_time', data["checkin_time"]).data('created_by', data["created_by"]).data('module', data["module"]);
        }

        if (data.hasOwnProperty('prere')) {
            $('#divTestcase_prerequisites').find('textarea.prere').val(data['prere']).data('string', data['prere']);
        }

        if (data.hasOwnProperty('coverage')) {
            $('#divTestcase_prerequisites').find('textarea.coverage').val(data['coverage']).data('string', data['coverage']);
        }

        if (data.hasOwnProperty('status')) {
            $('#divTopBar').find('input.txttitle').data("status", data['status']);
            $('#divTopBar').find('td.tdbutton.status').html(data['status']);
        }

        if (data.hasOwnProperty('steps')) {
            var rownum = 0;

            for (var stepid in data['steps']) {
                rownum++;
                if (!$('#divAllSteps').find('tr.S' + rownum).length) {
                    TC_StepsAdd(rownum, stepid * 1);
                }

                var robj = $('#divAllSteps').find('tr.S' + rownum);
                robj.data('stepid', stepid * 1);
                robj.find('input.txtStepNum').val(data['steps'][stepid]['stepNumb']).data("string", data['steps'][stepid]['stepNumb']);
                robj.find('td.tdsteps.desc').find('textarea').val(data['steps'][stepid]['stepDesc']).data("string", data['steps'][stepid]['stepDesc']);
                robj.find('td.tdsteps.expected').find('textarea').val(data['steps'][stepid]['stepExpe']).data("string", data['steps'][stepid]['stepExpe']);

                //console.log(rownum,stepid,data['steps'][stepid]['stepNumb'])                
            }
        }

        var names = new Array();
        if (data.hasOwnProperty('covered_story')) {
            for (var sid in data['covered_story']) {
                if (sid) {
                    names.push(data['covered_story'][sid]["name"])
                        //TC_StoryOpenID(sid,"divCoverageDetail",data['covered_story'][sid]["rows"]);
                }
            }

            names.sort();
            for (var i = 0; i < names.length; i++) {
                for (var sid in data['covered_story']) {
                    if (sid) {
                        if (names[i] == data['covered_story'][sid]["name"]) {
                            TC_StoryOpenID(sid, "divCoverageDetail", data['covered_story'][sid]["rows"]);
                        }
                    }
                }
            }
        }

        $('#divStepsHeader').find('td.tdsteps.DBL.CN0').dblclick();
    }

    /*
    if($('#divTopBar').find('input.txttitle').data('idx')){
        $('#divTopBar').find('td.tdbutton.copy').hide();
    }else{
        $('#divTopBar').find('td.tdbutton.copy').show();
    }
    */

    $('#divAllSteps').css({ height: ($('#divTestcase').get(0).offsetHeight - $('#divStepsHeader').get(0).offsetHeight - 10) + 'px' });
}

function TC_StepNextID() {
    var maxid = 0;
    $('#divAllSteps').find('.trstep').each(function() {
        if ($(this).data('stepid') && $(this).data('stepid') * 1 > maxid) {
            maxid = $(this).data('stepid') * 1;
        }
    });
    maxid++;

    return maxid;
}

function TC_GetID(idx) {
    StatusShow(1, "<div style='background:#00CCFF;padding:10px' >Get ID (" + idx + ") ...</div>");
    //return;
    idx = String(idx).replace(/\-/g, '');
    $.ajax({
        url: 'TC_GetID.php',
        data: { idx: idx },
        type: 'POST', //must use POST, as there're too many ids for some connented users.
        //timeout:60000, 
        dataType: 'json',
        async: true,
        cache: false,
        success: function(data) {
            //console.log(data);
            if (data.hasOwnProperty('name')) {
                TC_Display(data, idx);
            } else if (data['error']) {
                StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Get ID (" + idx + ") error! <div>" + data['error'] + "</div></div>");
            }
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Get ID (" + idx + ") error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus=" + textStatus + "</div>");
        },
    });
}


function TC_Export_Selected() {
    var idxs = new Array();
    $('#divList_list tr.list td.tdlist.number').each(function() {
        if ($(this).data("selected")) {
            var idx = $(this).parent().find("td.tdlist.idx").html().replace(/\-/g, '');
            if (idx) {
                idxs.push(idx);
            }
        }
    });

    if (!idxs.length) {
        StatusShow(5, "<div style='color:red;background:yellow;padding:10px' >Please select at leat one row!</div>");
        return;
    }
    //console.log(idxs);

    $.ajax({
        url: 'TC_GetIDSelected.php',
        data: { idxs: idxs },
        type: 'POST', //must use POST, as there're too many ids for some connented users.
        //timeout:60000, 
        dataType: 'json',
        async: true,
        cache: false,
        success: function(data) {
            if (data.hasOwnProperty('data')) {
                TC_Export2Excel(data["data"]);
            } else if (data['error']) {
                StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Export all Error!<div>" + data['error'] + "</div></div>");
            }
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Export all error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus=" + textStatus + "</div>");
        },
    });
}

function TC_Export() {
    var obname = $('#divTopBar').find('input.txttitle');
    var idx = obname.data('idx');
    if (!idx) {
        StatusShow(5, "<div style='color:red;background:yellow;padding:10px' >Please [Save] at first!</div>");
        return;
    }

    var name = String(obname.val()).replace(/^\s*|\s*$/, '');
    if (!name) {
        obname.css('background', '#FFFF66');
        if (act) {
            StatusShow(5, "<div style='color:red;background:yellow;padding:10px' >Please input a name!</div>");
        }
        return;
    }

    var data = {};
    data[idx] = {};
    data[idx]["name"] = name;
    data[idx]["prere"] = $('#divTestcase_prerequisites').find('textarea.prere').val().replace(/^\'+|^\"+|\'*\n*$|\"*\n*$/g, '').replace(/\"+/g, '"');

    data[idx]["steps"] = {};
    var row = 1;
    $('#divAllSteps').find('.trstep').each(function() {
        row++;
        if (!data[idx]["steps"].hasOwnProperty(row)) {
            data[idx]["steps"][row] = {};
        }
        data[idx]["steps"][row]["stepNumb"] = $(this).find('input.txtStepNum').val().replace(/^\s*\-/, "'-");
        data[idx]["steps"][row]["stepDesc"] = $(this).find('td.tdsteps.desc').find('textarea').val().replace(/^\s*\-/, "'-");
        data[idx]["steps"][row]["stepExpe"] = $(this).find('td.tdsteps.expected').find('textarea').val().replace(/^\s*\-/, "'-");
    });

    data[idx]["coverage"] = $('#divTestcase_prerequisites').find('textarea.coverage').val().replace(/^\'+|^\"+|\'*\n*$|\"*\n*$/g, '').replace(/\"+/g, '"');
    data[idx]["created_by"] = obname.data('created_by');
    data[idx]["updated_by"] = CurrentUserEmail;
    data[idx]["updated_when"] = new Date();

    TC_Export2Excel(data);
}

function TC_Export2Excel(data) {
    //console.log("Export2Excel",data);
    for (var idx in data) {
        var name = data[idx]["name"];

        if (!name) {
            continue;
        }

        var sheet1 = {
            "!ref": "A1:U60",
            "!merges": [{ "s": { c: 0, r: 0 }, "e": { c: 20, r: 60 } }],
            "A1": {
                t: "s",
                v: data[idx]["prere"],
                s: { alignment: { horizontal: "left", vertical: "top", wrapText: true } },
            }
        };

        var istyle = {
            alignment: { horizontal: "center", vertical: "top", wrapText: true },
            fill: { bgColor: { rgb: "FFF4F4F4" } },
            border: {
                top: { style: "thin", color: { rgb: "FFD0D0D0" } },
                bottom: { style: "thin", color: { rgb: "FFD0D0D0" } },
                left: { style: "thin", color: { rgb: "FFD0D0D0" } },
                right: { style: "thin", color: { rgb: "FFD0D0D0" } }
            }
        };
        var sheet2 = {
            "!cols": [{ "wch": 15 }, { "wch": 80 }, { "wch": 80 }],
            "A1": { t: "s", v: "No.", s: istyle },
            "B1": { t: "s", v: "Description", s: istyle },
            "C1": { t: "s", v: "Expected Result", s: istyle }
        };

        var row = 1;
        istyle = {
            alignment: { horizontal: "left", vertical: "top", wrapText: true },
            border: {
                top: { style: "thin", color: { rgb: "FFD0D0D0" } },
                bottom: { style: "thin", color: { rgb: "FFD0D0D0" } },
                left: { style: "thin", color: { rgb: "FFD0D0D0" } },
                right: { style: "thin", color: { rgb: "FFD0D0D0" } }
            }
        };
        for (var stepid in data[idx]["steps"]) {
            row++;
            if (row % 2 == 0) {
                istyle["fill"] = { bgColor: { rgb: "FFF4F4F4" } };
            }

            sheet2["A" + row] = { t: "s", v: data[idx]["steps"][stepid]["stepNumb"].replace(/^\s*\-/, "'-"), s: istyle };
            sheet2["B" + row] = { t: "s", v: data[idx]["steps"][stepid]["stepDesc"].replace(/^\s*\-/, "'-"), s: istyle };
            sheet2["C" + row] = { t: "s", v: data[idx]["steps"][stepid]["stepExpe"].replace(/^\s*\-/, "'-"), s: istyle };
        }

        sheet2["!ref"] = "A1:C" + row;

        data[idx]["coverage"] = data[idx]["coverage"] + "\n\n##-------------------------------------------##\n" +
            "Name: " + data[idx]["name"] + "\n" +
            "Module: " + data[idx]["module"] + "\n" +
            "Created by: " + data[idx]["created_by"].replace(/\@.*$/i, '').replace(/[\=\_\.\+\*]+/g, ' ').toLocaleUpperCase() + "(" + data[idx]["created_by"] + ")\n" +
            "Updated by: " + data[idx]["updated_by"].replace(/\@.*$/i, '').replace(/[\=\_\.\+\*]+/g, ' ').toLocaleUpperCase() + "(" + data[idx]["updated_by"] + ")\n" +
            "Updated when: " + data[idx]["updated_when"] +
            "\n##-------------------------------------------##";
        var sheet3 = {
            "!ref": "A1:U60",
            "!merges": [{ "s": { c: 0, r: 0 }, "e": { c: 20, r: 60 } }],
            "A1": {
                t: "s",
                v: data[idx]["coverage"].replace(/^\'+|^\"+|\'*\n*$|\"*\n*$/g, '').replace(/\"+/g, '"'),
                s: { alignment: { horizontal: "left", vertical: "top", wrapText: true } },
            }
        };

        var workbook = {
            SheetNames: ["Prerequisites", "Steps", "Coverage"],
            Sheets: {
                "Prerequisites": sheet1,
                "Steps": sheet2,
                "Coverage": sheet3
            }
        };

        //console.log(workbook);
        var blob = sheet2blob(workbook);
        openDownloadDialog(blob, name + '.xlsx');
        sleep(1000);
    }
}
// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
function sheet2blob(workbook) {
    // 生成excel的配置项
    var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    // 字符串转ArrayBuffer
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    }
    return blob;
}

function TC_HistoryDiff(objx, lastObj, curRev) {
    var diff = 0;
    //compare name, Prerequisites, Coverage (textarea)
    var ps = new Array("div.cmd td.name", "div.content div.prere", "div.content div.cover");
    for (var i = 0; i < ps.length; i++) {
        var c = "#33CC99";
        var d = stringDiff(objx, ps[i], objx.find(ps[i]).data("rawdata"), lastObj.find(ps[i]).data("rawdata"));
        if (d) {
            c = "red";
            diff += d;
        };

        if (ps[i].match(/\.prere$/)) {
            objx.find("div.cmd").find("td.tdbutton3.prere").css({ color: c });
        } else if (ps[i].match(/\.cover$/)) {
            objx.find("div.cmd").find("td.tdbutton3.cover").css({ color: c });
        } else if (ps[i].match(/\.name$/) && d) {
            objx.find("div.cmd").find("td.name").css({ background: 'yellow' });
        }
    }

    //------------------------------------
    //compare Stroy Coverage Detail
    var scddiff = 0;
    var storyids = new Array();
    var storydiff = new Array();
    if (HistoryIDdata.hasOwnProperty(curRev) && HistoryIDdata[curRev].hasOwnProperty("covered_story") &&
        HistoryIDdata.hasOwnProperty(curRev - 1) && HistoryIDdata[curRev - 1].hasOwnProperty("covered_story")
    ) {

        for (var sid in HistoryIDdata[curRev]["covered_story"]) {
            storyids.push(sid);
            if (HistoryIDdata[curRev - 1]["covered_story"].hasOwnProperty(sid)) {
                var sdiff = 0;
                var lineNs = new Array();
                var lines = {};
                for (var i = 0; i < HistoryIDdata[curRev]["covered_story"][sid].length; i++) {
                    var lineN = HistoryIDdata[curRev]["covered_story"][sid][i][0];
                    var lineT = HistoryIDdata[curRev]["covered_story"][sid][i][1];
                    lineNs.push(lineN);
                    if (!lines.hasOwnProperty(lineN)) {
                        lines[lineN] = new Array();
                    }
                    var e = 0;
                    for (var j = 0; j < HistoryIDdata[curRev - 1]["covered_story"][sid].length; j++) {
                        if (lineN == HistoryIDdata[curRev - 1]["covered_story"][sid][j][0]) {
                            e++;
                            if (stringDiff('', '', lineT, HistoryIDdata[curRev - 1]["covered_story"][sid][j][1])) {
                                sdiff++;
                                lines[lineN].push(
                                    "<div style='color:#FF00CC;text-decoration:line-through'>&nbsp;&nbsp;&nbsp;&nbsp;" + encodeHtml(HistoryIDdata[curRev - 1]["covered_story"][sid][j][1], 1) + "</div>",
                                    "<div style='color:#FF00CC'>&nbsp;&nbsp;&nbsp;&nbsp;" + encodeHtml(lineT, 1) + "</div>"
                                );
                            } else {
                                lines[lineN].push("<div style='color:greed'>&nbsp;&nbsp;&nbsp;&nbsp;" + encodeHtml(lineT, 1) + "</div>");
                            }
                            break;
                        }
                    }

                    if (!e) {
                        sdiff++;
                        lines[lineN].push(
                            "<div style='color:#FF00CC'>&nbsp;&nbsp;&nbsp;&nbsp;" + encodeHtml(lineT, 1) + "</div>"
                        );
                    }
                }

                var sdiff2 = 0;
                for (var j = 0; j < HistoryIDdata[curRev - 1]["covered_story"][sid].length; j++) {
                    if (lineNs.indexOf(HistoryIDdata[curRev - 1]["covered_story"][sid][j][0]) == -1) {
                        sdiff2++;

                        if (!lines.hasOwnProperty(HistoryIDdata[curRev - 1]["covered_story"][sid][j][0])) {
                            lines[HistoryIDdata[curRev - 1]["covered_story"][sid][j][0]] = new Array();
                        }
                        lines[HistoryIDdata[curRev - 1]["covered_story"][sid][j][0]].push(
                            "<div style='color:red;text-decoration:line-through'>&nbsp;&nbsp;&nbsp;&nbsp;" + encodeHtml(HistoryIDdata[curRev - 1]["covered_story"][sid][j][1], 1) + "</div>"
                        );

                        lineNs.push(HistoryIDdata[curRev - 1]["covered_story"][sid][j][0]);
                    }
                }

                if (sdiff + sdiff2) {
                    storydiff.push(
                        "<div >&nbsp;&nbsp;Stroy: <a style='color:#FF00CC;font-weight:bold'>" + $("#divCoverageDetail div.contentx div.story.S" + sid + " div.titlexx input.button6.name").val() + "</a>" +
                        "  <a style='color:gray;font-size:small'>(missmatch " +
                        sdiff + "+" + sdiff2 + " / " + HistoryIDdata[curRev]["covered_story"][sid].length + "+" + HistoryIDdata[curRev - 1]["covered_story"][sid].length + ")</a></div>"
                    )
                } else {
                    storydiff.push(
                        "<div >&nbsp;&nbsp;Stroy: <a style='color:greed;font-weight:bold'>" + $("#divCoverageDetail div.contentx div.story.S" + sid + " div.titlexx input.button6.name").val() + "</a>" +
                        "  <a style='color:gray;font-size:small'>(all match., " + HistoryIDdata[curRev]["covered_story"][sid].length + ")</a></div>"
                    )
                }

                var linesNformat = {};
                var mlen = 0;
                for (var i = 0; i < lineNs.length; i++) {
                    if (String(lineNs[i]).length > mlen) {
                        mlen = String(lineNs[i]).length;
                    }
                }
                for (var i = 0; i < lineNs.length; i++) {
                    var f = "";
                    if (String(lineNs[i]).length < mlen) {
                        f = xrepeat("0", mlen - String(lineNs[i]).length) + lineNs[i];
                    } else {
                        f = lineNs[i];
                    }

                    linesNformat[f] = lineNs[i];
                }
                var lineNss = new Array();
                for (var f in linesNformat) {
                    lineNss.push(f);
                }
                lineNss.sort();

                for (var i = 0; i < lineNss.length; i++) {
                    storydiff.push(lines[linesNformat[lineNss[i]]].join(""));
                }
                storydiff.push("<br/>");

                scddiff += sdiff + sdiff2;
            } else {
                storydiff.push(
                    "<div >&nbsp;&nbsp;Stroy: <a style='color:#FF00CC;font-weight:bold'>" + $("#divCoverageDetail div.contentx div.story.S" + sid + " div.titlexx input.button6.name").val() + "</a>" +
                    "  <a style='color:gray;font-size:small'>(new Added, " + HistoryIDdata[curRev]["covered_story"][sid].length + ")</a></div>"
                );
                scddiff += HistoryIDdata[curRev]["covered_story"][sid].length;

                for (var i = 0; i < HistoryIDdata[curRev]["covered_story"][sid].length; i++) {
                    storydiff.push("<div style='color:#FF00CC'>&nbsp;&nbsp;&nbsp;&nbsp;" + encodeHtml(HistoryIDdata[curRev]["covered_story"][sid][i][1], 1) + "</div>");
                }
                storydiff.push("<br/>");
            }
        }
    }

    if (HistoryIDdata.hasOwnProperty(curRev - 1) && HistoryIDdata[curRev - 1].hasOwnProperty("covered_story")) {
        for (var sid in HistoryIDdata[curRev - 1]["covered_story"]) {
            if (storyids.indexOf(sid) == -1) {
                scddiff += HistoryIDdata[curRev - 1]["covered_story"][sid].length;
                storydiff.push(
                    "<div >&nbsp;&nbsp;Stroy: <a style='text-decoration:line-through;color:red;font-weight:bold'>" + $("#divCoverageDetail div.contentx div.story.S" + sid + " div.titlexx input.button6.name").val() + "</a>" +
                    "  <a style='color:gray;font-size:small'>(deleted, " + HistoryIDdata[curRev - 1]["covered_story"][sid].length + ")</a></div>"
                )

                for (var i = 0; i < HistoryIDdata[curRev - 1]["covered_story"][sid].length; i++) {
                    storydiff.push("<div style='color:red;text-decoration:line-through'>&nbsp;&nbsp;&nbsp;&nbsp;" + encodeHtml(HistoryIDdata[curRev - 1]["covered_story"][sid][i][1], 1) + "</div>");
                }
                storydiff.push("<br/>");
            }
        }
    }

    if (scddiff) {
        objx.find("div.cmd td.tdbutton3.cover").css({ color: "red" });
    }

    if (storydiff.length) {
        objx.find("div.content div.cover").append(
            "<br /><br /><div style='font-weight:bold' >Stroy Coverage Detail</div>" + storydiff.join("")
        );
    }

    diff += scddiff;

    //------------------------------------
    //compare steps
    var olds = new Array();
    var news = new Array();
    ps = new Array("td.tdpreview.CN0", "td.tdpreview.CN1", "td.tdpreview.CN2");
    var n = 0;
    objx.find("div.content div.steps tr.trStep").each(function() {
        n++;
        var ss = new Array();
        ss.push(n);
        for (var i = 0; i < ps.length; i++) {
            ss.push($(this).find(ps[i]).data("rawdata"));
        }
        news.push(ss);
    });

    n = 0;
    lastObj.find("div.content div.steps tr.trStep").each(function() {
        n++;
        var ss = new Array();
        ss.push(n);
        for (var i = 0; i < ps.length; i++) {
            ss.push($(this).find(ps[i]).data("rawdata"));
        }
        olds.push(ss);
    });

    var newolds = { old: olds, new: news };
    StepsAnalysis(newolds);
    //console.log(newolds);

    var dn = 0;
    var usedNum = {};
    var usedJns = new Array();
    for (var i = 0; i < newolds["new"].length; i++) {
        var _this = objx.find("div.content div.steps tr.trStep.ROW" + (i + 1));
        if (_this.length) {
            var jn = 0;
            if (newolds.hasOwnProperty("map") && newolds["map"].length && newolds["map"][2].length) {
                for (var j = 0; j < newolds["map"][2].length; j++) {
                    if (i == newolds["map"][2][j][0]) {
                        jn = newolds["map"][2][j][1] + 1;
                        break;
                    }
                }
            }

            if (jn) {
                for (var ii = 0; ii < ps.length; ii++) {
                    var s2 = "";
                    var tdx = lastObj.find("div.content div.steps tr.trStep.ROW" + jn + " " + ps[ii]);
                    if (tdx.length) {
                        s2 = tdx.data("rawdata");
                        usedJns.push(jn);
                        //}else{
                        //console.log(tdx);
                    }

                    dn += stringDiff(_this, ps[ii], _this.find(ps[ii]).data("rawdata"), s2, 1);
                }

                usedNum[i + 1] = jn;
            }
        }
    }

    for (var i = 0; i < newolds["new"].length; i++) {
        if (usedNum.hasOwnProperty(i + 1)) {
            continue;
        }
        var _this = objx.find("div.content div.steps tr.trStep.ROW" + (i + 1));
        var jn = 1;
        while (usedJns.indexOf(jn) > -1) {
            jn++;
        }

        if (jn) {
            for (var ii = 0; ii < ps.length; ii++) {
                var s2 = "";
                var tdx = lastObj.find("div.content div.steps tr.trStep.ROW" + jn + " " + ps[ii]);
                if (tdx.length) {
                    s2 = tdx.data("rawdata");
                    usedJns.push(jn);
                    //}else{
                    //console.log(tdx);
                }

                dn += stringDiff(_this, ps[ii], _this.find(ps[ii]).data("rawdata"), s2, 1);
            }

            usedNum[i + 1] = jn;
        }
    }

    var dels = new Array();
    for (var i = 0; i < newolds["old"].length; i++) {
        if (usedJns.indexOf(i + 1) == -1) {

            dels.push("<tr style='text-decoration:line-through;color:red;background:yellow' >" +
                "<td class='tdpreview' >" + newolds["old"][i][1] + "</td>" +
                "<td class='tdpreview' >" + newolds["old"][i][2] + "</td>" +
                "<td class='tdpreview' >" + newolds["old"][i][3] + "</td></tr>");

            var old1 = String(newolds["old"][i][1]).split(/\n+|\s+/);
            var old2 = String(newolds["old"][i][2]).split(/\n+|\s+/);
            var old3 = String(newolds["old"][i][3]).split(/\n+|\s+/);
            diff += old1.length + old2.length + old3.length;
        }
    }
    if (dels.length) {
        objx.find("div.content div.steps table").append(dels.join(""));
    }
    //------------------------------------

    if (dn) {
        objx.find("div.cmd").find("td.tdbutton3.steps").css({ color: "red" });
        diff += dn;
    } else {
        objx.find("div.cmd").find("td.tdbutton3.steps").css({ color: "#33CC99" });
    }

    var c = $('#divTestcase_history').find("tr.list.title.W" + objx.data("idx") + " td.tdlist.steps");
    c.html(c.html() + "&nbsp;&nbsp;&nbsp;<a style='color:red;font-size:small' >+" + diff + "</a>");
}

function StepsAnalysis(newolds) {
    var results = new Array();
    for (var i = 0; i < newolds["new"].length; i++) {
        var res = new Array();

        var diffm = 0;
        for (var j = 0; j < newolds["old"].length; j++) {
            var diff = 0;
            //var ss = new Array();
            for (var k = 2; k < 4; k++) {
                var s1 = delNoneWords(newolds["new"][i][k]);
                var s2 = delNoneWords(newolds["old"][j][k]);
                diff += s1 == s2 ? 0 : 1;

                //if(s1 != s2){
                //    ss.push([k,s1,s2]);
                //}                
            }

            //if(diff == 1){
            //    console.log(diff,newolds["new"][i][1],'old ' +newolds["old"][j][1], ss);
            //}

            res.push([i, j, diff, newolds["new"][i][1], 'old ' + newolds["old"][j][1]]);
            if (diff > diffm) {
                diffm = diff;
            }
        }

        results.push([res, diffm, newolds["new"][i][1]]);
    }

    //newolds["results"] = results;
    newolds["map"] = stringGroupMap(results);
}

function stringGroupMap(results) {
    //find the maximun full-match group number

    var chosens = new Array();
    var matches = new Array(0, 0, new Array());
    matches[0] = 0;
    for (var k = 0; k < results.length - 1; k++) {
        var chosen = new Array();
        var p = 0;
        var fullmatch = 0;
        var ix = 0;
        for (var i = k; i < results.length; i++) {
            if (ix > 0) {
                p = chosen[ix - 1][1] + 1;
            }

            var ij = strGroupLessDiffNumber(results[i], p);
            if (ij.length && ij[2] == 0) {
                chosen.push(ij) //I J diff
                fullmatch++;
                ix++;
            }
        }

        chosens.push(["fullmatch", fullmatch, Math.round(fullmatch / results.length * 100), chosen]);
        if (fullmatch > matches[0]) {
            matches[0] = fullmatch;
            matches[1] = k;
            matches[2] = chosen;
        }
    }

    return matches; //{"chosen":chosens, "bestmatch":matches};
}

function strGroupLessDiffNumber(res, p) {
    //console.log(res);
    var ij = new Array();
    //if(p < res[0].length){
    var diff = res[1];
    for (var i = 0; i < res[0].length; i++) {
        if (res[0][i][1] < p) {
            continue;
        }

        if (diff > res[0][i][2]) {
            diff = res[0][i][2];
            ij[0] = res[0][i][0];
            ij[1] = res[0][i][1];
            ij[2] = res[0][i][2];
            ij[3] = p;
        }
    }
    //}

    //console.log(ij);
    return ij;
}

function stringGroupClean(group) //group = [string,string, ...]
{
    var g = new Array();
    for (var i = 0; i < group.length; i++) {
        var s = group[i].replace(/^(\&nbsp\;)+|(\&nbsp\;)+$|\s*(\<br\s*\/*\>)+\s*/g, "");
        if (s.length) {
            g.push([i, group[i]]);
        }
    }

    return g;
}

function delNoneWords(s) {
    return String(s).replace(/^(\&nbsp\;)+\s*|\s*(\&nbsp\;)+\s*$|\s*(\<br\s*\/*\>)+\s*|\s+/mg, "").replace(/[\-\_\,\.\/\\\=\~\+\*\{\[\}\]\@\^\'\"\!\#\$\%\&\(\)\~]+/mg, '');
}

function linesAnalysis(newolds) {
    var results = new Array();
    for (var i = 0; i < newolds["new"].length; i++) {
        var res = new Array();

        var diffm = 0;
        for (var j = 0; j < newolds["old"].length; j++) {
            var s1 = delNoneWords(newolds["new"][i][1]);
            var s2 = delNoneWords(newolds["old"][j][1]);
            var diff = s1 == s2 ? 0 : 1;

            res.push([newolds["new"][i][0], newolds["old"][j][0], diff]);
            if (diff > diffm) {
                diffm = diff;
            }
        }

        results.push([res, diffm, i]);
    }

    //console.log("results=",results);
    return stringGroupMap(results);
}

function stringDiff(objx, p, s1, s2, IsNoNum) {
    if (s1 == s2) {
        if (s1 && objx && p) {
            objx.find(p).css({ color: "green" });
        }
        return 0;
    } else {
        var ss1 = s1.split('<br/>');
        var ss2 = s2.split('<br/>');
        var ss1clean = stringGroupClean(ss1)
        var ss2clean = stringGroupClean(ss2);
        var newolds = { 'old': ss2clean, 'new': ss1clean };
        var map = linesAnalysis(newolds);
        //console.log("map=",map);
        var nlen = String(ss1.length + 10).length;

        var usedNum = new Array();
        var usedJns = new Array();
        for (var i = 0; i < ss1.length; i++) {
            if (map.length && map[2].length) {
                for (var j = 0; j < map[2].length; j++) {
                    if (i == map[2][j][0]) {
                        usedJns.push(map[2][j][1]);
                        usedNum.push(i);

                        if (IsNoNum) {
                            ss1[i] = "<span style='color:green' >" + ss1[i] + "</span>";
                        } else {
                            ss1[i] = "<span style='color:green' ><a style='color:gray;font-size:small'>[" + xrepeat("0", nlen - String(i).length) + i + "]</a> " + ss1[i] + "</span>";
                        }

                        //console.log(ss1[i]);
                        //console.log(ss1[map[2][j][1]]);
                        //console.log("------------");
                    }
                }
            }
        }

        var d = 0;
        for (var i = 0; i < ss1.length; i++) {
            if (usedNum.indexOf(i) > -1) {
                continue;
            }

            var ss1i = ss1[i].replace(/^(\&nbsp\;)+|(\&nbsp\;)+$|\s*(\<br\s*\/*\>)+\s*/g, "");
            if (ss1i) {
                var ss2i = "";
                var go = 1;
                var jn = -1;

                while (ss2clean.length && go) {
                    var x = ss2clean.shift();
                    if (usedJns.indexOf(x[0]) == -1) {
                        ss2i = ss2[x[0]].replace(/^(\&nbsp\;)+\s*|\s*(\&nbsp\;)+\s*$|\s*(\<br\s*\/*\>)+\s*/g, "");
                        go = 0;
                        usedJns.push(x[0]);
                        jn = x[0];
                    }
                }

                if (ss1i != ss2i) {
                    var sss1 = ss1[i].split(/\s/);
                    var ssss = new Array();
                    var ssss2 = new Array();

                    var lastIndex = 0;
                    var diff = 0;
                    for (var j = 0; j < sss1.length; j++) {
                        var sss1i = sss1[j].replace(/^(\&nbsp\;)+|(\&nbsp\;)+$|\s*(\<br\s*\/*\>)+\s*|\s+/g, "");

                        if (sss1i) {
                            var pos = String(ss2i).toLocaleLowerCase().indexOf(sss1i.toLocaleLowerCase(), lastIndex);
                            //console.log("#"+sss1i+"#", pos, lastIndex, "#"+ss2i.substr(lastIndex)+"#");
                            //console.log("");                                             
                            var ex = "";
                            if (pos > -1) {
                                var dels = String(ss2i).substr(lastIndex, pos - lastIndex);
                                if (dels.replace(/\s+/g, '').length) {
                                    diff++;
                                    var sp = dels.match(/^(\s)|^(\&nbsp\;)/g);
                                    var ep = dels.match(/(\s)$|(\&nbsp\;)$/g);

                                    ssss2.push((sp ? xrepeat("&nbsp;", sp.length) : "") +
                                        "<a style='text-decoration:line-through;color:red' >" + dels.replace(/^(\s)|^(\&nbsp\;)|(\s)$|(\&nbsp\;)$/g, '') + "</a>" +
                                        (ep ? xrepeat("&nbsp;", ep.length) : ""));
                                } else {
                                    ssss2.push(dels);
                                    if (pos - lastIndex == 0 && j > 0) {
                                        ex = "<a style='color:#FF00CC' >_</a>";
                                        diff++;
                                    }
                                }
                                ssss2.push(sss1[j]);
                                ssss.push(ex + "<a style='color:green' >" + sss1[j] + "</a>");

                                lastIndex = pos + sss1i.length;
                            } else {
                                diff++;
                                ssss.push("<a style='color:#FF00CC' >" + sss1[j] + "</a>");
                            }

                        } else {
                            ssss.push(sss1[j]);
                        }
                    }

                    var dels = String(ss2i).substr(lastIndex);
                    if (dels.replace(/\s+/g, '').length) {
                        diff++;
                        var sp = dels.match(/^(\s)|^(\&nbsp\;)/g);
                        var ep = dels.match(/(\s)$|(\&nbsp\;)$/g);
                        ssss2.push((sp ? xrepeat("&nbsp;", sp.length) : "") +
                            "<a style='text-decoration:line-through;color:red' >" + dels.replace(/^(\s)|^(\&nbsp\;)|(\s)$|(\&nbsp\;)$/g, '') + "</a>" +
                            (ep ? xrepeat("&nbsp;", ep.length) : ""));
                    }

                    var oldstr = ssss2.join("").replace(/^\s+|^(\&nbsp\;)+/, '');
                    if (IsNoNum) {
                        ss1[i] = ssss.join(" ") + (diff && oldstr ? " <span style='font-size:small' >#" + oldstr + "#</span>" : "");
                    } else {
                        ss1[i] = "<a style='color:gray;font-size:small'>[" + xrepeat("0", nlen - String(i).length) + i + "]</a> " + ssss.join(" ") +
                            (diff && oldstr ? " <span style='font-size:small' >#<a style='color:gray;font-size:small'>[" + xrepeat("0", nlen - String(jn).length) + jn + "]</a> " + oldstr + "#</span>" : "");
                    }

                    d += diff;
                } else {
                    if (IsNoNum) {
                        ss1[i] = "<span style='color:green' >" + ss1[i] + "</span>";
                    } else {
                        ss1[i] = "<span style='color:green' ><a style='color:gray;font-size:small'>[" + xrepeat("0", nlen - String(i).length) + i + "]</a> " + ss1[i] + "</span>";
                    }
                }
                //*/
            } else {
                //ss1[i] = i + "# ----------------------------"
            }
        }

        if (ss2clean.length) {
            for (var i = 0; i < ss2clean.length; i++) {
                if (usedJns.indexOf(ss2clean[i][0]) == -1) {
                    var str = "";
                    if (IsNoNum) {
                        str = "<div style='text-decoration:line-through;color:red' >" + ss2[ss2clean[i][0]] + "</div>";
                    } else {
                        str = "<div style='text-decoration:line-through;color:red' ><a style='color:gray;font-size:small'>[" + xrepeat("0", nlen - String(ss2clean[i][0]).length) + ss2clean[i][0] + "]</a> " + ss2[ss2clean[i][0]] + "</div>";
                    }

                    ss1[i] = str + (ss1[i] ? ss1[i] : "");
                    var xs = String(ss2[ss2clean[i][0]]).split(/\n+|\s+/);
                    d += xs.length;
                }
            }
        }

        if (objx && p) {
            objx.find(p).html(ss1.join("<br/>"));
        }

        return d;
    }
}

var HistoryIDdata = {}

function TC_HistoryID(objx, id, clickObj, dspObj) {
    objx.empty();
    $.ajax({
        url: 'TC_HistoryID.php',
        data: { 'id': id },
        type: 'POST', //must use POST, as there're too many ids for some connented users.
        //timeout:60000, 
        dataType: 'json',
        async: true,
        cache: false,
        success: function(data) {
            //console.log(data);
            if (data.hasOwnProperty("idx")) {
                var str =
                    `
                    <div class="cmd" style="padding:0px;text-align:left;" >
                        <table >   
                            <tr>
                                <td class='tdbutton3 prere'   title='Prerequisites' >Prepaire</td>                               
                                <td class='tdbutton3 cover'   title='Coverage' >Coverage</td>   
                                <td class='tdbutton3 steps'   title='Steps' style="background:#707070"  data-selected=1 >Steps</td>  
                                <td class='tdbutton3 diff'    title='Show difference compared to last revision' >Diff</td>  
                                <td class='tdbutton3 restore'    title='Roll back to this revision' >Roll Back</td>  
                                <td class='name'  style="padding:5px; font-weight:bold" ></td>                                
                            </tr>  
                        </table>
                    </div>
                    <div class="content" style="padding:0px" >
                        <div class="c prere" style="display:none" >rerequisites ...</div>
                        <div class="c cover" style="display:none" >coverage ... </div>
                        <div class="c steps" >steps ....</div>
                    </div>
                `;

                objx.html(str);

                var ws = winDimensions();
                objx.find("div.content").css({ width: (ws[0] - 40) + "px" });

                //console.log("rev",objx.data("rev"));
                if (objx.data("rev") == 1) {
                    objx.find("div.cmd").find("td.tdbutton3.diff").hide();
                }
                if (objx.data("rev") == objx.data("revs")) {
                    objx.find("div.cmd").find("td.tdbutton3.restore").hide();
                }
                HistoryIDdata[objx.data("rev")] = data;

                objx.find("div.cmd").find("td.tdbutton3").bind({
                    mouseover: function() {
                        this.style.background = '#707070';
                    },
                    mouseout: function() {
                        if (!$(this).data('selected')) {
                            this.style.background = '#303030';
                        }
                    },
                    click: function() {
                        if (!$(this).hasClass("diff")) {
                            objx.find("div.content").find("div.c").slideUp();
                        }

                        objx.find("div.cmd").find("td.tdbutton3").data("selected", 0).css({ background: '#303030' });
                        if ($(this).hasClass("prere")) {
                            $(this).data('selected', 1);
                            this.style.background = '#707070';
                            objx.find("div.content").find("div.prere").slideDown();

                        } else if ($(this).hasClass("cover")) {
                            $(this).data('selected', 1);
                            this.style.background = '#707070';
                            objx.find("div.content").find("div.cover").slideDown();

                        } else if ($(this).hasClass("steps")) {
                            $(this).data('selected', 1);
                            this.style.background = '#707070';
                            objx.find("div.content").find("div.steps").slideDown();

                        } else if ($(this).hasClass("restore")) {
                            $(this).parent().parent().find("td.name").append(
                                `<div class='question2rollback' style='padding:10px;background:yellow' >
                                    <a style='color:red'>Are you sure to ROLL BACK to this revision #` + objx.data("rev") + `?</a>&nbsp;&nbsp;
                                    <span class='button yes' style=''>&nbsp;YES&nbsp;</span>&nbsp;&nbsp;
                                    <span class='button no'  style=''>&nbsp;NO&nbsp;</span>
                                </div>
                                `
                            ).find("span.button").css({ cursor: "pointer" }).unbind().bind({
                                mouseover: function() {
                                    this.style.background = '#707070';
                                },
                                mouseout: function() {
                                    this.style.background = '';
                                },

                                click: function() {
                                    if ($(this).hasClass("yes")) {
                                        TC_HistoryID_Rollback(id);
                                        stopPropagation();
                                    } else {
                                        $(this).parent().parent().find("div.question2rollback").remove();
                                        stopPropagation();
                                    }
                                }
                            });

                        } else if ($(this).hasClass("diff")) {
                            if (objx.data("rev") > 1) {
                                var lastObj = $('#divTestcase_history').find("td.tdlist.content.R" + (objx.data("rev") - 1));

                                if (lastObj.find("div.content").find("div.steps").length) {
                                    TC_HistoryDiff(objx, lastObj, objx.data("rev"));
                                    $(this).hide();
                                } else {
                                    TC_HistoryID(lastObj, lastObj.data("idx"), this);
                                    //StatusShow(10,"<div style='color:red;background:yellow;padding:10px' >History list: Last revision Rev." + (objx.data("rev")-1)+ " has not been loaded yet!</div>"); 
                                }
                            }
                        }
                    }
                });

                if (data.hasOwnProperty('name') && data['name']) {
                    objx.find("div.cmd").find("td.name").html(encodeHtml(data['name'])).data("rawdata", encodeHtml(data['name']));

                } else {
                    objx.find("div.cmd").find("td.name").html("N/A").data("rawdata", "");
                }

                if (data.hasOwnProperty('prere') && data['prere']) {
                    objx.find("div.content").find("div.prere").html(encodeHtml(data['prere'])).data("rawdata", encodeHtml(data['prere']));
                } else {
                    objx.find("div.content").find("div.prere").html("N/A").data("rawdata", "");
                }

                if (data.hasOwnProperty('coverage') && data['coverage']) {
                    objx.find("div.content").find("div.cover").html(encodeHtml(data['coverage'])).data("rawdata", encodeHtml(data['coverage']));
                } else {
                    objx.find("div.content").find("div.cover").html("N/A").data("rawdata", "").data("rawdata", "");
                }

                if (data.hasOwnProperty('steps')) {
                    var tables = new Array("<table>");

                    tables.push("<tr class='trheader' style='background:#707070' >");
                    tables.push("<td class='tdpreview CN0' ><div style='text-align:center;font-weight:bold;color:#FFFFFF;width:60px' >No.</div></td>");
                    tables.push("<td class='tdpreview CN1' ><div style='text-align:center;font-weight:bold;color:#FFFFFF' >Description</div></td>");
                    tables.push("<td class='tdpreview CN2' ><div style='text-align:center;font-weight:bold;color:#FFFFFF' >Expected Result</div></td>");
                    tables.push("</tr>");

                    var num = 0;
                    var rowdata = {};
                    for (var stepid in data['steps']) {
                        num++;
                        var xbg = '';
                        if (num % 2) {
                            xbg = "class='xbg'";
                        }
                        tables.push("<tr class='trStep ROW" + num + "' " + xbg + ">");
                        tables.push("<td class='tdpreview CN0'   >" + encodeHtml(data['steps'][stepid]['stepNumb']) + "</td>");
                        tables.push("<td class='tdpreview CN1 X' >" + encodeHtml(data['steps'][stepid]['stepDesc']) + "</td>");
                        tables.push("<td class='tdpreview CN2 X' >" + encodeHtml(data['steps'][stepid]['stepExpe']) + "</td>");
                        tables.push("</tr>");

                        rowdata[num] = [encodeHtml(data['steps'][stepid]['stepNumb']), encodeHtml(data['steps'][stepid]['stepDesc']), encodeHtml(data['steps'][stepid]['stepExpe'])];
                    }

                    tables.push("</table>");
                    objx.find("div.content").find("div.steps").html(tables.join(""));

                    for (var row in rowdata) {
                        objx.find("div.content div.steps tr.trStep.ROW" + row + " td.CN0").data("rawdata", rowdata[row][0]);
                        objx.find("div.content div.steps tr.trStep.ROW" + row + " td.CN1").data("rawdata", rowdata[row][1]);
                        objx.find("div.content div.steps tr.trStep.ROW" + row + " td.CN2").data("rawdata", rowdata[row][2]);
                    }
                } else {
                    objx.find("div.content").find("div.steps").html("N/A");
                }

                if (clickObj) {
                    clickObj.click();
                }

                if (dspObj) {
                    dspObj.slideDown();
                    dspObj.data("loaded", 1);
                }
            } else if (data['error']) {
                StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Get history list error! <div>" + data['error'] + "</div></div>");
            }
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Get history list error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus=" + textStatus + "</div>");
        },
    });
}


function TC_HistoryID_Rollback(id) {
    var obname = $('#divTopBar').find('input.txttitle');

    if (!obname.data('idx')) {
        StatusShow(5, "<div style='color:red;background:yellow;padding:10px' >Please [Save] at first!</div>");
        return;
    }
    var idx = obname.data('idx');
    $.ajax({
        url: 'TC_HistoryID_Rollback.php',
        data: { 'idx': idx, 'fromid': id },
        type: 'POST', //must use POST, as there're too many ids for some connented users.
        //timeout:60000, 
        dataType: 'json',
        async: true,
        cache: false,
        success: function(data) {
            if (data['good'] == 1) {
                TC_GetID(idx);
                $('#divTopBar td.tdbutton.steps').click();

                if (data['error']) {
                    StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Roll back! <div>" + data['error'] + "</div></div>");
                }
            } else if (data['error']) {
                StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Rollback error! <div>" + data['error'] + "</div></div>");
            }
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Rollback error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus=" + textStatus + "</div>");
        },
    });
}

function TC_HistoryList() {
    $('#divTestcase_history').empty();
    HistoryIDdata = {};

    var obname = $('#divTopBar').find('input.txttitle');

    if (!obname.data('idx')) {
        StatusShow(5, "<div style='color:red;background:yellow;padding:10px' >Please [Save] at first!</div>");
        return;
    }

    $.ajax({
        url: 'TC_HistoryList.php',
        data: { 'idx': obname.data('idx') },
        type: 'POST', //must use POST, as there're too many ids for some connented users.
        //timeout:60000, 
        dataType: 'text',
        async: true,
        cache: false,
        success: function(data) {
            if (data) {
                $('#divTestcase_history').append(data).find("tr.list.title").bind({
                    mouseover: function() {
                        this.style.background = '#D0D0D0';
                    },
                    mouseout: function() {
                        this.style.background = '#F0F0F0';
                    },
                    click: function() {
                        var w = $('#divTestcase_history').find("tr.list.content.W" + $(this).data("idx"));
                        if (w.css("display") == "none") {
                            if (!w.data("loaded")) {
                                TC_HistoryID(w.find("td.tdlist.content"), $(this).data("idx"), null, w);
                            } else {
                                w.slideDown();
                            }
                        } else {
                            w.slideUp(200);
                        }
                    }
                });


            } else if (data['error']) {
                StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Get history list error! <div>" + data['error'] + "</div></div>");
            }
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Get history list error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus=" + textStatus + "</div>");
        },
    });
}

function TC_ListGet() {
    StatusShow(1, "<div style='background:#00CCFF;padding:10px' >Get list ...</div>");
    //return;

    var wheres = new Array(); //[logic.groupstart, field, logic.x txtsearch.value logic.groupeend logic.andor]
    var groups = 0;
    var groupe = 0;
    var errs = new Array();
    $('#divList_filter tr.search td.tdlistsearch div.divsearch div.content tr.condition').each(function() {
        var val = $(this).find(".txtsearch.value").val().replace(/^\s+|\s+$|\'|\"|\`/ig, '');
        if (val) {
            if ($(this).find("select.logic.groupstart").val()) {
                groups++;
            }

            if ($(this).find("select.logic.groupeend").val()) {
                groupe++;
            }

            if ($(this).find("select.logic.x").val() == "LIKE") {
                val = "%" + val.replace(/\s+/g, "%") + "%";
            }

            if ($(this).find("select.field").val() == "updated_when") {
                if (!val.match(/^\d{4}\-\d{2}\-\d{2}$/)) {
                    errs.push(val + ": the date format is incorrect!")
                } else {
                    ds = val.split('-');

                    if (ds[1] * 1 == 0 || ds[1] * 1 > 12) {
                        errs.push(val + ": the date format is incorrect, wrong month!");
                    } else if ((ds[1] == 2 && ds[2] * 1 > 29) || ((ds[1] == 4 || ds[1] == 6 || ds[1] == 9 || ds[1] == 11) && ds[2] * 1 > 30) || (ds[2] * 1 == 0 || ds[2] * 1 > 31)) {
                        errs.push(val + ": the date format is incorrect, wrong day!");
                    } else {
                        var hrs = 0;
                        var min = 0;
                        var sec = 0;
                        if ($(this).find("select.logic.x").val().match(/^\>$|^\<\=$/i)) {
                            hrs = 23;
                            min = 59;
                            sec = 59;
                        }
                        val = Date.UTC(ds[0] * 1, ds[1] * 1 - 1, ds[2] * 1, hrs, min, sec) / 1000;
                    }
                }
            }

            wheres.push([$(this).find("select.logic.groupstart").val(), $(this).find("select.field").val(), $(this).find("select.logic.x").val(), val,
                $(this).find("select.logic.groupeend").val(), $(this).find("select.logic.andor").val()
            ]);

        }
    });

    if (groups != groupe) {
        StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Search Options setting error! <div>" + groups + " of '(' but " + groupe + " of ')'</div></div>");
        return;
    }

    if (errs.length) {
        StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Search Options setting error! <div>" + errs.join("br />") + "</div></div>");
        return;
    }

    var fields = new Array('idx', 'name', 'steps', 'status', 'createdby', 'by', 'when', 'type2', 'module');
    for (var i = 0; i < fields.length; i++) {
        $('#divList_filter').data('filter_' + fields[i], $('#divList_filter tr.filter input.txtListFilter.' + fields[i]).val());
    }

    $('#divList_filter').css({ visibility: 'hidden' });
    $('#divList_list').empty().css({ visibility: 'hidden' });

    $.ajax({
        url: 'TC_ListGet.php',
        data: { 'curID': ($('#divTopBar').find('input.txttitle').data('idx') ? $('#divTopBar').find('input.txttitle').data('idx') : ''), 'wheres': wheres },
        type: 'POST', //must use POST, as there're too many ids for some connented users.
        //timeout:60000, 
        dataType: 'json',
        async: true,
        cache: false,
        success: function(data) {
            //console.log(data);
            if (data.hasOwnProperty('data') && data['data'] && data['totlal_records']) {
                $('#divList_filter tr.filter td input').css({ width: "20px" });
                $('#divList_filter tr.filter2 td div').css({ width: "" });
                $('#divList_list   tr.filter  td div').css({ width: "" });

                $('#divList_list').html(data['data']).find('tr.list').unbind().bind({
                    mouseover: function() { this.style.background = '#F0F0F0' },
                    mouseout: function() { this.style.background = '' },
                });

                $('#divList_list tr.list td.tdlist.number').css({ cursor: 'pointer', "text-align": "center" }).attr("title", "Click to select/unselect\nDouble-Click to select/unselect all").data("selected", 0).unbind().bind({
                    mouseover: function() {
                        if (!$(this).data("selected")) {
                            this.style.background = '#E0E0E0'
                        }
                    },

                    mouseout: function() {
                        if (!$(this).data("selected")) {
                            this.style.background = ''
                        }
                    },

                    click: function() {
                        if ($(this).data("selected")) {
                            $(this).data("selected", 0).parent().find("td.tdlist").css({ background: "" });
                        } else {
                            $(this).data("selected", 1).parent().find("td.tdlist").css({ background: '#66CCFF' });
                        }

                        TC_ListSelectedStatus()
                    },

                    dblclick: function() {
                        var sel = $(this).data("selected");

                        $('#divList_list tr.list td.tdlist.number').each(function() {
                            if (sel) {
                                $(this).data("selected", 0).parent().find("td.tdlist").css({ background: "" });
                            } else {
                                $(this).data("selected", 1).parent().find("td.tdlist").css({ background: '#66CCFF' });
                            }
                        })

                        TC_ListSelectedStatus()
                    }
                });

                $('#divList_list tr.list td.tdlist.module.owned').css({ cursor: 'pointer', "text-align": "center" }).attr("title", "double click to change value").unbind().bind({
                    mouseover: function() {
                        this.style.background = '#E0E0E0'
                    },
                    mouseout: function() {
                        this.style.background = ''
                    },
                    dblclick: function() {
                        TC_ListFieldChange(this, "module")
                    }
                });

                $('#divList_list tr.list td.tdlist.name.owned').css({ cursor: 'pointer' }).attr("title", "double click to change value").unbind().bind({
                    mouseover: function() {
                        this.style.background = '#E0E0E0'
                    },
                    mouseout: function() {
                        this.style.background = ''
                    },
                    dblclick: function() {
                        TC_ListFieldChange(this, "name")
                    }
                });

                $('#divList_list').find('td.tdlist.idx').not(".idxx").css({ color: 'blue', cursor: 'pointer' }).attr("title", "click to open this ID").unbind().bind({
                    click: function() {
                        TC_GetID($(this).html());

                        $('#divList_list').find("td.tdlist").not(".idx").not(".idxx").each(function() {
                            var status = $(this).parent().find("td.tdlist.status").html();
                            if (status.match(/done/i)) {
                                $(this).css({ "color": "green" });
                            } else if (status.match(/inwork/i)) {
                                $(this).css({ "color": "" });
                            } else {
                                $(this).css({ "color": "#606060" });
                            }
                        });

                        $(this).parent().find("td.tdlist").css({ "color": "blue" });
                    }
                });

                $('#divList_list').find('td.tdlist.delete').css({ color: 'red', cursor: 'pointer', 'text-align': 'center' }).unbind().bind({
                    click: function() {
                        TC_DeleteID($(this).parent().find('td.tdlist.idx').html(), this);
                    }
                });

                $('#divList_list').find('td.tdlist.restore').css({ color: 'blue', cursor: 'pointer', 'text-align': 'center' }).unbind().bind({
                    click: function() {
                        TC_RestoreID($(this).data("dbid"), $(this).parent().find('td.tdlist.idxx').html().replace(/\-/g, ''));
                    }
                });

                $('#divList_filter tr.filter input.txtListFilter').not(".delete").unbind().bind({
                    keyup: function() {
                        var nshow = 0;
                        var steps_total = 0;
                        var steps_show = 0;

                        var exps = new Array();
                        var go = 0;
                        for (var i = 0; i < fields.length; i++) {
                            var thisx = $('#divList_filter tr.filter input.txtListFilter.' + fields[i]);
                            var fv = thisx.val().replace(/^\s*|\s*$/g, '').replace(/\s+/g, '\\\s*.*');
                            if (fv) {
                                exps.push(new RegExp(fv, "i"));
                                thisx.css({ background: "#FFFFCC" });
                                go++;
                            } else {
                                exps.push('');
                                thisx.css({ background: "" });
                            }
                        }

                        //console.log(exps);
                        if (go) {
                            $('#divList_list').find('tr.list').each(function() {
                                var isdisplay = 1;
                                var stp = $(this).find("td.tdlist.steps").html() * 1;
                                steps_total += stp;

                                for (var i = 0; i < fields.length; i++) {
                                    if (exps[i]) {
                                        var ss = $(this).find('td.tdlist.' + fields[i]).html();
                                        if (!ss.match(exps[i])) {
                                            isdisplay = 0;
                                            break;
                                        }
                                    }
                                }

                                if (isdisplay) {
                                    $(this).show();
                                    nshow++;
                                    steps_show += stp;
                                } else {
                                    $(this).hide();
                                }
                            });
                        } else {
                            $('#divList_list').find('tr.list').show();
                            nshow = $('#divList_list').find('tr.list').length;

                            $('#divList_list').find('tr.list').each(function() {
                                steps_total += $(this).find("td.tdlist.steps").html() * 1;
                            });
                            steps_show = steps_total;
                        }

                        $('#divList_filter').find('.span_status').html("show " + nshow + "/" + $('#divList_list').find('tr.list').length + ", steps " + steps_show + "/" + steps_total);
                    }
                });

                $('#divList_list tr.list.delete td.name').css({ "text-decoration": "line-through" });

                window.setTimeout(function() {
                    TC_ListResize(0, "TC_ListGet");

                    //console.log("");
                    for (var i = 0; i < fields.length; i++) {
                        //console.log(fields[i], $('#divList_filter').data('filter_' + fields[i]));
                        if ($('#divList_filter').data('filter_' + fields[i])) {
                            $('#divList_filter tr.filter input.txtListFilter.' + fields[i]).val($('#divList_filter').data('filter_' + fields[i]));
                        }
                    }
                    $('#divList_filter tr.filter input.txtListFilter.idx').keyup();
                }, 500);

            } else if (data['totlal_records'] == 0) {
                StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Get list<div>No records</div></div>");
                $('#divList_filter').css({ visibility: 'visible' });

            } else if (data['error']) {
                StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Get list error! <div>" + data['error'] + "</div></div>");
                $('#divList_filter').css({ visibility: 'visible' });
            }
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Get list error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus=" + textStatus + "</div>");
            $('#divList_filter').css({ visibility: 'visible' });
        },
    });
}

function TC_ListSelectedStatus() {
    var nsel = 0;
    $('#divList_list tr.list td.tdlist.number').each(function() {
        if ($(this).data("selected")) {
            nsel++;
        }
    });

    $('#divList_filter').find('.span_select_status').html("selected " + nsel + "/" + $('#divList_list').find('tr.list').length);
}

function TC_ListFieldChange(_this, field) {
    var name = $(_this).html();
    $(_this).css({ "padding": "0px" }).html("<input class='txtListName' type='text' />").find("input.txtListName")
        .val(name)
        .data("string", name)
        .css({ width: $('#divList_filter tr.filter input.txtListFilter.' + field).css("width").replace(/px/i, '') })
        .unbind().bind({
            dblclick: function() {
                stopPropagation();
            },

            blur: function() {
                var val = $(this).val().replace(/^\s+|\s+$/g, '');
                if (val && val != $(this).data("string")) {
                    TC_ListUpdateField(_this, val, field);
                } else {
                    $(_this).css({ "padding": "5px" }).html(val);
                }
            }
        });
}

function TC_ListUpdateField(_thisx, value, field) {
    var idx = $(_thisx).parent().find("td.tdlist.idx").html().replace(/\-/g, '');
    //console.log(idx,field,value);

    $.ajax({
        url: 'TC_ListUpdateField.php',
        data: { "idx": idx, 'thread': myThreadNumber, "value": value, "field": field },
        type: 'POST', //must use POST, as there're too many ids for some connented users.
        //timeout:60000, 
        dataType: 'text',
        async: true,
        cache: false,
        success: function(data) {
            if (data == 1) {
                $(_thisx).css({ "padding": "5px" }).html(value);
            } else {
                StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Update name error! <div>" + data + "</div></div>");
            }
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Update name error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus=" + textStatus + "</div>");
        },
    });
}

function TC_ListHeight() {
    $('#divList_list').css({ height: ($("#divList").get(0).offsetHeight - $("#divList_filter").get(0).offsetHeight - 10) + "px", 'overflow-y': "auto" });
}

function TC_ListResize(act, from) {
    var colums = $('#divList_list tr.filter td.tdlistFilter').length - 1;
    if (act) {
        $('#divList_filter tr.filter td input').css({ width: "20px" });
        $('#divList_filter tr.filter2 td div').css({ width: "" });
        $('#divList_list   tr.filter  td div').css({ width: "" });
    }

    for (var i = 0; i <= colums; i++) {
        var offset = 11;
        if (i == 0) {
            offset = 11;
        }
        //console.log(i);
        var tw = $('#divList_list   tr.filter  td.CN' + i + " div").get(0).offsetWidth + offset;
        var twf = $('#divList_filter tr.filter2 td.CN' + i + " div").get(0).offsetWidth + offset;
        var tww = tw > twf ? tw : twf;

        //console.log($('#divList_filter tr.header td.CN' + i).html(),tw, twf , tww);
        if (i > 0) {
            $('#divList_filter tr.filter td.CN' + i + ' input').css({ width: (tww - offset) + "px" });
        }

        $('#divList_filter tr.filter2 td.CN' + i).find("div").css({ background: "blue", width: tww + "px" });
        $('#divList_list   tr.filter  td.CN' + i).find("div").css({ background: "#FFFFFF", width: tww + "px" });
    }

    $('#divList_filter').css({ visibility: 'visible' });
    $('#divList_list').data("bodywidth", $('#divList_list').get(0).offsetWidth).css({ visibility: 'visible' });

    var t = 0;
    $('#divList_list tr.list').each(function() {
        t += 10;
        var _this = this;
        window.setTimeout(function() {
            $(_this).find("td.IV").css({ visibility: 'visible' });
        }, t);
    });

    TC_ListHeight();

    if (from == "TC_ListGet") {
        $('#divList_filter tr.search td.tdcoulmns-display td.tdlisth').not(".CN0").not(".CN1").not(".CN2").not(".CN3").each(function() {
            if ($(this).data("display")) {
                $('#divList_list   table tr').find("td:eq(" + $(this).data("colnum") + ")").show();
            } else {
                $('#divList_list   table tr').find("td:eq(" + $(this).data("colnum") + ")").hide();
            }
        });
    }

    ws = winDimensions();
    $('#divList_filter td.tdlistspace.s2 div.tdlistspace').css({ width: (ws[0] - 10) + 'px' });

    if (act == 0) {
        window.setTimeout(function() {
            $('#divTopBar td.tdbutton.columns-list').click();
        }, 200);
    }
}

function TC_RestoreID(dbid, idx) {
    StatusShow(1, "<div style='background:#00CCFF;padding:10px;color:red' >Restore ID (" + idx + ") ...</div>");
    //return;
    $.ajax({
        url: 'TC_RestoreID.php',
        data: { dbid: dbid, idx: idx },
        type: 'POST', //must use POST, as there're too many ids for some connented users.
        //timeout:60000, 
        dataType: 'text',
        async: true,
        cache: false,
        success: function(data) {
            //console.log(data);
            if (data == 1) {
                StatusShow(5, "<div style='background:#009966;padding:10px' >Restore ID (" + idx + "): done!</div>");
                TC_ListGet();
            } else if (data) {
                StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Restore ID (" + idx + ") error! <div>" + data + "</div></div>");
            }
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Restore ID (" + idx + ") error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus=" + textStatus + "</div>");
        },
    });
}

function TC_DeleteID(idx, objdel) {
    StatusShow(1, "<div style='background:#00CCFF;padding:10px;color:red' >Delete ID (" + idx + ") ...</div>");
    //return;
    $.ajax({
        url: 'TC_DeleteID.php',
        data: { idx: String(idx).replace(/\-/g, '') },
        type: 'POST', //must use POST, as there're too many ids for some connented users.
        //timeout:60000, 
        dataType: 'text',
        async: true,
        cache: false,
        success: function(data) {
            //console.log(data);
            if (data == 1) {
                StatusShow(5, "<div style='background:#009966;padding:10px' >Delete ID (" + idx + "): done!</div>");

                $(objdel).empty();
                $(objdel).parent().find("td.tdlist").css({ "text-decoration": "line-through", "cursor": "default", "background": "" }).unbind().data("selected", 0);
            } else if (data) {
                StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Delete ID (" + idx + ") error! <div>" + data + "</div></div>");
            }
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Delete ID (" + idx + ") error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus=" + textStatus + "</div>");
        },
    });
}

function TC_Save(act) {
    var obname = $('#divTopBar').find('input.txttitle');
    var name = String(obname.val()).replace(/^\s*|\s*$/, '');
    obname.val(name);

    if (!name) {
        obname.css('background', '#FFFF66');
        if (act) {
            StatusShow(5, "<div style='color:red;background:yellow;padding:10px' >Please input a name!</div>");
        }
        return;
    }

    var data = {};
    data['idx'] = '';
    if (obname.data('idx')) {
        data['idx'] = obname.data('idx');
    } else {
        data['idx'] = (new Date()).getTime();
        obname.data('idx', data['idx']);
    }

    data['name'] = name;
    data['status'] = obname.data("status");
    data['checkin_time'] = obname.data('checkin_time');
    data['created_by'] = (obname.data('created_by') ? obname.data('created_by') : '');
    data['module'] = (obname.data('module') ? obname.data('module') : '');
    data['prere'] = $('#divTestcase_prerequisites').find('textarea.prere').val().replace(/^\'+|^\"+|\'*\s*\n*$|\"*\s*\n*$/g, '').replace(/\"+/g, '"');
    data['coverage'] = $('#divTestcase_prerequisites').find('textarea.coverage').val().replace(/^\'+|^\"+|\'*\s*\n*$|\"*\s*\n*$/g, '').replace(/\"+/g, '"');
    data['steps'] = {}
    data['covered_story'] = {}
    data['thread'] = myThreadNumber;

    $('#divTestcase_prerequisites').find('textarea.prere').val(data['prere']).data('string', data['prere']);
    $('#divTestcase_prerequisites').find('textarea.coverage').val(data['coverage']).data('string', data['coverage']);

    var idnum = 0;
    $('#divAllSteps').find('.trstep').each(function() {
        idnum++;
        var stepid = idnum;
        $(this).data('stepid', stepid);

        data['steps'][stepid] = {}
        data['steps'][stepid]['stepNumb'] = "Step-" + idnum;
        data['steps'][stepid]['stepDesc'] = $(this).find('td.tdsteps.desc').find('textarea').val().replace(/^\'+|^\"+|\'*\n*$|\"*\n*$/g, '').replace(/\"+/g, '"');
        data['steps'][stepid]['stepExpe'] = $(this).find('td.tdsteps.expected').find('textarea').val().replace(/^\'+|^\"+|\'*\n*$|\"*\n*$/g, '').replace(/\"+/g, '"');

        $(this).find('input.txtStepNum').data('string', "Step-" + idnum).val("Step-" + idnum);
        $(this).find('td.tdsteps.desc').find('textarea').data('string', $(this).find('td.tdsteps.desc').find('textarea').val()).val(data['steps'][stepid]['stepDesc']);
        $(this).find('td.tdsteps.expected').find('textarea').data('string', $(this).find('td.tdsteps.expected').find('textarea').val()).val(data['steps'][stepid]['stepExpe']);
    });

    $("#divCoverageDetail div.contentx div.story").each(function() {
        var sid = $(this).data("dbid");
        var name = $(this).find("div.titlexx li").html();
        data['covered_story'][sid] = new Array();
        if (sid) {
            $(this).find("tr").each(function() {
                if ($(this).data("selected")) {
                    data['covered_story'][sid].push([$(this).data("rownum"), $(this).data("string")]);
                }
            });
        }
    });

    //console.log(data)
    StatusShow(1, "<div style='background:#00CCFF;padding:10px' >Saving data ...</div>");
    //return;

    $.ajax({
        url: 'TC_Save.php',
        data: { 'data': data },
        type: 'POST', //must use POST, as there're too many ids for some connented users.
        //timeout:60000, 
        dataType: 'text',
        async: true,
        cache: false,
        success: function(data) {
            if (data == 1) {
                $('#divAllSteps').find('textarea').each(function() {
                    TC_InputCheck(this);
                });
                $('#divAllSteps').find('input.txtStepNum').each(function() {
                    TC_InputCheck(this);
                });

                StatusShow(5, "<div style='background:#009966;padding:10px' >Saving data: done!</div>");
            } else {
                StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Saving data error! <div>" + data + "</div></div>");
            }
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Saving data error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus=" + textStatus + "</div>");
        },
    });
}

function TC_UpdateStatus(status) {
    var obname = $('#divTopBar').find('input.txttitle');
    var name = String(obname.val()).replace(/^\s*|\s*$/, '');
    if (!name) {
        obname.css('background', '#FFFF66');
        StatusShow(5, "<div style='color:red;background:yellow;padding:10px' >Please input a name!</div>");
        return;
    }

    if (!obname.data('idx')) {
        StatusShow(5, "<div style='color:red;background:yellow;padding:10px' >Please [Save] at first!</div>");
        return;
    }

    $.ajax({
        url: 'TC_UpdateStatus.php',
        data: { 'status': status, "idx": obname.data('idx'), 'thread': myThreadNumber },
        type: 'POST', //must use POST, as there're too many ids for some connented users.
        //timeout:60000, 
        dataType: 'text',
        async: true,
        cache: false,
        success: function(data) {
            if (data == 1) {
                $('#divTopBar').find('input.txttitle').data("status", status);
                $('#divTopBar').find('td.tdbutton.status').html(status);

                StatusShow(5, "<div style='background:#009966;padding:10px' >Update status: done!</div>");
            } else {
                StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Update status error! <div>" + data + "</div></div>");
            }
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Update status error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus=" + textStatus + "</div>");
        },
    });
}

function TC_Copy_ListSelect(obj) {
    var fromlist = new Array();
    $('#divList_list tr.list td.tdlist.number').each(function() {
        if ($(this).data("selected")) {
            var idx = $(this).parent().find("td.tdlist.idx").html().replace(/\-/g, '');
            if (idx) {
                fromlist.push(idx);
            }
        }
    });

    if (fromlist.length) {
        //console.log(fromlist);        
        TC_Copy('', fromlist, obj);
    } else {
        StatusShow(5, "<div style='color:red;background:yellow;padding:10px' >Please select at least row to do Copy!</div>");
    }
}

function TC_CopyListGet() {
    $('#sel_copy_idxs').empty();

    $.ajax({
        url: 'TC_CopyListGet.php',
        //data: {},
        type: 'POST', //must use POST, as there're too many ids for some connented users.
        //timeout:60000, 
        dataType: 'json',
        async: true,
        cache: false,
        success: function(data) {
            if (data && data.hasOwnProperty("list")) {
                $('#sel_copy_idxs').append(data['list']);
                $("#sel_copy_idxs option").unbind().bind({
                    click: function() {
                        //console.log($(this).html());
                        if ($(this).html().match(/FunctionX/i)) {
                            $('#div_copy').find('td.tdbutton.go').css({ visibility: 'hidden' });
                        } else {
                            $('#div_copy').find('td.tdbutton.go').css({ visibility: 'visible' });
                        }
                    }
                });

                $('#div_copy').slideDown(200, function() {
                    $('#div_copy').find('input.txtfilter_copy').css({ width: ($('#sel_copy_idxs').get(0).offsetWidth - 10) + "px" }).keyup();
                });
            } else if (data["error"]) {
                StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Get id list error! <div>" + data["error"] + "</div></div>");
            } else {
                StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Get id list unkown error!</div>");
            }
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Get id list error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus=" + textStatus + "</div>");
        },
    });

}

function TC_Copy(fromidx, fromlist, obj, action) {
    if (!action) {
        action = "copy";
    }

    var obname = $('#divTopBar').find('input.txttitle');
    var name = '';
    var idx = '';
    if (fromidx) {
        name = String(obname.val()).replace(/^\s*|\s*$/, '');
        obname.val(name);

        if (!name) {
            obname.css('background', '#FFFF66');
            StatusShow(5, "<div style='color:red;background:yellow;padding:10px' >Please input a name!</div>");
            return;
        }

        if (obname.data('idx')) {
            idx = obname.data('idx');
        } else {
            idx = (new Date()).getTime();
            obname.data('idx', idx);
        }
    }

    //console.log(data)
    StatusShow(1, "<div style='background:#00CCFF;padding:10px' >Copy data ...</div>");
    //return;
    $(obj).css({ "visibility": "hidden" });
    $.ajax({
        url: 'TC_Copy.php',
        data: { 'fromidx': fromidx, 'toidx': idx, 'name': name, 'fromlist': fromlist, 'action': action },
        type: 'POST', //must use POST, as there're too many ids for some connented users.
        //timeout:60000, 
        dataType: 'text',
        async: true,
        cache: false,
        success: function(data) {
            if (data == 1) {
                if (idx) {
                    TC_GetID(idx);
                    $('#div_copy').find('span.tdbutton.cancel').click();
                } else {
                    $('#divTopBar td.tdbutton.refresh-list').click();
                }
                StatusShow(5, "<div style='background:#009966;padding:10px' >" + action + " data: done!</div>");
            } else {
                StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >" + action + " data error! <div>" + data + "</div></div>");
            }
        },

        complete: function() {
            $(obj).css({ "visibility": "visible" });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >" + action + " data error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus=" + textStatus + "</div>");
        },
    });
}

function TC_SmartInit(side, IsResize, ws) {
    $("#div_smart").empty();

    if (!ws) {
        ws = winDimensions();
    }

    var style = {};
    var anstyle = {};
    if (side == "right") {
        anstyle["A"] = { left: (ws[0] - 380) + 'px' };
        style["A"] = { height: (ws[1] - 50) + 'px' };
        if ($('#div_smart').data("onside") == "top") {
            anstyle["B"] = { width: '380px', top: '50px', right: '0px', left: "", height: $("#div_smart").get(0).offsetHeight + 'px' };
            style["B"] = { bottom: '0px', height: "" };
        } else {
            anstyle["B"] = { width: '380px', bottom: '0px', right: '0px', left: "", height: $("#div_smart").get(0).offsetHeight + 'px' };
            style["B"] = { top: '50px', height: "" };
        }

    } else if (side == "left") {
        anstyle["A"] = { right: (ws[0] - 380) + 'px' };
        style["A"] = { height: (ws[1] - 50) + 'px' };
        if ($('#div_smart').data("onside") == "top") {
            anstyle["B"] = { width: '380px', right: '', left: "0px", top: '50px', height: $("#div_smart").get(0).offsetHeight + 'px' };
            style["B"] = { bottom: '0px', height: "" };
        } else {
            anstyle["B"] = { width: '380px', bottom: '0px', right: '', left: "0px", height: $("#div_smart").get(0).offsetHeight + 'px' };
            style["B"] = { top: '50px', height: "" };
        }

    } else if (side == "top") {
        anstyle["A"] = { bottom: (ws[1] * 3 / 4 - 50) + 'px' };
        style["A"] = { width: ws[0] + 'px' };
        if ($('#div_smart').data("onside") == "left") {
            anstyle["B"] = { top: '50px', bottom: '', left: "0px", height: ws[1] / 4 + 'px' };
            style["B"] = { right: '0px', width: '' };
        } else {
            anstyle["B"] = { top: '50px', bottom: '', right: '0px', height: ws[1] / 4 + 'px' };
            style["B"] = { left: "0px", width: '' };
        }

    } else if (side == "bottom") {
        anstyle["A"] = { top: ws[1] * 3 / 4 + 'px' };
        style["A"] = { width: ws[0] + 'px' };
        if ($('#div_smart').data("onside") == "left") {
            anstyle["B"] = { top: '', bottom: '0px', left: "0px", height: ws[1] / 4 + 'px' };
            style["B"] = { right: '0px', width: '' };
        } else {
            anstyle["B"] = { top: '', bottom: '0px', right: '0px', height: ws[1] / 4 + 'px' };
            style["B"] = { left: "0px", width: '' };
        }
    }

    $("#div_smart").animate(
        anstyle["A"],
        500,
        function() {
            $("#div_smart").css(anstyle["B"]);
            TC_SmartReshape(side, style, IsResize);
        }
    );
}

function TC_SmartReshape(side, style, IsResize) {
    $("#div_smart").data("onside", side);

    var str = "";
    if (side == "left" || side == "right") {
        str =
            `<div style='padding:5px'>
                <div class="divfindings lines" title=" Press and release [Shift] key 2 times in 0.5 second, to select the first one; &#10 Click to select anyone;" ></div>
                <div class="divfindings steps" title=" Press and release [Ctrl ] key 2 times in 0.5 second, to select the first one; &#10 Click to select anyone;" ></div>
            </div>
            <div class="header" >
                <table style="width:100%">   
                    <tr>
                        <td class='tdbutton2 left'      title='on left side'  ><</td>                               
                        <td class='tdbutton2 right'     title='on right side' >></td>  
                        <td class='tdbutton2 top'       title='on top side' >∧</td>  
                        <td class='tdbutton2 bottom'    title='on bottom side' >∨</td>
                        <td class='tdbutton2 increase'  title='increase this window width' >+</td>                   
                        <td class='tdbutton2 decrease'  title='decrease this window width' >-</td>  
                        <td class='tdbutton2 refresh'   title='refresh to learn more experience' >R</td>  
                        <td class='tdbutton2 hide'      title='Hide' >X</td>             
                    </tr>  
                </table>
            </div>`;
    } else {
        str =
            `<table><tr> 
                <td style='padding:0px;border-style:none'>
                    <div class='tdbutton2 button5 left'      title='on left side'  ><</div>                               
                    <div class='tdbutton2 button5 right'     title='on right side' >></div>  
                    <div class='tdbutton2 button5 top'       title='on top side' >∧</div>  
                    <div class='tdbutton2 button5 bottom'    title='on bottom side' >∨</div>        
                </td>            
                <td style='padding:5px;border-style:none'>
                    <div class="divfindings lines" title=" Press and release [Shift] key 2 times in 0.5 second, to select the first one; &#10 Click to select anyone;" ></div>
                </td>
                <td style='padding:5px;border-style:none'>
                    <div class="divfindings steps" title=" Press and release [Ctrl ] key 2 times in 0.5 second, to select the first one; &#10 Click to select anyone;" ></div>
                </td>
                <td style='padding:0px;border-style:none'>
                    <div class='tdbutton2 button5 increase'  title='increase this window height' >+</div>                   
                    <div class='tdbutton2 button5 decrease'  title='decrease this window height' >-</div>  
                    <div class='tdbutton2 button5 refresh'   title='refresh to learn more experience' >R</div>  
                    <div class='tdbutton2 button5 hide'      title='Hide' >X</div>             
                </td>
            </tr></table>`;
    }

    $("#div_smart").animate(
        style["A"],
        500,
        function() {
            $("#div_smart").append(str).css(style["B"]);
            TC_SmartReshapeEvent();
            if (IsResize) {
                TC_SmartResize(side);
            }
        }
    );
}

function TC_SmartReshapeEvent() {
    $('#div_smart').find('.tdbutton2').unbind().bind({
        mouseover: function() {
            this.style.background = '#707070';
        },
        mouseout: function() {
            this.style.background = '#303030';
        },
        click: function() {
            if ($(this).hasClass('left')) {
                TC_SmartResize('left');

            } else if ($(this).hasClass('right')) {
                TC_SmartResize('right');

            } else if ($(this).hasClass('top')) {
                TC_SmartResize('top');

            } else if ($(this).hasClass('bottom')) {
                TC_SmartResize('bottom');

            } else if ($(this).hasClass('increase')) {
                if ($("#div_smart").data("onside") == 'left' || $("#div_smart").data("onside") == 'right') {
                    var w = $('#div_smart').get(0).offsetWidth * 1.1;
                    $('#div_smart').animate({ width: w + "px" },
                        100,
                        function() {
                            TC_SmartResize($("#div_smart").data("onside"));
                        }
                    );
                } else {
                    var h = $('#div_smart').get(0).offsetHeight * 1.1;
                    $('#div_smart').animate({ height: h + "px" },
                        100,
                        function() {
                            TC_SmartResize($("#div_smart").data("onside"));
                        }
                    );
                }

            } else if ($(this).hasClass('decrease')) {
                if ($("#div_smart").data("onside") == 'left' || $("#div_smart").data("onside") == 'right') {
                    var w = $('#div_smart').get(0).offsetWidth * 0.9;
                    $('#div_smart').animate({ width: w + "px" },
                        100,
                        function() {
                            TC_SmartResize($("#div_smart").data("onside"));
                        }
                    );
                } else {
                    var h = $('#div_smart').get(0).offsetHeight * 0.9;
                    $('#div_smart').animate({ height: h + "px" },
                        100,
                        function() {
                            TC_SmartResize($("#div_smart").data("onside"));
                        }
                    );
                }
            } else if ($(this).hasClass('refresh')) {
                TC_SmartLearn();

            } else if ($(this).hasClass('hide')) {
                $('#div_smart').slideUp();
                $('#div_smart').data("smarton", 0);
                $('#div_smart').find("div.divfindings").empty();

                TC_SmartResize("");
            }
        }
    });

}


function TC_SmartResize(side) {
    var ws = winDimensions();
    var isReform = 0;
    if (side) {
        if ($('#div_smart').data("onside") == "right" || $('#div_smart').data("onside") == "left") {
            if (side == "top" || side == "bottom") {
                isReform = 1;
            }
        } else {
            if (side == "left" || side == "right") {
                isReform = 1;
            }
        }
        if (isReform) {
            TC_SmartInit(side, 1, ws);
            return;
        }
    }

    var wx = ws[0] - $("#div_smart").get(0).offsetWidth;
    var smartw = $("#div_smart").get(0).offsetWidth;
    var smarth = $("#div_smart").get(0).offsetHeight;

    if (side == "left") {
        if ($("#div_smart").data("onside") == "right") {
            $("#div_smart").css({ left: (ws[0] - smartw) + "px", top: "50px", bottom: "0px", height: "" }).animate({ left: "0px", right: (ws[0] - smartw) + "px" },
                500,
                function() {
                    $("#div_smart").css({ right: "" });
                }
            );
            $("#divTestcase").css({ width: wx + 'px' }).animate({ left: smartw + "px", right: (ws[0] - smartw) + "px" },
                500,
                function() {
                    $("#divTestcase").css({ right: "", top: "50px", bottom: "0px" });
                }
            );
        } else {
            $("#div_smart").css({ left: "0px", right: "", top: "50px", bottom: "0px", height: "" });
            $("#divTestcase").css({ right: "", left: smartw + "px", width: wx + 'px', top: "50px", bottom: "0px" });
        }
    } else if (side == "right") {
        if ($("#div_smart").data("onside") == "left") {
            $("#div_smart").css({ top: "50px", bottom: "0px", height: "" }).animate({ left: (ws[0] - smartw) + "px" },
                500,
                function() {
                    $("#div_smart").css({ left: "", right: "0px" });
                }
            );
            $("#divTestcase").css({ width: wx + 'px', top: "50px", bottom: "0px" }).animate({ right: smartw + "px", left: "0px" },
                500,
                function() {
                    $("#div_smart").css({ left: "" });
                }
            );
        } else {
            $("#div_smart").css({ left: "", right: "0px", top: "50px", bottom: "0px", height: "" });
            $("#divTestcase").css({ left: "", right: smartw + "px", width: wx + 'px', top: "50px", bottom: "0px" });
        }
    } else if (side == "top") {
        if ($("#div_smart").data("onside") == "bottom") {
            $("#div_smart").css({ top: (ws[1] - smarth) + "px", bottom: "" }).animate({ top: "50px" },
                500
            );
        } else {
            $("#div_smart").css({ height: smarth + 'px', width: "", left: "0px", right: "0px", top: "50px", bottom: "" });
        }

        wx = ws[0];
        $("#divTestcase").css({ left: "0px", right: "0px", top: (50 + smarth) + "px", bottom: "0px", width: "", height: "" });

    } else if (side == "bottom") {
        if ($("#div_smart").data("onside") == "top") {
            $("#div_smart").animate({ top: (ws[1] - smarth) + "px" },
                500,
                function() {
                    $("#div_smart").css({ top: "", bottom: "0px" });
                }
            );
        } else {
            $("#div_smart").css({ height: smarth + 'px', width: "", left: "0px", right: "0px", top: "", bottom: "0px" });
        }

        wx = ws[0];
        $("#divTestcase").css({ left: "0px", right: "0px", top: "50px", bottom: (smarth + 5) + "px", width: "", height: "" });

    } else {
        wx = ws[0];
        $("#divTestcase").css({ left: "0px", right: "0px", top: "50px", bottom: "0px", width: "", height: "" });
    }

    //if(side == "left" || side == "right"){
    ttw = (wx - 220) / 2;
    $('#divAllSteps').find('textarea').animate({ width: ttw + 'px' },
        500,
        function() {
            TC_StepsTableColWidth();
        }
    );
    //}  

    if (side) {
        $("#div_smart").data("onside", side);
        TC_SmartFindingsHeight(ws);
    }
}

function TC_SmartFindingsHeight(ws) {
    if ($("#div_smart").data("onside") == "left" || $("#div_smart").data("onside") == "right") {
        $('#div_smart').find("div.divfindings").css({
            height: ($('#div_smart').get(0).offsetHeight - $('#div_smart').find("div.header").get(0).offsetHeight - 10) / 2 + 'px'
        });
    } else {
        if (!ws) {
            ws = winDimensions();
        }

        //console.log('#div_smart.offsetHeight', $('#div_smart').get(0).offsetHeight);
        var h = $('#div_smart').get(0).offsetHeight - 10;
        if (h < 35 * 4) {
            h = 35 * 4;
        }

        $('#div_smart').find("div.divfindings").css({
            height: h + 'px',
            width: (ws[0] - 140) / 2 + 'px'
        });
    }

    $('#divAllSteps').css({ height: ($('#divTestcase').get(0).offsetHeight - $('#divStepsHeader').get(0).offsetHeight - 10) + 'px' });
    $("#div_smart").css({ height: '' });
}

function TC_SmartAdd(s) {
    //return;
    if (!s.replace(/^\s+|\s+$/g, '').length) {
        return;
    }

    if (TC_SmartSets.hasOwnProperty("steps")) {
        var e = 0;
        var num = 0;
        for (var n in TC_SmartSets["steps"]) {
            if (TC_SmartSets["steps"][n][1] == s) {
                TC_SmartSets["steps"][n][0]++;
                e = 1;
                break;
            }

            if (n > num) {
                num = n;
            }
        }

        if (e == 0) {
            var n = num * 1 + 1;
            TC_SmartSets["steps"][n] = new Array([1, s]);
            TC_SmartSets2["steps"][n] = TC_SmartStrFormat(s);
        }
    } else {
        TC_SmartSets["steps"] = {};
        TC_SmartSets["steps"][1] = new Array([1, s]);

        if (!TC_SmartSets2.hasOwnProperty("steps")) {
            TC_SmartSets2["steps"] = {}
        }
        TC_SmartSets2["steps"][1] = TC_SmartStrFormat(s);
    }

    var lines = s.split(/\n/);
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line) {
            if (TC_SmartSets.hasOwnProperty("lines")) {
                var e = 0;
                var num = 0;
                for (var n in TC_SmartSets["lines"]) {
                    if (TC_SmartSets["lines"][n][1] == line) {
                        TC_SmartSets["lines"][n][0]++;
                        e = 1;
                        break;
                    }

                    if (n > num) {
                        num = n;
                    }
                }

                if (e == 0) {
                    var n = num * 1 + 1;
                    TC_SmartSets["lines"][n] = new Array([1, line]);
                    TC_SmartSets2["lines"][n] = TC_SmartStrFormat(line);
                }
            } else {
                TC_SmartSets["lines"] = {};
                TC_SmartSets["lines"][1] = new Array([1, line]);

                if (!TC_SmartSets2.hasOwnProperty("lines")) {
                    TC_SmartSets2["lines"] = {}
                }
                TC_SmartSets2["lines"][1] = TC_SmartStrFormat(line);
            }
        }
    }
}

var TC_SmartSets = {};
var TC_SmartSets2 = {};

function TC_SmartLearn() {
    //console.log('Learn from data ...');
    $.ajax({
        url: 'TC_SmartGetData.php',
        data: {},
        type: 'POST', //must use POST, as there're too many ids for some connented users.
        //timeout:60000, 
        dataType: 'json',
        async: true,
        cache: false,
        success: function(data) {
            if (data) {
                //console.log(data);
                TC_SmartSets = data['data'];

                for (var fd in TC_SmartSets) {
                    if (!TC_SmartSets2.hasOwnProperty(fd)) {
                        TC_SmartSets2[fd] = {}
                    }

                    for (var n in TC_SmartSets[fd]) {
                        TC_SmartSets2[fd][n] = TC_SmartStrFormat(TC_SmartSets[fd][n][1]);
                    }
                }
                //StatusShow(5,"<div style='background:#009966;padding:10px' >Learn from data: done!</div>"); 
            } else {
                StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Learn from data error! <div>" + data + "</div></div>");
            }
        },

        error: function(XMLHttpRequest, textStatus, errorThrown) {
            StatusShow(10, "<div style='color:red;background:yellow;padding:10px' >Learn from data error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus=" + textStatus + "</div>");
        },
    });
}

function TC_SmartCheck(thisx) {
    $('#div_smart').find("div.divfindings").empty();
    if (!$('#div_smart').data("smarton") || !TC_SmartSets) {
        return;
    }

    TC_SmartFindingsHeight();

    var value = $(thisx).val().replace(/^\s+|\s+$/g, '');
    if (value.length < 3) {
        return;
    }

    smartLastThis = [thisx, value.length];
    //console.log("");
    var st = (new Date()).getTime();
    var kkk = 0;
    var fields = new Array("lines", "steps");
    var k = 0;
    var counts = { "lines": 0, "steps": 0 };
    var line2steps = {};

    for (zz = 0; zz < fields.length; zz++) {
        var fd = fields[zz];
        var str = "";
        var lines = {};
        var kk = 0;
        var stt = (new Date()).getTime();
        lines['smatch'] = {};
        lines['xmatch'] = {};

        if (TC_SmartSets.hasOwnProperty(fd)) {
            var lastLine = value;
            if (fd == "lines") {
                var pos = getCursortPosition(thisx);
                var valp = $(thisx).val().substring(0, pos);
                var valps = String(valp).split(/\n/);
                var valss = String($(thisx).val()).split(/\n/);
                lastLine = valss[valps.length - 1];
            }
            var rawLastLine = lastLine;

            lastLine = TC_SmartStrFormat(lastLine);
            var lastLineX = String(lastLine).replace(/\s+/g, '');
            //console.log(fd,":",rawLastLine,"=>",lastLine," =>",  lastLineX);

            if (String(lastLineX).length > 1) {
                var m = 0;
                var reg1 = new RegExp("^" + lastLine, "i");
                var reg2 = new RegExp(lastLine, "i");

                for (var n in TC_SmartSets[fd]) {
                    kk++;
                    kkk++;
                    try {
                        if (rawLastLine != TC_SmartSets[fd][n][1]) {
                            var s = TC_SmartSets2[fd][n]; //TC_SmartStrFormat(TC_SmartSets[fd][n][1]);
                            if (s.length >= lastLine.length) {
                                if (String(s).match(reg1)) {
                                    if (!lines['smatch'].hasOwnProperty(TC_SmartSets[fd][n][0])) {
                                        lines['smatch'][TC_SmartSets[fd][n][0]] = new Array();
                                    }
                                    lines['smatch'][TC_SmartSets[fd][n][0]].push(TC_SmartSets[fd][n][1]);
                                    m++;
                                } else if (String(s).match(reg2)) {
                                    if (!lines['xmatch'].hasOwnProperty(TC_SmartSets[fd][n][0])) {
                                        lines['xmatch'][TC_SmartSets[fd][n][0]] = new Array();
                                    }
                                    lines['xmatch'][TC_SmartSets[fd][n][0]].push(TC_SmartSets[fd][n][1]);
                                    m++;
                                }
                            }
                        }
                    } catch (e) {
                        //console.error(e.description);
                    }
                }

                if (fd == "lines") {
                    for (var n in TC_SmartSets["steps"]) {
                        kk++;
                        kkk++;
                        try {
                            if (rawLastLine != TC_SmartSets["steps"][n][1] && value != TC_SmartSets["steps"][n][1]) {
                                var s = TC_SmartSets2["steps"][n]; //TC_SmartStrFormat(TC_SmartSets["steps"][n][1]);
                                if (s.length >= lastLine.length) {
                                    if (String(s).match(reg2)) {
                                        if (!line2steps.hasOwnProperty(TC_SmartSets["steps"][n][0])) {
                                            line2steps[TC_SmartSets["steps"][n][0]] = new Array();
                                        }
                                        line2steps[TC_SmartSets["steps"][n][0]].push(TC_SmartSets["steps"][n][1]);
                                    }
                                }
                            }
                        } catch (e) {
                            //console.error(e.description);
                        }
                    }
                } else if (fd == "steps" && m == 0) {
                    lines["xmatch"] = line2steps;
                }

                var xms = new Array("smatch", "xmatch");
                for (var t = 0; t < xms.length; t++) {
                    if (counts[fd] >= 20) {
                        break;
                    }

                    var nn = new Array();
                    for (var n in lines[xms[t]]) {
                        nn.push(n);
                    }
                    nn.sort(sortNumber);
                    nn.reverse();

                    for (var i = 0; i < nn.length; i++) {
                        if (counts[fd] >= 20) {
                            break;
                        }

                        lines[xms[t]][nn[i]].sort();
                        for (var j = 0; j < lines[xms[t]][nn[i]].length; j++) {
                            if (counts[fd] >= 20) {
                                break;
                            }

                            if (!lines[xms[t]][nn[i]][j]) {
                                continue;
                            }

                            k++;
                            counts[fd]++;
                            var xbg = '';
                            if (counts[fd] % 2 == 1) {
                                xbg = ' xbg2';
                            }

                            str += "<div class='divfinding " + fd + " " + xbg + "' >" +
                                "<a style='color:blue' >" + (fd == "lines" ? "L" : "S") + counts[fd] + "</a> " +
                                "<span class='content' style='color:#000000'>" + encodeHtml(lines[xms[t]][nn[i]][j]) + "</span>" +
                                "</div>";
                        }
                    }
                }
            }
        }

        if (str) {
            $('#div_smart').find("div." + fd).append(str).find("div.divfinding").css({ cursor: 'pointer' }).unbind().bind({
                mouseover: function() { $(this).find("span.content").get(0).style.color = '#0066FF' },
                mouseout: function() { $(this).find("span.content").get(0).style.color = '#000000' },
                click: function() {
                    var valx = $(this).find(".content").html().replace(/\<br\/*\>/g, "\n").replace(/\&nbsp\;/g, " ").replace(/\&amp\;/g, '&').replace(/\&gt\;/g, ">").replace(/\&lt\;/g, "<");
                    if ($(this).hasClass("lines")) {
                        var pos = getCursortPosition(thisx);
                        var valp = $(thisx).val().substring(0, pos);
                        var valps = String(valp).split(/\n/);

                        var valss = String($(thisx).val()).split(/\n/);
                        for (var v = 0; v < valss.length; v++) {
                            if (v == valps.length - 1) {
                                valss[v] = valx;
                                break;
                            }
                        }

                        valx = valss.join("\n");
                    }

                    $(thisx).val(valx);
                }
            });
        }

        //console.log(".. used time ("+fd+"):", (new Date()).getTime() - stt,"msec, cycle:",kk)
    }

    //if(k){
    if ($('#div_smart').css("display") == 'none') {
        if (!$('#div_smart').data("onside")) {
            $('#div_smart').data("onside", "bottom");
        }
        $('#div_smart').fadeIn(200, function() {
            TC_SmartResize($('#div_smart').data("onside"));
        });
    }
    //}
    //console.log("TC_SmartCheck end");
    //console.log("");
    //console.log("SmartCheck total used time:", (new Date()).getTime() - st,"msec, cycle:",kkk)
}

function TC_SmartStrFormat(s) {
    return s.replace(/^\s+|\s+$/g, '').replace(/[\!\"\#\$\%\&\'\(\)\=\-\~\^\\\|\[\]\{\}\<\>\?\_\,\.\/\;\:\+\*\@\`]+/g, ' ').replace(/\s+/g, ' ');
}

function TC_InputCheck(thisx) {
    if ($(thisx).data('string') != $(thisx).val()) {
        $(thisx).css({ background: '#FFFFCC' });
        return 1;
    } else {
        if ($(thisx).hasClass("xbg")) {
            $(thisx).css({ background: '#f4f4f4' });
        } else {
            $(thisx).css({ background: '#FFFFFF' });
        }
        return 0;
    }
}

function TC_InputLineStyleAuto(thisx) {
    var srtop = $(thisx).scrollTop();

    var pos = getCursortPosition(thisx);
    var val = $(thisx).val();
    var valp = val.substring(0, pos);
    var vale = val.substring(pos);
    var lines = String(valp).split(/\n/);
    var ms = String(lines[lines.length - 2]).match(/^(\s+)|(^\-\s+)/);
    //console.log(ms)
    if (ms) {
        $(thisx).val(valp + ms[0] + (vale ? vale : ""));
        if (vale) {
            setMousePosition(thisx, pos + String(ms[0]).length);
        }
    }

    if (srtop) {
        window.setTimeout(function() {
            $(thisx).scrollTop(srtop);
        }, 100);
    }
}

function TC_InputLineClean(thisx) {
    var srtop = $(thisx).scrollTop();

    var lines = $(thisx).val().split(/\n/);
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].match(/^\s*\-*\s*$/)) {
            lines[i] = "";
        }
    }

    $(thisx).val(lines.join("\n"));

    if (srtop) {
        window.setTimeout(function() {
            $(thisx).scrollTop(srtop);
        }, 100);
    }
}

function TC_InputIndent(thisx, act) {
    var srtop = $(thisx).scrollTop();

    var sels = TC_InputSelectGet(thisx);
    //console.log(sels);
    if (!sels || !sels.length) {
        StatusShow(5, "<div style='color:red;background:yellow;padding:10px' >please select at least one line!</div>");
        return;
    }

    var val = $(thisx).val();
    if (!val.length) {
        StatusShow(5, "<div style='color:red;background:yellow;padding:10px' >No content!</div>");
        return;
    }

    var valp1 = val.substring(0, sels[1]);
    var lines1 = String(valp1).split(/\n/);
    var valp2 = val.substring(0, sels[2]);
    var lines2 = String(valp2).split(/\n/);

    var lines3 = val.split(/\n/);
    sels[1] = 0;
    sels[2] = 0;
    var s = 1;
    for (var i = 0; i < lines3.length; i++) {
        if (i >= lines1.length - 1 && i <= lines2.length - 1) {
            s = 0;
            if (act == "indent") {
                lines3[i] = "  " + lines3[i];
            } else {
                lines3[i] = lines3[i].replace(/^\s{2}/, '');
            }
        }
        if (i <= lines2.length - 1) {
            sels[2] += lines3[i].length + 1;
        }

        if (s) {
            sels[1] += lines3[i].length + 1;
        }
    }

    $(thisx).val(lines3.join("\n"));
    TC_InputSelectSet(thisx, sels[1], sels[2] - 1);

    if (srtop) {
        window.setTimeout(function() {
            $(thisx).scrollTop(srtop);
        }, 100);
    }
}

function TC_InputSelectGet(thisx) {
    if (thisx.selectionStart || thisx.selectionStart == 0) {
        return [thisx.value.substring(thisx.selectionStart, thisx.selectionEnd), thisx.selectionStart, thisx.selectionEnd];
    } else if (document.selection) {
        var t = document.selection.createRange().text;
        return [t, 0, t.length - 1];
    } else {
        console.warn('--- no selection ---');
    }
}

function TC_InputLineSEndPoint(thisx1, thisx2) {
    var sp = 0;
    var ep = 0;

    var pos = getCursortPosition(thisx1);
    var valp = $(thisx1).val().substring(0, pos);
    var lines1 = String(valp).split(/\n/);

    var lines = $(thisx2).val().split(/\n/);

    var s = 1;
    for (var i = 0; i < lines.length; i++) {
        if (i >= lines1.length - 1) {
            s = 0;
        }
        if (i <= lines1.length - 1) {
            ep += lines[i].length + 1;
        }

        if (s) {
            sp += lines[i].length + 1;
        }
    }
    //console.log(sp,ep, lines1.length, lines.length)
    return [sp, ep]
}

function TC_InputSelectSet(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
    } else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionEnd);
        range.select();
    }
}

function openDownloadDialog(url, saveName) {
    if (typeof url == 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event;
    if (window.MouseEvent) event = new MouseEvent('click');
    else {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}


function encodeHtml(str, act) {
    var ss = String(str).split(/\n/);
    var st = new Array();
    for (var i = 0; i < ss.length; i++) {
        var str = ss[i].replace(/\&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/^(\s+)/, function(match) { return xrepeat("&nbsp;", match.length) });
        if (act) {
            str = str.replace(/\s/g, '&nbsp;');
        }

        st.push(str)
    }

    return st.join("<br/>");

    //return String(str).replace(/\&/g,'&amp;').replace(/\</g,'&lt;').replace(/\>/g,'&gt;').replace(/\n/g,"<br/>").replace(/\s/g,"&nbsp;");
}

function sortNumber(a, b) {
    return a - b
}

function winDimensions() {
    var winWidth;
    var winHeight;

    if (window.innerWidth) {
        winWidth = window.innerWidth;
    } else if ((document.body) && (document.body.clientWidth)) {
        winWidth = document.body.clientWidth;
    }

    if (window.innerHeight) {
        winHeight = window.innerHeight;
    } else if ((document.body) && (document.body.clientHeight)) {
        winHeight = document.body.clientHeight;
    }

    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
        winHeight = document.documentElement.clientHeight;
        winWidth = document.documentElement.clientWidth;
    }

    var sizes = new Array();
    sizes[0] = (winWidth > 0 ? winWidth : 1920);
    sizes[1] = (winHeight > 0 ? winHeight : 1080);

    var sw = String($('#txtScreenWidth').val()).replace(/[^\d]+/g, '') * 1;
    if (sw > 100) {
        sizes[0] = sw
    }

    var sh = String($('#txtScreenHeight').val()).replace(/[^\d]+/g, '') * 1;
    if (sh > 100) {
        sizes[1] = sh;
    }


    return sizes;
}

function StatusShow(seconds, content, isLog) {
    //console.log(content);
    try {
        $('#div_count_down').stop(true, true);
    } catch (e) {

    }

    $('#div_status_bar').html("<div id='div_count_down' class='div_count_down' ></div>" + content).show();
    if (isLog) {
        $('#div_status_bar').find(".divlog").css({ 'padding': '0px', 'border-style': 'none solid solid solid', 'border-width': '1px', 'border-color': '#D0D0D0' })
        $('#div_status_bar').find(".divlog").find(".title").bind({
            mouseover: function() { this.style.background = '#D0D0D0' },
            mouseout: function() { this.style.background = '#E0E0E0' },
            click: function() {
                $(this).parent().find(".content").toggle();
            }
        });

        $('#div_status_bar').find("td").css({ 'padding': '3px', 'border-style': 'none solid solid none', 'border-width': '1px', 'border-color': '#E0E0E0' });
        $('#div_status_bar').find("tr.header").find('td').css({ 'text-align': 'center', 'background': 'F0F0F0', 'color': '#000000' });
    } else {
        $('#div_status_bar').attr('title', "This message will disappear in " + seconds + " seconds");
    }

    if (seconds) {
        $('#div_count_down').animate({
                'width': '0px'
            },
            seconds * 1000,
            function() {
                $('#div_status_bar').empty().attr('title', '').hide();
            });
    }
}

var sleep = function(time) {
    var startTime = new Date().getTime() + parseInt(time, 10);
    while (new Date().getTime() < startTime) {}
};

function xrepeat(s, n) {
    if (n > 0) {
        return String(s).repeat(n)
    } else {
        return ""
    }
}

function EmailCheck(s) {
    if (String(s).match(/^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/i)) {
        return true
    } else {
        return false
    }
}

function setMousePosition(input, selectionEnd) {
    if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionEnd, selectionEnd);
    } else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionEnd);
        range.select();
    }
}

function stopPropagation(e) {
    var e = window.event || e;

    try {
        if (document.all) { //只有ie识别
            e.cancelBubble = true;
        } else {
            e.stopPropagation();
        }
    } catch (e) {
        //
    }
}

(function($, h, c) {
    var a = $([]),
        e = $.resize = $.extend($.resize, {}),
        i,
        k = "setTimeout",
        j = "resize",
        d = j + "-special-event",
        b = "delay",
        f = "throttleWindow";
    e[b] = 250;
    e[f] = true;
    $.event.special[j] = {
        setup: function() {
            if (!e[f] && this[k]) {
                return false;
            }
            var l = $(this);
            a = a.add(l);
            $.data(this, d, {
                w: l.width(),
                h: l.height()
            });
            if (a.length === 1) {
                g();
            }
        },
        teardown: function() {
            if (!e[f] && this[k]) {
                return false;
            }
            var l = $(this);
            a = a.not(l);
            l.removeData(d);
            if (!a.length) {
                clearTimeout(i);
            }
        },
        add: function(l) {
            if (!e[f] && this[k]) {
                return false;
            }
            var n;

            function m(s, o, p) {
                var q = $(this),
                    r = $.data(this, d);
                r.w = o !== c ? o : q.width();
                r.h = p !== c ? p : q.height();
                n.apply(this, arguments);
            }
            if ($.isFunction(l)) {
                n = l;
                return m;
            } else {
                n = l.handler;
                l.handler = m;
            }
        }
    };

    function g() {
        i = h[k](function() {
                a.each(function() {
                    var n = $(this),
                        m = n.width(),
                        l = n.height(),
                        o = $.data(this, d);
                    if (m !== o.w || l !== o.h) {
                        n.trigger(j, [o.w = m, o.h = l]);
                    }
                });
                g();
            },
            e[b]);
    }
})(jQuery, this);


// 获取光标位置
function getCursortPosition(ctrl) {
    //获取光标位置函数 
    var CaretPos = 0;
    // IE Support
    if (document.selection) {
        ctrl.focus(); // 获取焦点
        var Sel = document.selection.createRange(); // 创建选定区域
        Sel.moveStart('character', -ctrl.value.length); // 移动开始点到最左边位置
        CaretPos = Sel.text.length; // 获取当前选定区的文本内容长度
    }
    // Firefox support 
    else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
        CaretPos = ctrl.selectionStart; // 获取选定区的开始点 
    }
    return CaretPos;
}