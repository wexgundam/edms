Ext.onReady(function () {

    Ext.QuickTips.init();
    Ext.BLANK_IMAGE_URL = '../../../extjs-3.0/resources/images/default/s.gif';
    var bd = Ext.getBody();

    /*
     * ================  案例查询表单 =======================
     */
    //渲染返回html代码
    var renderXiangxi = function (value) {
        return '<a href="aa.jsp?id=' + value + '">详细</a>';
    };
    var renderDel = function (value) {
        return '<a  href="RyDel.jsp?albm=' + value + '">删除</a>';
    };

    //定义Grid表头
    var columns = new Ext.grid.ColumnModel([
        //expander,			
        //自动行号
        new Ext.grid.RowNumberer(),
        //{header:'序号',dataIndex:'id',width:40,sortable:true,fixed:true},
        {header: '变电所名称', dataIndex: 'xm', width: 240, sortable: true},
        {header: '变压器类型', dataIndex: 'szdw', width: 180, sortable: true},
        {header: '规格型号', dataIndex: 'bm', sortable: true},
        {header: '额定电压', dataIndex: 'zw', sortable: true},
        {header: '运行编号', dataIndex: 'zy', sortable: true},
        {header: '额定电流', dataIndex: 'gh', width: 80, sortable: true},
        {header: '额定容量', dataIndex: 'xb', width: 80, sortable: true},
        //{header:'绝缘油号',dataIndex:'gz',width:80,fixed:true},
        //{header:'油重',dataIndex:'aqdj',width:80,fixed:true},
        // {header:'器身重',dataIndex:'ydsgdj',width:80,fixed:true},
        //{header:'总重',dataIndex:'bc',width:40,fixed:true},
        {header: '生产厂家', dataIndex: 'jsdj', width: 120, fixed: true},
        {header: '操作', dataIndex: 'id', width: 60, renderer: renderDel, fixed: true}

    ]);

    var planRecord = Ext.data.Record.create([
        {name: 'id', type: 'int'},
        {name: 'bm', type: 'string'},
        {name: 'szdw', type: 'string'},
        {name: 'zw', type: 'string'},
        {name: 'zy', type: 'string'},
        {name: 'xm', type: 'string'},
        {name: 'gh', type: 'string'},
        {name: 'xb', type: 'string'},
        {name: 'jg', type: 'string'},
        {name: 'mz', type: 'string'},
        {name: 'hkxz', type: 'string'},
        {name: 'csd', type: 'string'},
        {name: 'csrq', type: 'string'},
        {name: 'sfzh', type: 'string'},
        {name: 'whcd', type: 'string'},
        {name: 'zzmm', type: 'string'},
        {name: 'hyzk', type: 'string'},
        {name: 'gz', type: 'string'},
        {name: 'aqdj', type: 'string'},
        {name: 'ydsgdj', type: 'string'},
        {name: 'jsdj', type: 'string'},
        {name: 'bc', type: 'string'}
    ]);


    //Ext为我们提供了一个桥梁Ext.data.Store，用于转换各种类型的数据。
    var store = new Ext.data.Store({
        //proxy告诉我们从哪里获得数据
        proxy: new Ext.data.HttpProxy({url: 'RyList.jsp'}),
        //reader告诉我们如何解析这个数据
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            root: 'root',
            successProperty: 'success'
        }, planRecord)
    });
    store.load({params: {start: 0, limit: 10}});

    //定义表格面板,指定列模型，仓库，选择模型(默认行选择模型)
    var simple_Grid = new Ext.grid.GridPanel({
        //el:指定html元素用于显示的grid
        //el: 'grid3',
        //title: '查询列表', 
        store: store,
        cm: columns,
        sm: new Ext.grid.RowSelectionModel({singleSelcet: true}),
        //title: '作业计划显示',
        //列重新计算后自动填满
        viewConfig: {
            forceFit: true,
            columnsText: "显示的列",
            sortAscText: "升序",
            sortDescText: "降序"
        },
        loadMask: {msg: "数据加载中...."},
        collapsible: true,
        titleCollapse: true,
        animCollapse: false,
        columnLines: true,
        //width:1000,
        autoWidth: true,
        autoHeight: true,
        //plugins: expander,
        //iconCls: 'icon-grid',
        //height:400,
        //bottom bar
        bbar: new Ext.PagingToolbar({
            pageSize: 10,
            store: store,
            displayInfo: true,
            displayMsg: '第 {0} 条到 {1} 条,共 {2} 条',
            emptyMsg: "无记录"
        })

        //在Grid的上方添加按钮
        /*
         tbar: new Ext.Toolbar({
         items:[
         {
         id:'buttonA',
         text:"添加",
         handler: this.showAdd,
         scope:this
         },
         {
         id:'buttonA',
         text:"添加",
         handler: this.showAdd,
         scope:this
         }
         ]
         })
         */
    });

    //Grid上触发事件
    simple_Grid.addListener('rowclick', function (simple_Grid, rowIndex, event) {
        // simpleForm_Query.collapse();
        simpleForm_Save.expand();
        simpleForm_Save.buttons[0].setVisible(false);
        simpleForm_Save.buttons[1].setVisible(true);
        //simpleForm_Save.buttons[3].setVisible(true);
        //simpleForm_Save.buttons[4].setVisible(true);
        var record = simple_Grid.getStore().getAt(rowIndex);
        //alert(record);
        //alert(record.get('albm'));

        simpleForm_Save.getForm().loadRecord(record);
    });

    //grid.render();//渲染表格
    Ext.form.Field.prototype.msgTarget = 'side';// 设置控件的错误信息显示位置，主要可选的位置有：qtip,title,under,side,[elementId]
    // form start

    /*
     * ================  您当前的位置：事故案例---->案例查询 =======================
     */
    var simpleForm_Query = new Ext.FormPanel({
        renderTo: document.body,
        title: '变电所设备查询',
        labelAlign: 'left',
        //bodyStyle:'padding:5px 5px 0',
        //labelWidth: 75, 
        collapsible: true,
        titleCollapse: true,
        method: 'POST',
        frame: true,
        autoWidth: true,
        //width: 1000,
        items: [{
            layout: 'column',// columnlayout
            border: false,// 没有边框
            items: [{
                columnWidth: .3,
                layout: 'form',
                border: false,
                items: [{
                    xtype: 'combo',
                    store: new Ext.data.SimpleStore({
                        fields: ["returnValue", "displayText"],
                        data: [['', '全部'], ['刘家沟牵引所', '刘家沟牵引所'], ['神木北牵引所', '神木北牵引所'], ['南梁牵引所', '南梁牵引所'], ['新城川牵引所', '新城川牵引所'], ['府谷牵引所', '府谷牵引所'], ['桥头牵引所', '桥头牵引所'], ['阴塔牵引所', '阴塔牵引所'], ['贺职牵引所', '贺职牵引所'], ['韩家楼牵引所', '韩家楼牵引所']]
                    }),
                    valueField: "returnValue",
                    displayField: "displayText",
                    mode: 'local',// 数据是在本地
                    //forceSelection : true,// 必须选择一个选项
                    blankText: '请选择所在单位',
                    emptyText: '选择单位',
                    hiddenName: 'xm',
                    editable: false,
                    triggerAction: 'all',
                    //allowBlank : false,
                    fieldLabel: '所在单位',
                    name: 'xm',
                    anchor: '95%'
                }]
            }]
        }
        ],
        // 为form添加按钮了，在formpanel的buttons属性中我们加入了一个保存按钮和取消按钮
        buttons: [{
            // 在buttons里定义的按钮默认是Ext.Button，所以按钮的属性定义可以查看Ext.Button的API。在这里两个按钮都没用到其它属性，只是设置了显示文本（text）和单击事件。
            buttonlAlign: 'right',
            text: '查询',
            handler: function () {
                if (!simpleForm_Query.form.isValid()) {
                    return
                }
                ;
                // 在formpanel类中，form属性指向的是formpanle里的basicform对象，我们可通过formpanle.form来使用该basicform对象。在被例子，我们已经将formpanel对象赋值给了simpleForm这个变量，所以我们可以通过simpleForm.form访问面板里的basicform对象。
                if (simpleForm_Query.form.isValid()) {
                    // 保存按钮要做的就是先做basicform的客户端验证，验证通过了则设置该按钮状态为disable，防止2次提交。然后调用simpleForm.form.doAction方法提交数据
                    //this.disabled = true;
                    // doAction方法的第一个参数“submit”的意思是表示执行的是提交操作，提交的后台页面是test.jsp（url:'test.asp'），提交方式是post（method:'post'），没有其它提交参数（params:''）
                    simpleForm_Query.form.doAction('submit', {
                        waitMsg: '查询中,请稍侯...',
                        url: 'RyQuery.jsp',
                        method: 'post',
                        params: '',
                        // 提交成功后执行success定义的函数，后台返回的数据格式是需要我们注意的，一定要json格式，而且必须包含“success:true”，不然不会执行success定义的函数。
                        // success定义的函数返回两个参数，第一是form本身，第二个是ajax返回的响应结果，在action.result这个json数组了保存了后台返回的数据。
                        success: function (form, action) {
                            // 例如返回的json结构是"{success:true,data:'成功保存！'}"，
                            //Ext.Msg.alert('操作',action.result.data);
                            //Ext.Msg.alert('消息',action.result.msg);
                            //simpleForm_Query.form.reset();
                            simple_Grid.getStore().reload();
                        },
                        // 定义failure函数，就是网络通讯存在问题的时候将显示错误信息。
                        failure: function () {
                            Ext.Msg.alert('操作', '保存失败！');
                            this.disabled = false;
                        }
                    });
                }
            }
        }
            , {
                // 取消按钮就是简单的reset一下form的控件
                text: '重置',
                handler: function () {
                    simpleForm_Query.form.reset();
                    simpleForm_Save.collapse();
                }
            }
        ]
    });

    /*==============案例归档---->事故报告新增========*/
    var simpleForm_Save = new Ext.FormPanel({
        renderTo: document.body,
        title: '变电所设备编辑',
        labelAlign: 'left',
        bodyStyle: 'padding:5px 5px 0',
        //labelWidth: 75, 
        collapsible: true,
        titleCollapse: true,
        method: 'POST',
        frame: true,
        autoWidth: true,
        //width: 1000,
        //fileUpload: true,
        items: [{
            layout: 'column',
            border: false,
            items: [{xtype: 'hidden', name: 'id'}, {xtype: 'hidden', name: 'albm'},
                {
                    columnWidth: .3,
                    layout: 'form',
                    border: false,
                    items: [{
                        xtype: 'combo',// 控件的类型设置成combo
                        // 这里定义了一个sotre属性，就是选择值存储的地方，因为是在客户端的数据，所以使用了一个简单存储（SimpleStore）。
                        store: new Ext.data.SimpleStore({
                            // 通过一个数组定义了returnValue和displayText两个字段。retrunValue字段指定是提交给后台的值，displayText字段指定是在下拉中显示的选择值。
                            fields: ["returnValue", "displayText"],
                            // 定义了几组数据.每组数据都是根据fiedls的定义来组成的，数组里第一个值就是retrunValue的值，第二个值就是displayText的值，例如[1,'小学']，就表示retrunValue是1，displayText是小学。
                            data: [['', '全部'], ['刘家沟牵引所', '刘家沟牵引所'], ['神木北牵引所', '神木北牵引所'], ['南梁牵引所', '南梁牵引所'], ['新城川牵引所', '新城川牵引所'], ['府谷牵引所', '府谷牵引所'], ['桥头牵引所', '桥头牵引所'], ['阴塔牵引所', '阴塔牵引所'], ['贺职牵引所', '贺职牵引所'], ['韩家楼牵引所', '韩家楼牵引所']]
                        }),
                        valueField: "returnValue",// 设置下拉选择框的值
                        displayField: "displayText",// 设置下拉选择框的显示文本
                        mode: 'local',// 数据是在本地
                        //forceSelection : true,// 必须选择一个选项
                        blankText: '请选择变电所',// 提交form时，该项如果没有选择，则提示错误信息"请选择学历"
                        emptyText: '选择变电所',// 在没有选择值时显示为选择学历
                        hiddenName: 'xm',// 大家要注意的是hiddenName和name属性，name只是下拉列表的名称，作用是可通过，而hiddenName才是提交到后台的input的name。如果没有设置hiddenName，在后台是接收不到数据的，这个大家一定要注意。
                        editable: false,// 该下拉列表只允许选择，不允许输入
                        triggerAction: 'all',// 因为这个下拉是只能选择的，所以一定要设置属性triggerAction为all，不然当你选择了某个选项后，你的下拉将只会出现匹配选项值文本的选择项，其它选择项是不会再显示了，这样你就不能更改其它选项了。
                        allowBlank: false,// 该选项值不允许为空
                        fieldLabel: '变压器分类',// 控件的标题是学历
                        name: 'xm',// 再次提醒，name只是下拉列表的名称
                        anchor: '95%'// input的宽度是90%
                    }]
                }, {
                    columnWidth: .3,
                    layout: 'form',
                    border: false,
                    items: [{
                        xtype: 'combo',// 控件的类型设置成combo
                        // 这里定义了一个sotre属性，就是选择值存储的地方，因为是在客户端的数据，所以使用了一个简单存储（SimpleStore）。
                        store: new Ext.data.SimpleStore({
                            // 通过一个数组定义了returnValue和displayText两个字段。retrunValue字段指定是提交给后台的值，displayText字段指定是在下拉中显示的选择值。
                            fields: ["returnValue", "displayText"],
                            // 定义了几组数据.每组数据都是根据fiedls的定义来组成的，数组里第一个值就是retrunValue的值，第二个值就是displayText的值，例如[1,'小学']，就表示retrunValue是1，displayText是小学。
                            data: [['牵引变压器', '牵引变压器',],
                                ['动力变压器', '动力变压器'], ['自耦变压器', '自耦变压器'], ['自用变压器', '自用变压器']]
                        }),
                        valueField: "returnValue",// 设置下拉选择框的值
                        displayField: "displayText",// 设置下拉选择框的显示文本
                        mode: 'local',// 数据是在本地
                        //forceSelection : true,// 必须选择一个选项
                        blankText: '请选变压器分类',// 提交form时，该项如果没有选择，则提示错误信息"请选择学历"
                        emptyText: '选择变压器分类',// 在没有选择值时显示为选择学历
                        hiddenName: 'szdw',// 大家要注意的是hiddenName和name属性，name只是下拉列表的名称，作用是可通过，而hiddenName才是提交到后台的input的name。如果没有设置hiddenName，在后台是接收不到数据的，这个大家一定要注意。
                        editable: false,// 该下拉列表只允许选择，不允许输入
                        triggerAction: 'all',// 因为这个下拉是只能选择的，所以一定要设置属性triggerAction为all，不然当你选择了某个选项后，你的下拉将只会出现匹配选项值文本的选择项，其它选择项是不会再显示了，这样你就不能更改其它选项了。
                        allowBlank: false,// 该选项值不允许为空
                        fieldLabel: '变压器分类',// 控件的标题是学历
                        name: 'szdw',// 再次提醒，name只是下拉列表的名称
                        anchor: '95%'// input的宽度是90%
                    }]
                }, {
                    columnWidth: .3,
                    layout: 'form',
                    border: false,
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '规格型号',
                        name: 'bm',
                        anchor: '95%'
                    }]
                }]
        }, {
            layout: 'column',
            border: false,
            items: [{
                columnWidth: .3,
                layout: 'form',
                border: false,
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '运行编号',
                    name: 'zy',
                    anchor: '95%'
                }]
            }, {
                columnWidth: .3,
                layout: 'form',
                border: false,
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '额定电压（KV/KV)',
                    name: 'zw',
                    anchor: '95%'
                }]
            }, {
                columnWidth: .3,
                layout: 'form',
                border: false,
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '额定电流（A/A）',
                    name: 'gh',
                    anchor: '95%'
                }]
            }]
        }, {
            layout: 'column',
            border: false,
            items: [{
                columnWidth: .3,
                layout: 'form',
                border: false,
                items: [{
                    xtype: 'combo',// 控件的类型设置成combo
                    // 这里定义了一个sotre属性，就是选择值存储的地方，因为是在客户端的数据，所以使用了一个简单存储（SimpleStore）。
                    store: new Ext.data.SimpleStore({
                        // 通过一个数组定义了returnValue和displayText两个字段。retrunValue字段指定是提交给后台的值，displayText字段指定是在下拉中显示的选择值。
                        fields: ["returnValue", "displayText"],
                        // 定义了几组数据.每组数据都是根据fiedls的定义来组成的，数组里第一个值就是retrunValue的值，第二个值就是displayText的值，例如[1,'小学']，就表示retrunValue是1，displayText是小学。
                        data: [['运用', '运用'], ['备用', '备用']]
                    }),
                    valueField: "returnValue",// 设置下拉选择框的值
                    displayField: "displayText",// 设置下拉选择框的显示文本
                    mode: 'local',// 数据是在本地
                    //forceSelection : true,// 必须选择一个选项
                    blankText: '请选择设备状态',// 提交form时，该项如果没有选择，则提示错误信息"请选择学历"
                    emptyText: '选择设备状态',// 在没有选择值时显示为选择学历
                    hiddenName: 'jg',// 大家要注意的是hiddenName和name属性，name只是下拉列表的名称，作用是可通过，而hiddenName才是提交到后台的input的name。如果没有设置hiddenName，在后台是接收不到数据的，这个大家一定要注意。
                    editable: false,// 该下拉列表只允许选择，不允许输入
                    triggerAction: 'all',// 因为这个下拉是只能选择的，所以一定要设置属性triggerAction为all，不然当你选择了某个选项后，你的下拉将只会出现匹配选项值文本的选择项，其它选择项是不会再显示了，这样你就不能更改其它选项了。
                    allowBlank: false,// 该选项值不允许为空
                    fieldLabel: '设备状态',// 控件的标题是学历
                    name: 'jg',// 再次提醒，name只是下拉列表的名称
                    anchor: '95%'// input的宽度是90%
                }]
            }, {
                columnWidth: .3,
                layout: 'form',
                border: false,
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '额定容量(KVA)',
                    name: 'xb',
                    anchor: '95%'
                }]
            }, {
                columnWidth: .3,
                layout: 'form',
                border: false,
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '相数',
                    name: 'mz',
                    anchor: '95%'
                }]
            }]
        }, {
            layout: 'column',
            border: false,
            items: [{
                columnWidth: .3,
                layout: 'form',
                border: false,
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '接线组别',
                    name: 'hkxz',
                    anchor: '95%'
                }]
            }, {
                columnWidth: .3,
                layout: 'form',
                border: false,
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '冷却方式',
                    name: 'csd',
                    anchor: '95%'
                }]
            }, {
                columnWidth: .3,
                layout: 'form',
                border: false,
                items: [{
                    xtype: 'datefield',
                    fieldLabel: '投运日期',
                    name: 'csrq',
                    anchor: '95%',
                    format: 'Y-m-d',
                    timePicker: true
                }]
            }]
        }, {
            layout: 'column',
            border: false,
            items: [{
                columnWidth: .3,
                layout: 'form',
                border: false,
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '空载电流（A）',
                    name: 'sfzh',
                    anchor: '95%'
                }]
            }, {
                columnWidth: .3,
                layout: 'form',
                border: false,
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '空载消耗(KW)）',
                    name: 'whcd',
                    anchor: '95%'
                }]
            }, {
                columnWidth: .3,
                layout: 'form',
                border: false,
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '短路消耗(KW)',
                    name: 'zzmm',
                    anchor: '95%'
                }]
            }]
        }, {
            layout: 'column',
            border: false,
            items: [{
                columnWidth: .3,
                layout: 'form',
                border: false,
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '阻抗电压(%)',
                    name: 'hyzk',
                    anchor: '95%'
                }]
            }, {
                columnWidth: .3,
                layout: 'form',
                border: false,
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '绝缘油号',
                    name: 'gz',
                    anchor: '95%'
                }]
            }, {
                columnWidth: .3,
                layout: 'form',
                border: false,
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '油重(KG)',
                    name: 'aqdj',
                    anchor: '95%'
                }]
            }]
        }, {
            layout: 'column',
            border: false,
            items: [{
                columnWidth: .3,
                layout: 'form',
                border: false,
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '器身重(KG)',
                    name: 'ydsgdj',
                    anchor: '95%'
                }]
            }, {
                columnWidth: .3,
                layout: 'form',
                border: false,
                items: [{
                    xtype: 'textfield',
                    fieldLabel: '总重(KG)',
                    name: 'bc',
                    anchor: '95%'
                }]
            }, {
                columnWidth: .3,
                layout: 'form',
                border: false,
                items: [{
                    xtype: 'combo',// 控件的类型设置成combo
                    // 这里定义了一个sotre属性，就是选择值存储的地方，因为是在客户端的数据，所以使用了一个简单存储（SimpleStore）。
                    store: new Ext.data.SimpleStore({
                        // 通过一个数组定义了returnValue和displayText两个字段。retrunValue字段指定是提交给后台的值，displayText字段指定是在下拉中显示的选择值。
                        fields: ["returnValue", "displayText"],
                        // 定义了几组数据.每组数据都是根据fiedls的定义来组成的，数组里第一个值就是retrunValue的值，第二个值就是displayText的值，例如[1,'小学']，就表示retrunValue是1，displayText是小学。
                        data: [['湖北变压器厂', '湖北变压器厂'], ['保定铁道变压器厂', '保定铁道变压器厂'], ['长沙变压器厂', '长沙变压器厂'], ['法国阿尔斯通公司', '法国阿尔斯通公司'], ['云南变压器厂', '云南变压器厂'], ['宁夏变压器厂', '宁夏变压器厂'], ['顺特变压器厂', '顺特变压器厂']]
                    }),
                    valueField: "returnValue",// 设置下拉选择框的值
                    displayField: "displayText",// 设置下拉选择框的显示文本
                    mode: 'local',// 数据是在本地
                    //forceSelection : true,// 必须选择一个选项
                    blankText: '请选择生产厂家',// 提交form时，该项如果没有选择，则提示错误信息"请选择学历"
                    emptyText: '选择生产厂家',// 在没有选择值时显示为选择学历
                    hiddenName: 'jsdj',// 大家要注意的是hiddenName和name属性，name只是下拉列表的名称，作用是可通过，而hiddenName才是提交到后台的input的name。如果没有设置hiddenName，在后台是接收不到数据的，这个大家一定要注意。
                    editable: false,// 该下拉列表只允许选择，不允许输入
                    triggerAction: 'all',// 因为这个下拉是只能选择的，所以一定要设置属性triggerAction为all，不然当你选择了某个选项后，你的下拉将只会出现匹配选项值文本的选择项，其它选择项是不会再显示了，这样你就不能更改其它选项了。
                    allowBlank: false,// 该选项值不允许为空
                    fieldLabel: '生产厂家',// 控件的标题是学历
                    name: 'jsdj',// 再次提醒，name只是下拉列表的名称
                    anchor: '95%'// input的宽度是90%
                }]
            }]
        }],

        buttons: [{
            text: '新增',
            handler: function () {
                if (!simpleForm_Save.form.isValid()) {
                    return
                }
                ;
                // 在formpanel类中，form属性指向的是formpanle里的basicform对象，我们可通过formpanle.form来使用该basicform对象。在被例子，我们已经将formpanel对象赋值给了simpleForm这个变量，所以我们可以通过simpleForm.form访问面板里的basicform对象。
                if (simpleForm_Save.form.isValid()) {
                    // 保存按钮要做的就是先做basicform的客户端验证，验证通过了则设置该按钮状态为disable，防止2次提交。然后调用simpleForm.form.doAction方法提交数据
                    //this.disabled = true;
                    // doAction方法的第一个参数“submit”的意思是表示执行的是提交操作，提交的后台页面是test.jsp（url:'test.asp'），提交方式是post（method:'post'），没有其它提交参数（params:''）
                    simpleForm_Save.form.doAction('submit', {
                        waitMsg: '保存中,请稍侯...',
                        url: 'RySave.jsp',
                        method: 'post',
                        params: '',
                        // 提交成功后执行success定义的函数，后台返回的数据格式是需要我们注意的，一定要json格式，而且必须包含“success:true”，不然不会执行success定义的函数。
                        // success定义的函数返回两个参数，第一是form本身，第二个是ajax返回的响应结果，在action.result这个json数组了保存了后台返回的数据。
                        success: function (form, action) {
                            // 例如返回的json结构是"{success:true,data:'成功保存！'}"，
                            //Ext.Msg.alert('操作',action.result.data);
                            if (action.result.msg != "") {
                                document.getElementById("albm").value = action.result.msg;
                                //simpleForm_Save.buttons[3].setVisible(true);
                                //simpleForm_Save.buttons[4].setVisible(true);
                                simple_Grid.getStore().reload();
                                Ext.Msg.alert('消息', '保存成功！');
                            }
                            //simpleForm_Query.form.reset();

                        },
                        // 定义failure函数，就是网络通讯存在问题的时候将显示错误信息。
                        failure: function () {
                            Ext.Msg.alert('操作', '保存失败！');
                            this.disabled = false;
                        }
                    });
                }
                // 如果想form按以前的老办法提交，可以在formpanel的定义中加入一下设置：
                // onSubmit: Ext.emptyFn,
                // submit: function() {
                // this.getEl().dom.submit();}
                // 第一个设置的目的是取消formpanel的默认提交函数。第二就是设置新的提交方式为旧方式提交。

            }
        }, {
            text: '修改',
            Enabled: false,
            handler: function () {
                if (!simpleForm_Save.form.isValid()) {
                    return
                }
                ;
                if (simpleForm_Save.form.isValid()) {
                    simpleForm_Save.form.doAction('submit', {
                        waitMsg: '修改中,请稍侯...',
                        url: 'RyUpdate.jsp',
                        method: 'post',
                        params: '',
                        success: function (form, action) {
                            simpleForm_Save.buttons[0].setVisible(true);
                            simple_Grid.getStore().reload();
                            Ext.Msg.alert('消息', action.result.msg);
                        },
                        failure: function () {
                            Ext.Msg.alert('操作', '保存失败！');
                            this.disabled = false;
                        }
                    });
                }
            }
        }, {

            // 取消按钮就是简单的reset一下form的控件
            text: '重置',
            handler: function () {
                simpleForm_Save.form.reset();
                simpleForm_Save.buttons[0].setVisible(true);
                simpleForm_Save.buttons[1].setVisible(false);
                //simpleForm_Save.buttons[3].setVisible(false);
                //simpleForm_Save.buttons[4].setVisible(false);
                //simpleForm_Query.collapse();
                // window.location.href="";
                //window.location.href='zyjhsqAdd.jsp';
            }
        }]
    });

    //从session取值赋值给form字段;
    //Ext.Ajax.request({
    //url: 'GetSessionValue.jsp',
    //success: function(response, opts)
    //{
    // simpleForm_Save.getForm().setValues([{albm: "albm",value: response.responseText} ]);
    //},
    //failure: function(response, opts) {
    //console.log('服务端失效的状态代码：' + response.status);
    //}
    //});

    var simple_Viewport = new Ext.Viewport({
        layout: 'column',
        autoScroll: true,
        items: [simpleForm_Save, simpleForm_Query, simple_Grid]
    });
    simpleForm_Save.collapse();
    simpleForm_Save.buttons[1].setVisible(false);
    //simpleForm_Save.buttons[3].setVisible(false);
    //simpleForm_Save.buttons[4].setVisible(false);
});