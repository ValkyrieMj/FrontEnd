// 组件对应内容：
// 可视化功能四：民生事件结办情况分析
// 展示一定时间范围内各街道对应的民生数据，时间范围有用户指定，若初始时刻用户未指定时间
// 默认从服务器请求"今日"的数据，"今日"默认设置为20181030，由于这个值在后
// 也写死了，所以原则上不允许修改默认的"今日"的值
<template>
    <div>
        <li>
            <el-button type="primary" size="small" plain @click="monthTime">月</el-button>
            <el-button type="primary" size="small" plain @click="quarterTime">季度</el-button>
            <el-button type="primary" size="small" plain @click="dateTime">日</el-button>
        </li>
        <div class="block" v-show="showTime3">
            <span class="demonstration">日期</span>
            <el-date-picker
            v-model="value1"
            @change="drawpies(value1)"
            type="daterange"
            range-separator="至"
            start-placeholder="2018-10-30"
            end-placeholder="2018-10-30"
            value-format='yyyyMMdd'
            default-value="2018-10-30"
            :picker-options="pickerOptions"
            >
            </el-date-picker>
        </div>

    <el-row>
      <el-col :span="8" v-show="showTime">
<!--        <li class="nav_left">适用时间:</li>-->
        <el-date-picker
          v-model="value4"
          :type=dataSize
          :placeholder="chosesData"
          @change="select_month"
          value-format="yyyyMM"
          default-value="2018-10-30"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-col>

       <el-col :span="2" v-show="showTime2">
        <li class="show1" v-show="showTime1a">
          <p> <button
            type="button"
            aria-label="前一年"
            class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left"
            @click="prev"
          ></button>
            <span role="button" class="span-year">{{year}}年</span>
            <button
              type="button"
              aria-label="后一年"
              @click="next"
              class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right"
            ></button></p>
        </li>
            <el-autocomplete
                class="inline-input"
                v-model="value_season"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                @select="selectQuarter"
                :picker-options="pickerOptions"
            ></el-autocomplete>
      </el-col>
        <!-- <div class="sub-title">激活即列出输入建议</div>
        <el-autocomplete
        class="inline-input"
        v-model="state1"
        :fetch-suggestions="querySearch"
        placeholder="请输入内容"
        @select="handleSelect"
        ></el-autocomplete> -->
    </el-row>

        <!-- 页面容器，用于存放图表 -->
         <div class="container" id="piesCharts" style="float:left;width:100%;height:600px">

        </div>

    </div>
</template>

<script>
import echarts from 'echarts';
    export default {
        name:'ResolveStatus',

        // data: function(){
        data(){
            return {
                pickerOptions: {
                    disabledDate(time) {
                        // return time.getTime() > Date.now() - 394*8.64e7;
                        return time.getTime() > 17834*8.64e7;
                    }
                },

                value1: '',

                value_season: '',
                value4:'',
                dataSize:'',
                chosesData:'',
                showMonthYear:false,
                showTime:false,
                showTime1:false,
                showTime2:false,
                showTime3:false,
                showTime1a:false,
                year: new Date().getFullYear()-1,
                valueormatTwo:'',
                choseDoubleMonth:'',
                choseQuarter:'',
                indexType:'',
                halfYearMonth:'',
                halfYearMonth1:'',
                restaurants:[],

                state1: '',
                state2: ''
            }
        },


        methods:{
            drawpies(value){

                var myChart = echarts.init(document.getElementById('piesCharts'))
                this.$axios( {
                    url: '/api/query4',
                    method:'post',
                    data:{
                        // dateBegin:this.value1[0],
                        // dateEnd:this.value1[1]
                        dateBegin:value[0],
                        dateEnd:value[1]
                    }
                })
                .then((result) => {
                    if( result.data.length != 0 )
                    {

                            //console.log(result.data[0].total )

                            // 1.设置数组存放结办情况和所有事件类型
                            // 这个数组对应legend中的data，包括了结办情况和所有的民生数据类型
                            var resolveStatusAndEventTpe = []

                            // 这个数组存放结办类型
                            var resolveStatus = []

                            // 这数组存放民生事件类型
                            var eventTypeName = []

                            // 先存储事件结办情况
                            for( var i = 0;i < result.data.length;i++ )
                            {
                                var resolvestatus = result.data[ i ].EVENT_TYPE
                                if( resolveStatusAndEventTpe.indexOf( resolvestatus) == -1 )
                                {
                                    resolveStatusAndEventTpe.push( resolvestatus )
                                    resolveStatus.push( resolvestatus )
                                }
                            }
                            //console.log( resolveStatusAndEventTpe )

                            for( var i = 0;i < result.data.length;i++ )
                            {
                                var eventtype = result.data[ i ].EVENT_TYPE_NAME;
                                if( resolveStatusAndEventTpe.indexOf( eventtype ) == -1 )
                                {
                                    resolveStatusAndEventTpe.push( eventtype )
                                    eventTypeName.push( eventtype )
                                }
                            }



                            //2.设置数组存储结办情况和对应的数量
                            var resolvestatusnumber = new Array( resolveStatus.length).fill( 0 )
                            for( var i = 0;i < result.data.length;i++ )
                            {
                                resolvestatusnumber[ resolveStatus.indexOf( result.data[i].EVENT_TYPE ) ] += result.data[i].total;
                            }


                            //3.设置数组存储民生事件类型和数量
                            var eventtypenamenumber = new Array( eventTypeName.length ).fill( 0 )
                            for( var i = 0; i < result.data.length;i++ )
                            {
                                eventtypenamenumber[ eventTypeName.indexOf( result.data[i].EVENT_TYPE_NAME ) ] += result.data[i].total;
                            }


                            // 整理数据为图表所需要的形式

                            // 先整理出环形图内圈中所需的data
                            var dataForInnerLoop = []
                            for( var i = 0; i < resolveStatus.length;i++ )
                            {
                                var datadetail = {};
                                datadetail.name = resolveStatus[i];
                                datadetail.value = resolvestatusnumber[i];
                                dataForInnerLoop.push( datadetail)
                            }
                            //console.log( dataForInnerLoop )

                            // 接下来整理外圈所需要的data
                            var dataForOutterLoop = []
                            for( var i = 0; i < eventTypeName.length;i++ )
                            {
                                var datadetail = {};
                                datadetail.name = eventTypeName[i];
                                datadetail.value = eventtypenamenumber[i];
                                dataForOutterLoop.push( datadetail)
                            }
                            //console.log( dataForOutterLoop )

                            //画图
                            myChart.setOption(
                                {
                                        tooltip: {
                                            trigger: 'item',
                                            formatter: "{a} <br/>{b}: {c} ({d}%)"
                                        },
                                        legend: {
                                            itemGap:15,
                                            orient: 'vertical',
                                            x: 'left',
                                            data: resolveStatusAndEventTpe
                                            // data:['直达','营销广告','搜索引擎','邮件营销','联盟广告','视频广告','百度','谷歌','必应','其他']
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
                                                name:'结办情况',


                                                //avoidLabelOverlap: true,
                                                minAngle:5,
                                                hoverAnimation:true,

                                                type:'pie',
                                                selectedMode: 'single',
                                                radius: [0, '30%'],

                                                label: {
                                                    normal: {
                                                        position: 'inner'
                                                    }
                                                },
                                                labelLine: {
                                                    normal: {
                                                        show: false
                                                    }
                                                },
                                                data:dataForInnerLoop
                                            },
                                            {
                                                name:'事件类型',
                                                type:'pie',
                                                radius: ['40%', '55%'],
                                                avoidLabelOverlap: true,//对，就是这里avoidLabelOverlap
                                                label: {
                                                    normal: {
                                                        formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                                                        backgroundColor: '#eee',
                                                        borderColor: '#aaa',
                                                        borderWidth: 1,
                                                        borderRadius: 4,
                                                        rich: {
                                                            a: {
                                                                color: '#999',
                                                                lineHeight: 22,
                                                                align: 'center'
                                                            },

                                                            hr: {
                                                                borderColor: '#aaa',
                                                                width: '100%',
                                                                borderWidth: 0.5,
                                                                height: 0
                                                            },
                                                            b: {
                                                                fontSize: 16,
                                                                lineHeight: 33
                                                            },
                                                            per: {
                                                                color: '#eee',
                                                                backgroundColor: '#334455',
                                                                padding: [2, 4],
                                                                borderRadius: 2
                                                            }
                                                        }
                                                    }
                                                },
                                                data:dataForOutterLoop
                                            }
                                        ]
                                    }
                            )
                    }

                    // 处理无返回数据的情况
                    else
                    {
                        this.$alert(  '这个时间范围无对应数据！', {
                        confirmButtonText: '确定',
                            callback: action => {
                                this.$message({
                                type: 'info',
                                message: `action: ${ 确定 }`
                                });
                            }
                        });
                    }

                    // 定期向服务器轮询，10s间隔
                    setTimeout(  () => {
                        this.drawLine()
                    },10000)
                })
            },

            monthTime(){
                this.showTime=true;
                this.showTime1=false;
                this.showTime2=false;
                this.showTime3=false;
                this.showMonthYear=true;
                this.dataSize='month';
                this.chosesData='选择月';
                this.valueormatTwo='yyyy-MM'
                this.choseQuarter='';
                this.halfYearMonth='';
                this.choseDoubleMonth='';
                this.halfYearMonth1=''
            },
            quarterTime(){
                this.showTime=false;
                this.showTime1=false;
                this.showTime2=true;
                this.showTime3=false;
                this.showTime1a=true;
                this.choseDoubleMonth='';
                this.halfYearMonth='';
                this.value4=''
                this.halfYearMonth1=''
                console.log(this.restaurants)
            },

            dateTime(){
                this.showTime=false;
                this.showTime1=false;
                this.showTime2=false;
                this.showTime3=true;
                this.choseDoubleMonth='';
                this.halfYearMonth='';
                this.value4=''
                this.halfYearMonth1=''
            },

            showDoubleMonth(){
                this.showTime1a=true;
            },
            prev() {
                this.year = this.year * 1 - 1
            },
            next() {
                this.year = this.year * 1 + 1
                if(this.year>=2019)
                {
                    this.year=this.year-1
                }
            },


            selectQuarter(){
                // console.log(this.choseQuarter);
                console.log(this.value_season)
                var value=[]
                if(this.value_season=="第一季度")
                {
                    // this.choseQuarter=this.year+'-'+'Q1';
                    // this.showTime1a=false
                    console.log("begin time:"+this.year+"0101");
                    console.log("end time:"+this.year+"0331");
                    value[0] = this.year+"0101"
                    value[1] = this.year+"0331"
                }
                else if(this.value_season=="第二季度")
                {
                    console.log("begin time:"+this.year+"0401");
                    console.log("end time:"+this.year+"0630");
                    value[0] = this.year+"0501"
                    value[1] = this.year+"0630"
                }
                else if(this.value_season=="第三季度")
                {
                    console.log("begin time:"+this.year+"0701");
                    console.log("end time:"+this.year+"0930");
                    value[0] = this.year+"0701"
                    value[1] = this.year+"0930"
                }
                else if(this.value_season=="第四季度")
                {
                    console.log("begin time:"+this.year+"1001");
                    console.log("end time:"+this.year+"1231");
                    value[0] = this.year+"1001"
                    value[1] = this.year+"1231"
                }
                else;
                this.drawpies(value)
            },

            querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            loadAll() {
                return [
                    { "value": "第一季度"},
                    { "value": "第二季度"},
                    { "value": "第三季度"},
                    { "value": "第四季度"}
                ];
            },
            select_month()
            {
                console.log(this.value4);
                console.log(this.value4.substr(0,4));
                var year = this.value4.substr(0,4);
                var month = this.value4.substr(4,6);
                var value = [];
                console.log(month);
                if(month == "01"||month == "03"|| month == "05"|| month=="07"|| month == "08"|| month=="10"|| month == "12")
                {
                    console.log("jjjjj")
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
                this.drawpies(value);
            }

        },

        mounted(){
            this.drawpies(["20181030","20181030"]);
            this.restaurants = this.loadAll();
        },

    }
</script>

<style scoped>
.example-p{
    height: 45px;
    display: flex;
    align-items: center;
}
.search-box{
    text-align: center;
    margin-top: 10px;
}
.search{
    width: 300px;
}
ul,li{
    list-style: none;
}
.icon-li{
    display: inline-block;
    padding: 10px;
    width: 120px;
    height: 120px;
}
.icon-li-content{
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.icon-li-content i{
    font-size: 36px;
    color: #606266;
}
.icon-li-content span{
    margin-top: 10px;
    color: #787878;
}
.inline-input{
width: 150px;
margin-top: 5px;
}
.span-year{
    margin-left: 30px
}
</style>
