<template>
  <div>
    <el-row class="demo-autocomplete">
      <el-col :span="12">
        <div class="sub-title">所属街道</div>
        <el-autocomplete
          class="inline-input"
          v-model="state"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          @select="handleSelect"
        ></el-autocomplete>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row class="demo-autocomplete1">
      <el-col :span="12">
        <div class="sub-title">所属社区</div>
        <el-autocomplete
          class="inline-input"
          v-model="state1"
          :fetch-suggestions="querySearch1"
          placeholder="请输入内容"
          @select="handleSelect1"
        ></el-autocomplete>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row class="demo-autocomplete2">
      <el-col :span="12">
        <div class="sub-title">问题类型</div>
        <el-autocomplete
          class="inline-input"
          v-model="state2"
          :fetch-suggestions="querySearch2"
          placeholder="请输入内容"
          @select="handleSelect2"
        ></el-autocomplete>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row class="demo-autocomplete3">
      <el-col :span="12">
        <div class="sub-title">大类名称</div>
        <el-autocomplete
          class="inline-input"
          v-model="state3"
          :fetch-suggestions="querySearch3"
          placeholder="请输入内容"
          @select="handleSelect3"
        ></el-autocomplete>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row class="demo-autocomplete4">
      <el-col :span="12">
        <div class="sub-title">小类名称</div>
        <el-autocomplete
          class="inline-input"
          v-model="state4"
          :fetch-suggestions="querySearch4"
          placeholder="请输入内容"
          @select="handleSelect4"
        ></el-autocomplete>
      </el-col>
    </el-row>

    <el-divider></el-divider>
    <el-row class="demo-autocomplete5">
      <el-col :span="12">
        <div class="sub-title">处置部门</div>
        <el-autocomplete
          class="inline-input"
          v-model="state5"
          :fetch-suggestions="querySearch5"
          placeholder="请输入内容"
          @select="handleSelect5"
        ></el-autocomplete>
      </el-col>
    </el-row>

    <el-divider></el-divider>
    <el-row class="demo-autocomplete6">
      <el-col :span="12">
        <div class="sub-title">问题来源</div>
        <el-autocomplete
          class="inline-input"
          v-model="state6"
          :fetch-suggestions="querySearch6"
          placeholder="请输入内容"
          @select="handleSelect6"
        ></el-autocomplete>
      </el-col>
    </el-row>

    <el-divider></el-divider>
    <el-row class="demo-autocomplete7">
      <el-col :span="12">
        <div class="sub-title">问题性质名称</div>
        <el-autocomplete
          class="inline-input"
          v-model="state7"
          :fetch-suggestions="querySearch7"
          placeholder="请输入内容"
          @select="handleSelect7"
        ></el-autocomplete>
      </el-col>
    </el-row>

    <el-divider></el-divider>
    <el-button type="primary" @click="adding_data()">增加数据</el-button>
  </div>
</template>
<script>
    export default {
        data() {
            return {
                param:
                {
                    street: '-',
                    community: '-',
                    eventType: '-',
                    mainType: '-',
                    subType: '-',
                    dispose: '-',
                    eventSrc: '-',
                    eventProperty: '-',
                    time: ''
                },
                restaurants: [],
                restaurants1:[],
                restaurants2:[],
                restaurants3: [],
                restaurants4:[],
                restaurants5:[],
                restaurants6: [],
                restaurants7:[],
                restaurants8:[],
                state: '',
                state1: '',
                state2: '',
                state3: '',
                state4: '',
                state5: '',
                state6: '',
                state7: '',
                state8: ''
            };
        },
        methods: {
            querySearch(queryString, cb)
             {
                //console.log(this.restaurants)
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
                    { "value": "碧岭街道"},
                    { "value": "坑梓街道" },
                    { "value": "龙田街道"},
                    { "value": "马峦街道"},
                    { "value": "石井街道" },
                    { "value": "坪山街道"}
                ];
            },
            handleSelect(item) {
                // console.log(item);
                // console.log(this.state);
            },


            loadAll1() {
                return [
                    { "value": "马峦社区"},
                    { "value": "金龟社区"},
                    { "value": "汤坑社区"},
                    { "value": "江岭社区"},
                    { "value": "坪环社区"},
                    { "value": "坪山社区"},
                    { "value": "沙坣社区"},
                    { "value": "六联社区"},
                    { "value": "田头社区"},
                    { "value": "碧岭社区"},
                    { "value": "沙湖社区"},
                    { "value": "田心社区"},
                    { "value": "六和社区"},
                    { "value": "竹坑社区"},
                    { "value": "老坑社区"},
                    { "value": "坑梓社区"},
                    { "value": "和平社区"},
                    { "value": "石井社区"},
                    { "value": "南布社区"},
                    { "value": "金沙社区"},
                    { "value": "龙田社区"},
                    { "value": "沙田社区"},
                    { "value": "秀新社区"}

                ];
            },
            querySearch1(queryString, cb)
            {
                var restaurants1 = this.restaurants1;
                var results = queryString ? restaurants1.filter(this.createFilter(queryString)) : restaurants1;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            handleSelect1(item) {
                // console.log(item);
                // console.log(this.state1);
            },

            loadAll2() {
                return [
                    { "value": "安全隐患"},
                    { "value": "治安维稳"},
                    { "value": "环保水务"},
                    { "value": "规土城建"},
                    { "value": "市容环卫"},
                    { "value": "市政设施"},
                    { "value": "交通运输"},
                    { "value": "劳动社保"},
                    { "value": "食药市监"},
                    { "value": "文体旅游"},
                    { "value": "教育卫生"},
                    { "value": "组织人事"},
                    { "value": "党建群团"},
                    { "value": "党纪政纪"},
                    { "value": "民政服务"},
                    { "value": "统一战线"},
                    { "value": "社区管理"},
                    { "value": "专业事件采集"}
                ];
            },
            querySearch2(queryString, cb)
            {
                var restaurants2 = this.restaurants2;
                var results = queryString ? restaurants2.filter(this.createFilter(queryString)) : restaurants2;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            handleSelect2(item)
             {
                // console.log(item);
                // console.log(this.state2);
            },

            loadAll3()
            {
                return [
                    { "value": "车辆乱停放"},
                    { "value": "公用部件"},
                    { "value": "建设工程质量"},
                    { "value": "绿化养护"},
                    { "value": "禽畜养殖污染"},
                    { "value": "占道经营"}
                ];
            },
            querySearch3(queryString, cb)
            {
                var restaurants3 = this.restaurants3;
                var results = queryString ? restaurants3.filter(this.createFilter(queryString)) : restaurants3;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            handleSelect3(item)
             {
                // console.log(item);
                // console.log(this.state3);
            },

            loadAll4()
            {
                console.log("akkakaka"+this.state3);
                if(this.state3=="车辆乱停放")
                {
                    return [
                        { "value": "机动车乱停放"},
                        { "value": "非机动车乱停放"}
                    ];
                }
                else if(this.state3=="公用部件")
                {
                    return [
                        { "value": "下水井盖"},
                        { "value": "上水井盖"}
                    ];
                }
                else if(this.state3=="建设工程质量")
                {
                    return [
                        {"value": "施工安全隐患"},
                        {"value": "房屋质量安全隐患"}
                    ];
                }
                else if(this.state3=="绿化养护")
                {
                    return [
                        {"value": "绿化带养护"},
                        {"value": "树木养护"}
                    ];
                }
                else if(this.state3=="禽畜养殖污染")
                {
                    return [
                        {"value": "养殖废气"},
                        {"value": "饲养宠物家禽扰民"}
                    ];
                }
                else if(this.state3=="占道经营")
                {
                    return [
                        {"value": "店外经营"},
                        {"value": "无照经营游商"}
                    ];
                }
                else
                {
                    return []
                }
            },
            querySearch4(queryString, cb) {
                var restaurants4 = this.restaurants4;
                var results = queryString ? restaurants4.filter(this.createFilter(queryString)) : restaurants4;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            handleSelect4(item) {
                // console.log(item);
                // console.log(this.state4);
            },

            loadAll5() {
                return [
                    { "value": "城建办"},
                    { "value": "环境保护和水务局" },
                    { "value": "教育局"},
                    { "value": "民政局" },
                    { "value": "人力资源局"},
                    { "value": "土地整备局"},
                    { "value": "卫生和计划生育局"}
                ];
            },
            querySearch5(queryString, cb) {
                var restaurants5 = this.restaurants5;
                var results = queryString ? restaurants5.filter(this.createFilter(queryString)) : restaurants5;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            handleSelect5(item) {
                // console.log(item);
                // console.log(this.state5);
            },

            loadAll6() {
                return [
                    { "value": "政府信箱"},
                    { "value": "美丽深圳" },
                    { "value": "固化投诉"},
                    { "value": "12345" },
                    { "value": "12319"},
                    { "value": "@坪山"}
                ];
            },
            querySearch6(queryString, cb) {
                var restaurants6 = this.restaurants6;
                var results = queryString ? restaurants6.filter(this.createFilter(queryString)) : restaurants6;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            handleSelect6(item) {
                // console.log(item);
                // console.log(this.state6);
            },

            loadAll7() {
                return [
                    { "value": "感谢"},
                    { "value": "建议"},
                    { "value": "求决"},
                    { "value": "投诉"},
                    { "value": "咨询"},
                    { "value": "其他"}
                ];
            },
            querySearch7(queryString, cb) {
                var restaurants7 = this.restaurants7;
                var results = queryString ? restaurants7.filter(this.createFilter(queryString)) : restaurants7;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            handleSelect7(item) {
                // console.log(item);
                // console.log(this.state7);
            },

            loadAll8() {
                return [
                    { "value": "车辆乱停放"},
                    { "value": "公用部件"},
                    { "value": "建设工程质量"},
                    { "value": "绿化养护"},
                    { "value": "禽畜养殖污染"},
                    { "value": "占道经营"}
                ];
            },
            querySearch8(queryString, cb) {
                var restaurants3 = this.restaurants3;
                var results = queryString ? restaurants3.filter(this.createFilter(queryString)) : restaurants3;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            handleSelect8(item) {
                // console.log(item);
                // console.log(this.state3);
            },

            getTime(){
                var date = new Date();
                var seperator1 = "-";
                var seperator2 = ":";
                //以下代码依次是获取当前时间的年月日时分秒
                var minute = date.getMinutes();
                var hour = date.getHours();
                var second = date.getSeconds();
                //固定时间格式
                if (hour >= 0 && hour <= 9) {
                    hour = "0" + hour;
                }
                if (minute >= 0 && minute <= 9) {
                    minute = "0" + minute;
                }
                if (second >= 0 && second <= 9) {
                    second = "0" + second;
                }
                var currentdate = "2018-10-30 "+ hour + seperator2 + minute + seperator2 + second;
                console.log("当前时间是："+currentdate);
                return currentdate;
            },

            adding_data () {
                var Time = this.getTime();
                if(this.state==""||this.state1==""||this.state2==""||this.state3==""||this.state4==""||this.state5==""||this.state6==""||this.state7=="")
                {
                    this.$message.error( "选项还有空余")
                }

                else{
                    this.$axios(
                    {
                        url: '/api/updateLiveData',
                        method:'post',
                        data:
                        {

                            street: this.state,
                            community: this.state1,
                            eventType: this.state2,
                            mainType: this.state3,
                            subType: this.state4,
                            dispose: this.state5,
                            eventSrc: this.state6,
                            eventProperty: this.state7,
                            time: Time
                        },

                    })
                    .then( successResponse => {
                        if ( successResponse.data === 1 )
                        {
                            console.log("上传成功")

                            location.reload()
                            this.$message.success('上传成功');
                            this.state='',
                            this.state1= '',
                            this.state2= '',
                            this.state3= '',
                            this.state4= '',
                            this.state5= '',
                            this.state6= '',
                            this.state7= '',
                            this.state8= ''
                        }
                        else
                        {
                            this.$message.error( "选项还有空余")
                        }
                    })
                    .catch(failResponse => {
                    })
                }
            },
        },

        watch: {
            state3(val){
                this.loadAll4()
                this.restaurants4 = this.loadAll4();
            }
        },

        mounted() {
            this.loadAll3();
            this.restaurants = this.loadAll();
            this.restaurants1 = this.loadAll1();
            this.restaurants2 = this.loadAll2();
            this.restaurants3 = this.loadAll3();
            // this.restaurants4 = this.loadAll4();
            this.restaurants5 = this.loadAll5();
            this.restaurants6 = this.loadAll6();
            this.restaurants7 = this.loadAll7();
            this.restaurants8 = this.loadAll8();
        }
    }
</script>

<style lang="scss" scoped>
  .sub-title{
    display: flex;
    align-items: center;
    margin-left: 50px;
    height: 40px;
  }

  .inline-input{
    width: 700px;
  }
</style>
