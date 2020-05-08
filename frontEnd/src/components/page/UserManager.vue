<template>
    <div>
        <el-table
                :data="tableData"
                style="width: 100%"
                border>
            <el-table-column
                    label="账号"
                    width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.userAccount }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="昵称"
                    width="280">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.userName }}</span>
                </template>
            </el-table-column>
<!--            <el-table-column-->
<!--                    label="密码"-->
<!--                    width="270">-->
<!--                <template slot-scope="scope">-->
<!--                    <span style="margin-left: 10px">{{ scope.row.userPriority}}</span>-->
<!--                </template>-->
<!--            </el-table-column>-->
            <el-table-column
                    label="属性"
                    width="150">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.userPriority}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-button type="primary" round class="tag_button" @click="adding_Account1()">增加用户</el-button>

        <el-dialog title="修改名称" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="新密码" :label-width="formLabelWidth">
                    <el-input placeholder="请输入密码" v-model="form.new"show-password></el-input>
                </el-form-item>
                <el-form-item label="再次输入新密码" :label-width="formLabelWidth">
                    <el-input placeholder="再次输入新密码" v-model="form.new_again"show-password></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel_message">取 消</el-button>
                <el-button type="primary" @click="post_message">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="增加账号" :visible.sync="dialogFormVisible1">
            <el-form :model="form">
                <el-form-item label="账号名" :label-width="formLabelWidth">
                    <el-input v-model="new_adding.userAccount" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="昵称" :label-width="formLabelWidth">
                    <el-input v-model="new_adding.userName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model="new_adding.userPassword_new" autocomplete="off" show-password></el-input>
                </el-form-item>
                <el-form-item label="再次确认密码" :label-width="formLabelWidth">
                    <el-input v-model="new_adding.userPassword_again" autocomplete="off" show-password></el-input>
                </el-form-item>
                <el-form-item label="属性" :label-width="formLabelWidth">
                    <el-select v-model="new_adding.userPriority" placeholder="请选择属性">
                        <el-option label="管理员" value="管理员"></el-option>
                        <el-option label="用户" value="用户"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel_message1">取 消</el-button>
                <el-button type="primary" @click="post_message1">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [],

                dialogFormVisible: false,
                dialogFormVisible1: false,
                form: {
                    new:'',
                    new_again:'',
                },
                formLabelWidth: '120px',

                userAccount:'',
                userPassword: '',
                userPriority: '',
                userName: '',

                new_adding:{
                    userAccount:'',
                    userPassword_new:'',
                    userPassword_again:'',
                    userPriority: '',
                    userName:''
                }
            }
        },
        methods: {
            handleEdit(index, row) {
                console.log(index, row);
                var result = JSON.parse(JSON.stringify(row));
                console.log(result);
                this.userAccount=result.userAccount
                this.userPriority=result.userPriority
                console.log(this.userPriority)
                this.dialogFormVisible = true
            },
            handleDelete(index, row) {
                var result = JSON.parse(JSON.stringify(row));
                this.userAccount=result.userAccount
                this.userPriority=result.userPriority
                this.$axios(
                    {
                        url: '/api/delete',
                        method: 'post',
                        data:
                            {
                                account: this.userAccount,
                                priority: this.userPriority,
                            },

                    })
                    .then(successResponse => {
                        if (successResponse.data === "success") {
                            this.$message.success('删除成功');
                            location.reload()
                            this.form.new = '';
                            this.form.new_again = '';
                        } else {
                            this.$message.error("不可操作管理员账号")
                        }
                    })
                    .catch(failResponse => {
                    })
            },

            get_data(){
                this.$axios( {
                    url: '/api/showAll',
                    method:'post',
                })
                    .then((result) => {
                        for(var i = 0;i<result.data.length;i++)
                        {
                            this.tableData.push(result.data[i])
                        }
                    })
            },

            post_message(){
                var per = 1;
                if(this.form.new==''||this.form.new_again==''||(this.form.new!=this.form.new_again))
                {
                    per=0
                }
                if(per == 1) {

                    this.userPassword=this.form.new;
                    console.log(this.userPassword)
                    this.$axios(
                        {
                            url: '/api/adminUpdateUser',
                            method: 'post',
                            data:
                                {

                                    account: this.userAccount,
                                    newPassword: this.userPassword,
                                    priority: this.userPriority,
                                },

                        })
                        .then(successResponse => {
                            if (successResponse.data === "success") {
                                console.log("上传成功")
                                this.$message.success('上传成功');
                                location.reload()
                                this.form.new = '';
                                this.form.new_again = '';
                            } else {
                                location.reload()
                                this.$message.error("不可操作管理员账号")
                                this.form.new = '';
                                this.form.new_again = '';
                            }
                        })
                        .catch(failResponse => {
                        })
                }
                else{
                    this.$message.error("两次输入密码不一致");
                    this.form.new = '';
                    this.form.new_again = '';
                }
            },

            cancel_message(){
                this.dialogFormVisible = false;
                this.form.new='';
                this.form.new_again='';
            },

            adding_Account1(){
                this.dialogFormVisible1 = true
            },

            post_message1(){
                var per = 1;
                if(this.new_adding.userPassword_new==''||this.new_adding.userPassword_again==''||(this.new_adding.userPassword_new!=this.new_adding.userPassword_again))
                {
                    per=2
                    this.new_adding.userPassword_new = '';
                    this.new_adding.userPassword_again="";
                    this.$message.error("密码输入有误")
                }
                if(this.new_adding.userAccount==''||this.new_adding.userName=='')
                {
                    per=3;
                    this.$message.error("账号名或昵称为空")
                }
                if(per == 1) {
                    console.log(this.new_adding.userPassword_new)
                    this.$axios(
                        {
                            url: '/api/add',
                            method: 'post',
                            data:
                                {

                                    userAccount: this.new_adding.userAccount,
                                    userPassword: this.new_adding.userPassword_new,
                                    userPriority: this.new_adding.userPriority,
                                    userName:this.new_adding.userName
                                },

                        })
                        .then(successResponse => {
                            if (successResponse.data === "success") {
                                console.log("成功")
                                this.$message.success('增加成功');
                                location.reload()
                                this.new_adding.userAccount = '';
                                this.new_adding.userPassword_new = '';
                                this.new_adding.userPriority = '';
                                this.new_adding.userName = '';
                                this.new_adding.userPassword_again="";
                            } else {
                                location.reload()
                                this.$message.error("增加失败")
                                this.new_adding.userAccount = '';
                                this.new_adding.userPassword_new = '';
                                this.new_adding.userPriority = '';
                                this.new_adding.userName = '';
                                this.new_adding.userPassword_again="";
                            }
                        })
                        .catch(failResponse => {
                        })
                }
                // else{
                //     this.$message.error("两次输入密码不一致");
                //     this.form.new = '';
                //     this.form.new_again = '';
                // }
            },

            cancel_message1(){
                this.dialogFormVisible1 = false;
                this.new_adding.userAccount = '';
                this.new_adding.userPassword_new = '';
                this.new_adding.userPriority = '';
                this.new_adding.userName = '';
                this.new_adding.userPassword_again="";
            }
        },

        mounted(){
            this.get_data()
        },
    }
</script>

<style>
    .tag_button{
        margin-top: 20px;
    }
</style>

