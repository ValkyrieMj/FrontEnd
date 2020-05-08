<template>
    <div>
            <div class="user-info1">
                <img src="../../assets/img/officer.jpg"  class="tag_img" alt>
            </div>

        <h2 style="margin-left: 100px;margin-top:80px">账户信息</h2>
        <el-divider></el-divider>
        <h style="margin-left: 100px;margin-top:100px">账号：{{account}}</h>
        <h style="margin-left: 100px;margin-top:100px">昵称:{{username}}</h>
        <h style="margin-left: 100px;margin-top:100px">属性:{{priority}}</h>
        <el-divider></el-divider>
        <el-button type="primary" round class="tag_button" style="margin-left: 100px;margin-top:40px" @click="modify_name()">修改昵称</el-button>
        <el-button type="primary" round class="tag_button" style="margin-left: 100px;margin-top:40px" @click="modify_passwords()">修改密码</el-button>

        <el-dialog title="修改昵称" :visible.sync="dialogFormVisible1">
            <el-form :model="form">
                <el-form-item label="新昵称" :label-width="formLabelWidth">
                    <el-input v-model="new_adding.userName"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel_message1">取 消</el-button>
                <el-button type="primary" @click="post_message1">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="原密码" :label-width="formLabelWidth">
                    <el-input v-model="new_adding.userPassword_old" autocomplete="off" show-password></el-input>
                </el-form-item>
                <el-form-item label="新密码" :label-width="formLabelWidth">
                    <el-input v-model="new_adding.userPassword_new" autocomplete="off" show-password></el-input>
                </el-form-item>
                <el-form-item label="再次输入新密码" :label-width="formLabelWidth">
                    <el-input v-model="new_adding.userPassword_again" autocomplete="off" show-password></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel_message">取 消</el-button>
                <el-button type="primary" @click="post_message">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                username:'',
                priority:'',
                account: localStorage.getItem('access-user'),
                passwords_old:'',
                passwords_new:'',
                passwords_again: '',

                formLabelWidth: '120px',
                dialogFormVisible: false,
                dialogFormVisible1: false,
                new_adding:{
                    account:'',
                    userName:'',

                    userPassword_old:'',
                    userPassword_new:'',
                    userPassword_again:'',
                }
            }
        },
        methods:{
            get_all_message(){
                    this.$axios(
                        {
                            url: '/api/showOne',
                            method: 'post',
                            data:
                                {
                                    account: this.account,
                                    name: this.new_adding.userName
                                },

                        })
                        .then((result) => {
                            this.account=result.data.userAccount;
                            this.username=result.data.userName;
                            this.priority=result.data.userPriority;
                        })

            },
            modify_name(){
                this.dialogFormVisible1 = true;
            },

            modify_passwords(){
                this.dialogFormVisible = true;
            },

            post_message1() {
                console.log(this.account)
                console.log(this.new_adding.userName)
                // console.log(this.name)
                if(this.username!='')
                {
                    this.$axios(
                        {
                            url: '/api/updateName',
                            method: 'post',
                            data:
                                {
                                    account: this.account,
                                    name: this.new_adding.userName,
                                },

                        })
                        .then(successResponse => {
                            if (successResponse.data === "success") {
                                console.log("上传成功")
                                this.$message.success('昵称修改成功');
                                location.reload();
                                this.get_all_message();
                                this.new_adding.userName='';
                                this.new_adding.userPassword='';
                            } else {
                                location.reload()
                                this.$message.error("昵称修改失败")
                                this.new_adding.userName='';
                                this.new_adding.userPassword='';
                            }
                        })
                        .catch(failResponse => {
                        })
                }
                else{
                    this.$message.error("昵称不能为空");
                    this.new_adding.userName='';
                    this.new_adding.userPassword='';
                }


            },

            post_message() {
                console.log(this.new_adding.userPassword_old)
                console.log(this.new_adding.userPassword_new)
                // console.log(this.name)
                if(this.new_adding.userPassword_new==''||this.new_adding.userPassword_new!=this.new_adding.userPassword_again)
                {
                    this.$message.error("密码输入有误");
                    this.new_adding.userPassword_old='';
                    this.new_adding.userPassword_new='';
                    this.new_adding.userPassword_again='';
                }
                else
                {
                    this.$axios(
                        {
                            url: '/api/updateUser',
                            method: 'post',
                            data:
                                {
                                    account: this.account,
                                    oldPassword: this.new_adding.userPassword_old,
                                    newPassword: this.new_adding.userPassword_again,
                                },

                        })
                        .then(successResponse => {
                            if (successResponse.data === "success") {
                                console.log("上传成功")
                                this.$message.success('密码修改成功');
                                location.reload();
                                this.get_all_message();
                                this.new_adding.userPassword_old='';
                                this.new_adding.userPassword_new='';
                                this.new_adding.userPassword_again='';
                            } else {
                                location.reload()
                                this.$message.error("修改失败")
                                this.new_adding.userPassword_old='';
                                this.new_adding.userPassword_new='';
                                this.new_adding.userPassword_again='';
                            }
                        })
                        .catch(failResponse => {
                        })
                }


            },

            cancel_message1(){
                this.dialogFormVisible1 = false;
                this.new_adding.userPassword = '';
                this.new_adding.userName = '';
            },

            cancel_message(){
                this.dialogFormVisible = false;
                this.new_adding.userPassword_new = '';
                this.new_adding.userPassword_old = '';
            }

        },

        mounted() {
            this.get_all_message();
        }
    }
</script>

<style>
    .sub-title{
        margin-top: 10px;
    }
    .tag_input{
        margin-top: 20px;
    }
    .user-info1{
        background-image: url(../../assets/img/test1.jpg);
        width: 100%;
        height: 400px;
    }
    .tag_img{
        margin-top: 30px;
        margin-left: 700px;
    }
</style>
