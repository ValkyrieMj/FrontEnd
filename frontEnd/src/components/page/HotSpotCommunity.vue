// 1
<template>
    <div>
        <!-- <div class="block">
            <span class="demonstration">日期</span>
                <el-date-picker
                    v-model="value1"
                    @change="drawmap"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="2018-10-30"
                    end-placeholder="2018-10-30"
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

        <!-- 地图容器 -->
        <!-- <div>热点社区</div> -->
        <dir id="myChart">

        </dir>

    </div>
</template>

<script>
import echarts from 'echarts';
import pingshanqu from 'echarts/map/json/pingshanqu.json'
import $ from 'jquery';

export default {
        name: 'hotspotcommunity',
        data: function(){
            return {
                pickerOptions: {
                    disabledDate(time) {
                        // return time.getTime() > Date.now() - 394*8.64e7;
                        return time.getTime() > 17834*8.64e7;
                    }
                },
                value1:''
            }
        },

        mounted(){
            this.drawmap(["20181030","20181030"])
        },

        methods:{
            drawmap(value1){
                var myChart = echarts.init( document.getElementById( 'myChart'))

                    // 初始化地图json文件
                    // $.get( 'echarts/map/json/china.json', function( geoJson ) {
                    this.$echarts.registerMap('坪山区',pingshanqu);


                    // 各个社区坐标
                    var geoCoordMap = {
                                    "南布社区": [114.3756073, 22.70534038],
                                    "和平社区": [114.3551, 22.69711],
                                    "坪山社区": [114.3554, 22.69477],
                                    "汤坑社区": [114.3219, 22.68141],
                                    "金沙社区": [114.4081, 22.74313],
                                    "江岭社区": [114.3627, 22.69195],
                                    "石井社区": [114.3505, 22.71623],
                                    "六和社区": [114.3505, 22.70623],
                                    "沙湖社区": [114.3505, 22.69623],
                                    "老坑社区": [114.3647, 22.73286],
                                    "竹坑社区": [114.3947, 22.71565],
                                    "秀新社区": [114.3823, 22.75139],
                                    "沙田社区": [114.4044, 22.76176],
                                    "六联社区": [114.3948, 22.72312],
                                    "坪环社区": [114.3558,22.68776],
                                    "坑梓社区": [114.39, 22.75315],
                                    "沙坣社区": [114.3779, 22.69089],
                                    "田头社区": [114.4108, 22.6972],
                                    "田心社区": [114.4219, 22.70035],
                                    "碧玲社区": [114.2957, 22.67342],
                                    "-":        [114.3505, 22.71623],
                                    "金龟社区": [114.4077, 22.66374],
                                    "马峦社区": [114.3412, 22.64356]
                    };

                    // 处理函数
                    var convertData = function( data ){
                        var res = [];
                        for( var i = 0; i < data.length;i++ )
                        {
                            var geoCoord = geoCoordMap[ data[i].name ];
                            if( geoCoord )
                            {
                                res.push({
                                    name:data[i].name,
                                    value:geoCoord.concat( data[i].value )
                                });
                            }
                        }
                        return res;
                    };

                    // 向服务器发送请求
                    this.$axios( {
                        url:'api/query3',
                        method:'post',
                        data:{
                            dateBegin: value1[0],
                            dateEnd:value1[1]
                        }
                    })
                    .then( (result) => {
                        //console.log( result )
                        // 检查返回结果是否为空
                        if( result.data.length != 0 )
                        {
                            var mapData = [];
                            for( var i = 0; i < result.data.length; i++ )
                            {
                                var carrier = {};
                                carrier.name = result.data[i].COMMUNITY_NAME;
                                carrier.value = result.data[i].total;
                                mapData.push( carrier );
                            }
                           // console.log( mapData)

                            myChart.setOption({
                                    tooltip: {
                                        trigger: 'item',
                                         formatter: function (item) {
                                             return "事件数量： " + item.value[2];
                                         }
                                    },
                                    visualMap: {
                                        type: 'continuous',
                                        textStyle: {
                                            color: '#fff'
                                        },
                                        min:0,
                                        max:600,
                                        color: ['#e3bf4c', '#be4f51', '#60c2cc']
                                    },
                                    geo: {

                                        // 省份的名称是中文，这是js文件里指定的
                                        map: '坪山区',
                                        label: {
                                            emphasis: {
                                                show: false
                                            }
                                        },
                                        itemStyle: {
                                            normal: {
                                                areaColor: '#323c48',
                                                borderColor: '#111'
                                            },
                                            emphasis: {
                                                areaColor: '#2a333d'
                                            }
                                        }
                                    },

                                    // toolbox添加图片下载功能
                                    toolbox: {
                                        show : true,
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

                                    series: [
                                        {
                                            name:'热点社区',
                                            type: 'scatter',
                                            coordinateSystem: 'geo',
                                            data:convertData( mapData ),



                                            // 设置散点的大小随着数值大小的变化而变化
                                            symbolSize: function(val){
                                                return val[2]/5;
                                            },
                                            zoom: 10,
                                            label: {
                                                normal: {
                                                    formatter:'{b}',
                                                    position:'right',
                                                    show: false
                                                },
                                                emphasis: {
                                                    show: true
                                                }
                                            },
                                            itemStyle: {
                                                normal:{
                                                    color:'purple'
                                                }
                                            }
                                        },

                                        // 显示民生事件最多的几个街区
                                        {
                                            name: 'Top 5',
                                            type: 'effectScatter',
                                            coordinateSystem: 'geo',
                                            data: convertData(mapData.sort(function (a, b) {
                                                return b.value - a.value;
                                            }).slice(0, 6)),
                                            symbolSize: function (val) {
                                                return val[2] / 5;
                                            },
                                            showEffectOn: 'render',
                                            rippleEffect: {
                                                brushType: 'stroke'
                                            },
                                            hoverAnimation: true,
                                            label: {
                                                normal: {
                                                    formatter: '{b}',
                                                    position: 'right',
                                                    show: true
                                                }
                                            },
                                            itemStyle: {
                                                normal: {
                                                    color: 'purple',
                                                    shadowBlur: 10,
                                                    shadowColor: '#333'
                                                }
                                            },
                                            zlevel: 1
                                        }

                                    ]

                            })

                        }

                        // 处理后端返回值值为空时的情况
                        else
                        {
                            this.$alert(  '对应时间范围内数据！', {
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
                        setTimeout(  () => {
                            this.drawColumn()
                        },10000)

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
                else;
                console.log("jjjjj:"+value[0])
                console.log(value[1])
                this.drawmap(value);
            }
        }
}


</script>

<style scoped>

#myChart {
    width: 100%;
    height: 850px;
    background-color: black;
}
h1{
    text-align: center;
    margin: 30px 0;
}
p{
    line-height: 30px;
    margin-bottom: 10px;
    text-indent: 2em;
}
.logout{
    color: #409EFF;
}
</style>
