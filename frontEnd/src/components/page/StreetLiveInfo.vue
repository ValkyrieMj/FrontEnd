// 组件对应内容：
// 可视化功能二：各街道民生分析
// 展示一定时间范围内各街道对应的民生数据，时间范围有用户指定，若初始时刻用户未指定时间
// 默认从服务器请求"今日"的数据，"今日"默认设置为20181030，由于这个值在后
// 也写死了，所以原则上不允许修改默认的"今日"的值

<template>
    <div>
        <!-- 时间选择器 -->
        <!-- <div class="block">
            <span class="demonstration">统计时间</span>
            <el-date-picker
                v-model="value1"
                type="date"
                @change="drawColumn"
                placeholder="选择日期"
                value-format='yyyyMMdd'
                default-value="2018-10-30"
                >
            </el-date-picker>
        </div> -->
        <div class="block">
            <el-date-picker
                v-model="value1"
                type="month"
                placeholder="选择月"
                @change="select_month"
                value-format="yyyyMM"
                default-value="2018-10-30"
                :picker-options="pickerOptions">
            </el-date-picker>
        </div>

                    <!-- 图表容器 -->
        <div class="container" id="columnCharts" style="float:left;width:100%;height:850px">

        </div>


    </div>
</template>

<script>
import echarts from 'echarts';
import qs from 'qs'
export default {
    name: 'StreetLiveInfo',
    data() {
            return {
                pickerOptions: {
                    disabledDate(time) {
                        // return time.getTime() > Date.now() - 394*8.64e7;
                        return time.getTime() > 17834*8.64e7;
                    }
                },
                value1: ''
            }
    },

    // 挂载函数，在用户为选定日期之前主动向服务器发送请求，此时参数中的请求日期为空
    // 服务器判断请求日期为空时，默认返回"今日"的数据，在服务器中将"今日"设定为
    // 2018年10月30号
    mounted(){
        this.drawColumn(["20181030","20181030"])
    },


    methods: {
          drawColumn(value1){
            var myChart = echarts.init(document.getElementById('columnCharts'))
            // 向服务器发送请求，获取数据填充

            // let param = new URLSearchParams()
            // param.append("dataBegin",JSON.stringify(value1[0])),
            // param.append("dateEnd", JSON.stringify(value1[1])) ,
              var arrays=new Array();
              //JSON.stringify() 不能转下标非1,2,3这种数字的数组,
              //所以采用新建对象的方式添加数据
              var products={};
              products['productid']='32';
              products['name']='手机';
              arrays.push(products);


              var json_arrays = JSON.stringify(arrays);
              console.log(json_arrays);


            this.$axios( {
                url: '/api/query2',
                method:'post',
                data:{
                    dateBegin:value1[0],
                    dateEnd:value1[1]
                }

            })
            .then( (result) => {
                if( result.data.length != 0)
                {

                        // 1.先统计当天出现民生事件的街道的个数
                        var streetName = []; // 统计街道个数
                        var eventType = [];  // 统计事件种类


                        // 统计发生民生事件的街道个数
                        for( var i = 0; i < result.data.length;i++ )
                        {
                            var streetname = result.data[i].STREET_NAME;
                            if( streetName.indexOf( streetname ) == -1 )
                            {
                                streetName.push( streetname );

                            }
                        }


                        // 2.统计每种民生事件在对应街道下的数量

                        // 2.1先统计民生事件的类型总数
                        for( var i = 0; i < result.data.length;i++ )
                        {
                            var eventtype = result.data[i].MAIN_TYPE_NAME;
                            if( eventType.indexOf( eventtype ) == -1 )
                            {
                                eventType.push( eventtype )
                            }
                        }

                        //2.2统计每种民生事件类型对应在对应街道下的数量
                        var eventOnStreet = new Array( eventType.length )
                        for( var i = 0; i < eventOnStreet.length;i++ )
                        {
                            eventOnStreet[ i ] = new Array( streetName.length + 1 );
                        }

                        for( var i = 0; i < eventOnStreet.length;i++ )
                        {
                            eventOnStreet[i][0] = eventType[i];
                            for( var j = 1; j < eventOnStreet[0].length; j++ )
                            {
                                eventOnStreet[i][j] = 0;
                            }
                        }

                        for( var i = 0;i < result.data.length;i ++ )
                        {
                            // 判断事件类型在数组中对应位置
                            eventOnStreet[ eventType.indexOf( result.data[i].MAIN_TYPE_NAME ) ][ streetName.indexOf( result.data[i].STREET_NAME ) + 1 ] ++;
                        }
                        ///console.log( eventOnStreet );


                        // 3. 开始画图
                        var allData = [];
                        for( var i = 0; i < eventType.length;i++ )
                        {
                            var eventdetail = {};
                            var carrier = []
                            eventdetail.name = eventType[ i ];
                            eventdetail.type = 'bar';
                            eventdetail.stack = '总数';
                            eventdetail.barGap = '100%'
                            eventdetail.label = {
                                    formatter: function (params) {
                                        if (params.seriesData.length === 0) {
                                            // 就是这里，可以获取到我想要的那个数据
                                            mouseCurValue = params.value;
                                        }
                                    },

                                normal:{
                                    show:false,
                                    position:'inside'
                                }
                            }

                            // 3.1取出元素
                            for( var j = 1;j < eventOnStreet[0].length;j++ )
                            {
                                carrier.push( eventOnStreet[i][j] )
                            }
                            eventdetail.data = carrier;
                            allData.push( eventdetail )

                        }

                        myChart.setOption ({

                                // 这部分tooltip的代码是从网上拿来修改的
                                // https://segmentfault.com/a/1190000012246231

                                tooltip : {
                                    trigger: 'axis',
                                    axisPointer: {
                                        //show:false,
                                        type: "cross",
                                        label: {
                                            show:false,
                                            formatter: function (params) {
                                                if (params.seriesData.length === 0) {
                                                    window.mouseCurValue = params.value;
                                                }
                                            }
                                        }
                                    },
                                    formatter: function (params) {
                                        let res = "", sum = 0;
                                        for (let i = 0; i < params.length; i++) {
                                            let series = params[i];
                                            sum += Number(series.data);
                                            if (sum >= window.mouseCurValue) {
                                                res = series.axisValue + "<br/>" + series.marker + series.seriesName + ":" + series.data + "<br/>";
                                                break;
                                            }
                                        }
                                        return res;
                                    },
                                },

                                legend: {
                                    data: eventType
                                },


                                // toolbox添加图片下载功能
                                toolbox: {
                                    show : true,
                                    top: 750,
                                    feature : {
                                        mark : {show: true},
                                        dataView : {show: true, readOnly: false},
                                        magicType : {
                                            show: true,
                                            type: ['pie', 'funnel']
                                        },
                                        //restore : {show: true},
                                        saveAsImage : {show: true}
                                    }
                                },
                                calculable : true,

                                grid: {
                                    // 留出足够空间给图例
                                    top:'20%',
                                    left: '3%',
                                    right: '4%',
                                    //bottom: '3%',
                                    containLabel: true
                                },
                                yAxis:  {
                                    type: 'category',
                                    data: streetName
                                },
                                xAxis: {
                                    type: 'value',
                                },
                                series: allData
                            })
                    }

                     // 处理后端返回值值为空时的情况
                    else
                    {
                        this.$alert(  '这个月无对应数据！', {
                        confirmButtonText: '确定',
                            callback: action => {
                                this.$message({
                                type: 'info',
                                message: `action: ${ 确定 }`
                                });
                            }
                        });
                    }

                    // 定期向服务器轮询,10s间隔
                    // setTimeout(  () => {
                    //     this.drawColumn()
                    // },10000)


            })
        },

        select_month()
        {
            console.log(this.value1);
            console.log(this.value1.substr(0,4));
            var year = this.value1.substr(0,4);
            var month = this.value1.substr(4,6);
            var value = [];
            console.log(month);
            if(month == "01"||month == "03"|| month == "05"|| month=="07"|| month == "08"|| month=="10"|| month == "12")
            {
                value[0] = year+month+"01";
                value[1] = year+month+"31";
                console.log(value[1]);
            }
            else if(month == "04"||month == "06"|| month == "09"|| month=="11")
            {
                value[0] = year+month+"01";
                value[1] = year+month+"30";
                console.log(value[1]);
            }
            else if(month == "02")
            {
                value[0] = year+month+"01";
                value[1] = year+month+"28";
                console.log(value[1]);
            }
            else;
            console.log("jjjjj:"+value[0])
            console.log(value[1])
            this.drawColumn(value);
        }

    }

};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
