// 组件对应内容：
// 可视化功能一：民生分析
// 展示一定时间范围内名声数据，时间范围有用户指定，若初始时刻用户未指定时间
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
                @change="drawLine"
                placeholder="选择日期"
                value-format='yyyyMMdd'
                default-value="2018-10-30"
                >
            </el-date-picker>
        </div> -->
        <div class="block">
            <span class="demonstration">日期</span>
                <el-date-picker
                    v-model="value1"
                    @change="drawLine"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="2018-10-30"
                    end-placeholder="2018-10-30"
                    value-format='yyyyMMdd'
                    default-value="2018-10-30"
                    unlink-panels
                    :picker-options="pickerOptions"
                    >
                </el-date-picker>
        </div>

        <!-- 图表容器 -->
        <div class="container" id="pieChart" style="float:left;width:100%;height:850px">

        </div>
    </div>
</template>

<script>
import echarts from 'echarts';
export default {
    name: 'BaseLiveInfo',
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
    // 服务器判断请求日期为空时，默认返回"今日"的数据，在服务器中将"今日"设定为 2018年10月30号
    mounted(){
        this.drawLine()
    },

    methods: {
        drawLine() {
                var myChart = echarts.init(document.getElementById('pieChart'))

                // 向服务器发送请求
                this.$axios( {
                url:'/api/query1',
                method:'post',
                data:
                {
                    dateBegin:this.value1[0],
                    dateEnd:this.value1[1]
                }
                })
                .then( (result)=> {
                    if( result.data.length != 0  )
                    {
                            //console.log( this.value1 )
                            var eventData= [];
                            var number=[];
                            for ( var i = 0;i < result.data.length; i++ )
                            {
                                eventData.push( result.data[i].name);

                            }
                            myChart.setOption({
                            tooltip: {
                                trigger: 'item',
                                formatter: "{a} <br/>{b}: {c} ({d}%)"
                            },
                            legend: {
                                orient: 'vertical',
                                left: 'left',
                                data: eventData
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
                                    name: '事件类型',
                                    type: 'pie',
                                    avoidLabelOverlap: true,
                                    data: result.data,


                                    // 显示饼图时，给每个扇形添加一个数量和比例的显示，使信息更直观
                                    itemStyle: {
                                        emphasis: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                                        },
                                        normal:{
                                            label:{
                                                show: true,
                                                formatter: '{b} : {c} ({d}%)'
                                            },
                                            labelLine :{show:true}
                                        }
                                    }


                                }

                            ]
                        });
                    }

                    // 处理后端返回值值为空时的情况
                    else
                    {
                        this.$alert(  '这段时间无对应数据！', {
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
                        this.drawLine()
                    },10000)

                })
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
