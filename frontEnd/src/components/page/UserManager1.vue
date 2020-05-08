<template>
    <div>
        <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    label="街道名称"
                    width="160">
                <template slot-scope="scope">{{ scope.row.STREET_NAME }}</template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="社区名称"
                    width="160">
                <template slot-scope="scope">{{ scope.row.COMMUNITY_NAME }}</template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="问题来源"
                    width="160">
                <template slot-scope="scope">{{ scope.row.EVENT_SRC_NAME }}</template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="问题类型"
                    width="160">
                <template slot-scope="scope">{{ scope.row.SUB_TYPE_NAME }}</template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="问题性质"
                    width="160">
                <template slot-scope="scope">{{ scope.row.EVENT_PROPERTY_NAME }}</template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="处置部门"
                    width="240">
                <template slot-scope="scope">{{ scope.row.DISPOSE_UNIT_NAME }}</template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
            <el-button @click="toggleSelection(multipleSelection)">标记为以结办事项</el-button>
            <el-button @click="toggleSelection()">取消选择</el-button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import qs from 'qs'
    export default {
        data() {
            return {
                tableData: [],
                multipleSelection: [],

                ID:[],
                listData: []
            }
        },

        methods: {
            toggleSelection(rows) {
                var i;
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
                var result = JSON.parse(JSON.stringify(rows));
                var long = result.length
                for(i=0;i<long;i++)
                {
                    this.ID.push(String(result[i].REC_ID))
                }

                console.log(JSON.stringify(this.ID))
                 let ID_change = JSON.parse(JSON.stringify(this.ID))
                // var ID_change = JSON.stringify(this.ID)
                console.log(ID_change[0])
                console.log(ID_change[1])

                var arrays=new Array();
                //JSON.stringify() 不能转下标非1,2,3这种数字的数组,
                //所以采用新建对象的方式添加数据
                // var products={};
                for(i=0;i<long;i++){
                    var products={};
                    products['ID']=ID_change[i];
                    arrays.push(products);
                }

                // products['ID']=ID_change[0];
                // arrays.push(products);

                console.log(arrays)
                var json_arrays = JSON.stringify(arrays);
                console.log(json_arrays);
                this.$axios(
                    {
                        url: '/api/finishLiveData',
                        method: 'post',
                        // data:
                        //     [{
                        //         ID: ID_change+''
                        //     }]
                        data:arrays,

                    })
                    .then(successResponse => {
                        if (successResponse.data === "success") {
                            console.log("上传成功")
                            this.$message.success('修改成功');
                            location.reload();
                        } else {
                            location.reload()
                            this.$message.error("修改失败")
                        }
                    })
                    .catch(failResponse => {
                    })

                this.ID=[];
            },
            handleSelectionChange(val) {
               // console.log(val)
                this.multipleSelection = val;

            },

            getInfo(){
                this.$axios( {
                    url: '/api/alert1',
                    method:'post',
                })
                    .then((result) => {
                        for(var i = 0;i<result.data.length;i++)
                        {
                            this.tableData.push(result.data[i])
                        }
                    })
            } ,
        },

        mounted() {
            this.getInfo();
        }
    }
</script>
