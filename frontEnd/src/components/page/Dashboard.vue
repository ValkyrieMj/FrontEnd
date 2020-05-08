// 这个是主页页面，登录后看到的第一个页面
//


<template >
    <div>
        <el-row :gutter="20">
            <el-col :span="8">

                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="../../assets/img/officer.jpg" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{username}}</div>
                            <div>{{position}}</div>
                        </div>
                    </div>

                </el-card>
                <el-card shadow="hover" style="height:320px;"  data="text_data;text_data1">
                    <div slot="header" class="clearfix">
                        <span>安全隐患重点社区</span>
                    </div>
                    <span v-text="text_data[0].COMMUNITY_NAME"></span>
                    <el-progress :percentage="text_data1[0]" color="#42b983"  show-text="false"></el-progress>
                    <span v-text="text_data[1].COMMUNITY_NAME"></span>
                    <el-progress :percentage="text_data1[1]" color="#f1e05a"></el-progress>
                    <span v-text="text_data[2].COMMUNITY_NAME"></span>
                    <el-progress :percentage="text_data1[2]"></el-progress>
                    <span v-text="text_data[3].COMMUNITY_NAME"></span>
                    <el-progress :percentage="text_data1[3]" color="#f56c6c"></el-progress>
                    <span v-text="text_data[4].COMMUNITY_NAME"></span>
                    <el-progress :percentage="text_data1[4]" color="#909399"></el-progress>
                    <span v-text="text_data[5].COMMUNITY_NAME"></span>
                    <el-progress :percentage="text_data1[5]" color="#909399"></el-progress>
                </el-card>
                <!-- <div class="container" id="columnChart" style="width:100%;height:250px;"></div> -->
            </el-col>


            <el-col :span="16">


                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">角色：{{position}}</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>



                    <el-col :span="8" scope='number'>
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num" >{{number}}</div>
                                    <div>未结办事件数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>


                    <el-col :span="8" scope='totalNumber'>
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{totalNumber}}</div>
                                    <div>今日事件总数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>

                </el-row>

                <el-card shadow="hover" style="height:471px;">

                    <!-- 区快标题 -->
                    <div slot="header" class="clearfix">
                        <span>实时事件</span>
                    </div>
                    <div>
                        <template>
                             <vue-seamless-scroll :data="listData" :class-option="optionSingleHeightTime" class="seamless-warp">
                                <ul class="item">
                                    <li v-for="item in listData">
                                        <span>2018年10月30日</span>
                                        <span class="title1" v-text="item.STREET_NAME" style="background:red"></span>
                                        <span>的</span>
                                        <span class="title2" v-text="item.COMMUNITY_NAME" style="background:yellow"></span>
                                        <span>从</span>
                                        <span class="title3" v-text="item.EVENT_SRC_NAME" style="background:blue"></span>
                                        <span>接到</span>
                                        <span class="title4" v-text="item.SUB_TYPE_NAME" style="background:green"></span>
                                        <span class="title5" v-text="item.EVENT_PROPERTY_NAME" style="background:purple"></span>
                                        <span>，请</span>
                                        <span class="title6" v-text="item.DISPOSE_UNIT_NAME" style="background:orange"></span>
                                        <span>尽快前往处理</span>
                                        <el-divider></el-divider>
                                    </li>
                                </ul>
                             </vue-seamless-scroll>
                        </template>
                    </div>
                </el-card>


            </el-col>
        </el-row>
    </div>
</template>

<script>
import echarts from 'echarts';
import Schart from 'vue-schart';
import bus from '../common/bus';
export default {
    name: 'dashboard',
    data() {
        return {
            username:localStorage.getItem('access-user'),
            // "注册所有绑定变量"
            number:"",              // 异常事件数量
            totalNumber:"",         // "今日"民生事件总数
            position:localStorage.getItem('userInfo'),

            listData: [
            ],

            text_data:[],
            text_data1:[]
        };
    },
    components: {
        Schart
    },
    computed: {
        role() {
            return this.name === 'Lim' ? '超级管理员' : '普通用户';
        },

        optionSingleHeightTime () {
            return {
                singleHeight: 26,
                waitTime: 2500
            }
        }
    },


    mounted(){
        this.getNum(),
        this.getInfo(),
        this.getInfo1()
    },
    methods: {

        // 只展示 2018-10-30当日的民生事件
        getNum() {
                this.$axios( {
                    url: '/api/query1',
                    method:'post',
                    data:{
                        dateBegin:'20181030',
                        dateEnd:'20181030'
                    }
                })
                .then( (result) => {

                    // 获取今日的异常事件总数
                    // this.number = result.data[1].value

                    // 获取今日的所有民生事件总数
                    var total = 0;
                    for( var i = 0;i < result.data.length;i ++ )
                    {
                        total += result.data[i].value;
                    }
                    this.totalNumber = total;

                })
                // 定期向服务器轮询,10s间隔
                setTimeout(  () => {
                    this.getNum()
                },10000)
        },




        changeDate() {
            const now = new Date().getTime();
            this.data.forEach((item, index) => {
                const date = new Date(now - (6 - index) * 86400000);
                item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            });
        },

        getInfo(){
            this.$axios( {
                url: '/api/alert1',
                method:'post',
            })
            .then((result) => {
                this.number = result.data.length;
                for(var i = 0;i<result.data.length;i++)
                {
                    this.listData.push(result.data[i])
                }
            })
        } ,


        getInfo1(){
            this.$axios( {
                url: '/api/alert2',
                method:'get',
            })
            .then((result) => {
                var sum=0;
                for(var i = 0;i<result.data.length;i++)
                {
                    this.text_data.push(result.data[i])
                    sum+=result.data[i].total
                }

                for(var i = 0;i<result.data.length;i++)
                {
                    var temp = 100*result.data[i].total/sum
                    this.text_data1.push(temp.toFixed(1))

                }
                //console.log(this.text_data);
            })
		}
    }
}
</script>


<style lang="scss" scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}

.seamless-warp {
    width: 100%;
    height: 1000px;
    overflow: hidden;
}
</style>
