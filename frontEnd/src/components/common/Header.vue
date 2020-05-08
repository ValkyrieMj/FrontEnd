<template>
    <div class="header">
        <!-- 侧边栏折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>

        <div class="logo">大数据可视化管理系统</div>
        <div class="time">
            <h style="font-size:30px">2018-10-30  {{nowTimes.hou}}:{{nowTimes.min}}:{{nowTimes.sec}}</h>
        </div>
        <div class="header-right">
            <div class="header-user-con">

                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>

                <!-- 用户头像 -->
                <div class="user-avator">
                    <img src="../../assets/img/officer.jpg" />
                </div>

                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" >
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided @click.native="manage">账户管理</el-dropdown-item>
                        <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>


            </div>
        </div>
    </div>
</template>
<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            fullscreen: false,
            username: localStorage.getItem('access-user'),

            priority: localStorage.getItem('userInfo'),

            nowTimes:{
              hou:"00",
              min:"00",
              sec:"00"
            },
        };
    },
    // computed: {
    //     username() {
    //         let username = localStorage.getItem('ms_username');
    //         return username ? username : this.name;
    //     }
    // },
    methods: {

        // 用户名下拉菜单选择事件,退出登录提示
        logout:function(){
            this.$confirm('确认退出?', '提示', {})
            .then(() => {
                sessionStorage.removeItem('user');
                this.$router.push('/login');
            })
           .catch(() => { });
        },

        manage:function(){
            console.log(this.priority);
            if(this.priority=="管理员"){
                this.$router.push('/usermanager');
            }
            else if(this.priority=="用户"){
                this.$router.push('/userchange');
            }
        },

        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        },

        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        },

        setNowTimes(){
        let myDate = new Date();
        this.nowTimes.hou = String(myDate.getHours()<10?"0"+myDate.getHours():myDate.getHours());
        this.nowTimes.min = String(myDate.getMinutes()<10?'0'+myDate.getMinutes():myDate.getMinutes());
        this.nowTimes.sec = String(myDate.getSeconds()<10?'0'+myDate.getSeconds():myDate.getSeconds());
        },
        nowTimes()
        {
            this.timeFormate(new Date());
            setInterval(this.nowTimes,1000);
            this.clear()
        },
        clear()
        {
            clearInterval(this.nowTimes)
            this.nowTimes = null;
        }
    },
    mounted() {
        if (document.body.clientWidth < 1500) {
            this.collapseChage();
        }
        setInterval( ()=>{
            this.setNowTimes();
        },1000)
    }
};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    float: left;
    width: 250px;
    line-height: 70px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}

.header .time {
    float: left;
    margin-left: 500px;
    width: 300px;
    line-height: 70px;
}
</style>
