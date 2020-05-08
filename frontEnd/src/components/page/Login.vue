// 组件功能
// 登录页面
<template>

    <div class="login-wrap">

        <div class="ms-login">
            <div class="ms-title">政府大数据处理实时分析系统</div>

            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">

                <!-- 账号输入 -->
                <el-form-item prop="username">
                    <el-input v-model="param.userAccount" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>

                <!-- 密码输入 -->
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.userPassword"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>

<!--                <div class="showYZM_div">-->
<!--                    <div class="yzm_div">-->
<!--                        <el-form-item prop="username">-->
<!--                            &lt;!&ndash; <el-input v-model="check_yzm" placeholder="输入验证码"  @blur="checkYZM" @keyup.enter="$event.target.blur" style="width: 200px;height: 30px"> &ndash;&gt;-->
<!--                            <el-input v-model="check_yzm" placeholder="输入验证码" @keyup.enter="$event.target.blur" style="width: 200px;height: 30px">-->
<!--                                <el-button slot="prepend" icon="el-icon-lx-people" style="height: 30px"></el-button>-->
<!--                            </el-input>-->
<!--                            <div class="s-canvas" style="line-height:24px" >-->
<!--                                <canvas id="s-canvas" :width="contentWidth" :height="contentHeight"></canvas>-->
<!--                            </div>-->
<!--                        </el-form-item>-->
<!--                    </div>-->

<!--                    <div class="yzm_text_div" style="color: red">-->
<!--                        <a href="javascript:void(0);" @click="changeYZM">看不清，换一张试试？</a>-->
<!--                    </div>-->
<!--                </div>-->

                <Vcode
                        :show="isShow"
                        @onSuccess="onSuccess"
                        @onFail="onFail"
                        @onClose="onClose"
                />

                <!-- 提交登录申请 -->
                <div class="login-btn">
<!--                    <el-button type="primary" @click="submitForm()">登录</el-button>-->
                    <el-button type="primary" @click="onSubmit()">登录</el-button>
                </div>

            </el-form>

        </div>

    </div>

</template>

<script>
    import Vcode from "vue-puzzle-vcode";
    export default {
        props: {
            identifyCode: { // 默认注册码
                type: String,
                // default: ''
            },
            fontSizeMin: { // 字体最小值
                type: Number,
                default: 25
            },
            fontSizeMax: { // 字体最大值
                type: Number,
                default: 35
            },
            backgroundColorMin: { // 验证码图片背景色最小值
                type: Number,
                default: 200
            },
            backgroundColorMax: { // 验证码图片背景色最大值
                type: Number,
                default: 220
            },
            dotColorMin: { // 背景干扰点最小值
                type: Number,
                default: 60
            },
            dotColorMax: { // 背景干扰点最大值
                type: Number,
                default: 120
            },
            contentWidth: { // 容器宽度
                type: Number,
                default: 90
            },
            contentHeight: { // 容器高度
                type: Number,
                default: 30
            }
        },
        data() {
            return {


                param: {
                    userAccount: '',
                    userPassword: '',
                },

                // 未填入账户和密码时报错
                rules: {
                    userAccount: [{ required: true, message: '请输入你的用户名', trigger: 'blur' }],
                    userPassword: [{ required: true, message: '请输入你的密码', trigger: 'blur' }],
                },

                isShow: false, // 验证码模态框是否出现
                yzm_code:'axaz',
                check_yzm:'',
                check_yzm_status:false,
                yzm_code_length:4,
                ErrorMessage:'',
                showErrorMssage:false,

                timeout:  null
            };
        },
        components:{
            Vcode
        },
        methods: {
          submitForm () {
            //console.log(this.param.username)
            // this.checkYZM();
            //console.log(this.check_yzm_status);
            // if(this.check_yzm_status==false){
            //     this.check_yzm="";
            //     this.$message.error( "拼图错误！请重试");
            //     this.changeYZM();
            // }

            // else if(this.check_yzm_status==true)

                this.$axios
                    .post('/api/login', {
                        userAccount: this.param.userAccount,
                        userPassword: this.param.userPassword
                    })
                    .then(successResponse => {
                        // 设置登陆成功之后的跳转
                        // 或者在登录失败时提示
                        console.log( successResponse.data )
                        if ( successResponse.data.code === 1 ) {
                            //console.log( successResponse )
                            window.localStorage.setItem( 'userInfo', successResponse.data.priority )
                            //console.log( window.localStorage.getItem( 'userInfo'))
                            window.localStorage.setItem( 'access-user', this.param.userAccount  )
                            this.$message.success('登录成功');
                            //localStorage.setItem('ms_username');
                            this.$router.push('/dashboard');
                        }
                        else{
                            if(successResponse.data.msg === "No account"){
                                this.$message.error( "账号错误！请重试")

                                this.param.userAccount='';
                                this.param.userPassword='';
                                //location.reload()
                            }
                            else if(successResponse.data.msg === "Password error"){
                                this.$message.error( "密码错误！请重试")
                                this.param.userAccount='';
                                this.param.userPassword='';
                                //location.reload()
                            }
                            else{
                                this.$message.error( "错误未知！请重试")
                                this.param.userAccount='';
                                this.param.userPassword='';
                                // location.reload()
                            }
                        }
                    })
                    .catch(failResponse => {
                    })


          },

            changeYZM:function(){
                let yzm_code = '';//点击更换时-初始验证码
                let yzm_code_length = this.yzm_code_length;//验证码长度获取
                let codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                    'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');//候选字符
                //通过循环获取yzm_code_length位codeChars中的字符下标，并通过下标获取指定字符，最后拼接
                for (let i = 0; i < yzm_code_length; i++ ) {
                    let charNum = Math.floor(Math.random() * 62);//获取随机验证码下标
                    yzm_code += codeChars[charNum];//根据下标获取指定字符并拼接
                }
                this.identifyCode = yzm_code;
                // console.log("llll验证"+this.identifyCode);
                // console.log("修改后验证码---"+yzm_code);
                return this.yzm_code = yzm_code;
            },
            checkYZM:function () {
                if(this.check_yzm == ''){
                    this.ErrorMessage = '验证码不能为空';
                    this.showErrorMssage = true;
                    this.check_yzm_status = false;
                    this.$message.error( "验证码不能为空")
                    return;
                }else if(this.check_yzm.toUpperCase() != this.yzm_code.toUpperCase()){
                    // console.log("待校验验证码---"+this.check_yzm.toUpperCase())
                    // console.log("正确验证码---"+this.yzm_code.toUpperCase())
                    // this.$message.error( "验证码错误")
                    // this.ErrorMessage = '验证码输入有误';
                    this.check_yzm_status = false;
                    this.showErrorMssage = true;
                    return;
                }else {
                    this.ErrorMessage = '';
                    this.showErrorMssage = false;
                    this.check_yzm_status = true;
                }
            },
            randomNum (min, max) {
                return Math.floor(Math.random() * (max - min) + min)
            },

            // 生成一个随机的颜色
            randomColor (min, max) {
                let r = this.randomNum(min, max)
                let g = this.randomNum(min, max)
                let b = this.randomNum(min, max)
                return 'rgb(' + r + ',' + g + ',' + b + ')'
            },

            drawPic () {
                let canvas = document.getElementById('s-canvas')
                let ctx = canvas.getContext('2d')
                ctx.textBaseline = 'bottom'
                // 绘制背景
                ctx.fillStyle = '#e6ecfd'
                ctx.fillRect(0, 0, this.contentWidth, this.contentHeight)
                // 绘制文字
                for (let i = 0; i < this.identifyCode.length; i++) {
                    this.drawText(ctx, this.identifyCode[i], i)
                }
                this.drawLine(ctx)
                this.drawDot(ctx)
            },

            drawText (ctx, txt, i) {
                ctx.fillStyle = this.randomColor(50, 160) // 随机生成字体颜色
                ctx.font = this.randomNum(this.fontSizeMin, this.fontSizeMax) + 'px SimHei' // 随机生成字体大小
                let x = (i + 1) * (this.contentWidth / (this.identifyCode.length + 1))
                let y = this.randomNum(this.fontSizeMax, this.contentHeight - 5)
                var deg = this.randomNum(-30, 30)
                // 修改坐标原点和旋转角度
                ctx.translate(x, y)
                ctx.rotate(deg * Math.PI / 180)
                ctx.fillText(txt, 0, 0)
                // 恢复坐标原点和旋转角度
                ctx.rotate(-deg * Math.PI / 180)
                ctx.translate(-x, -y)
            },

            drawLine (ctx) {
                // 绘制干扰线
                for (let i = 0; i < 4; i++) {
                    ctx.strokeStyle = this.randomColor(100, 200)
                    ctx.beginPath()
                    ctx.moveTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
                    ctx.lineTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
                    ctx.stroke()
                }
            },

            drawDot (ctx) {
                // 绘制干扰点
                for (let i = 0; i < 30; i++) {
                    ctx.fillStyle = this.randomColor(0, 255)
                    ctx.beginPath()
                    ctx.arc(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight), 1, 0, 2 * Math.PI)
                    ctx.fill()
                }
            },

            onSuccess(msg){
                this.isShow = false; // 通过验证后，需要手动隐藏模态框
                this.submitForm ()
            },
            // 用户点击遮罩层，应该关闭模态框
            onFail(msg){
                this.$message.error( "拼图错误！请重试")
            },
            onClose(){
                this.isShow = false;

            },

            onSubmit(){
                this.isShow = true;
            },

        },

        watch: {
            identifyCode () {
                this.drawPic()
            }
        },

        mounted () {
            // this.drawPic()
            this.changeYZM();
        }
    };
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    /* background-image: url(../../assets/img/eva.jpg); */
    background-image: url(../../assets/img/big_data.png);
    background-size: 100%;
    background-position: center
}

/* 登录框标题 */
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color:black;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 450px;
    margin: -170px 0 0 -195px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}

.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
    margin-top: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}

.s-canvas{
    float:right;
    margin-top:0px;
    margin-right: 0px;
    width: 150px;
    height: 30px;
    position: relative;
}

a:link {color: #FF0000}
a:visited {color: #00FF00}
a:hover {color: #FF00FF}
a:active {color: #0000FF}
</style>
