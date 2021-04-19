<template>
  <div id="app-container" style="padding:30px;">

    <!-- 查询表单 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="dispOrdQuery.orderName" placeholder="指令名称" />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dispOrdQuery.beginDate"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="dispOrdQuery.endDate"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-button type="primary" @click="query()">查询</el-button>
      <el-button type="primary" @click="resetData()">重置</el-button>
    </el-form>



    <el-table :data="dispOrdList" border fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (pageNo - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="orderName" label="指令名称" width="80" />
      <el-table-column label="优先级">
        <template slot-scope="scope">
          {{
          scope.row.proproty === 1 ? '一级' :
          scope.row.proproty === 2 ? '二级' :
          scope.row.proproty === 3 ? '三级' : '四级'
          }}
        </template>
      </el-table-column>
      <el-table-column label="专业类型">
        <template slot-scope="scope">
          {{
          scope.row.rtcw === 1 ? '生产调度指令' :
          scope.row.rtcw === 2 ? '安全调度指令' :
          scope.row.rtcw === 3 ? '开工调度指令' : '培训调度指令'
          }}
        </template>
      </el-table-column>
      <el-table-column prop="orderCbd" label="指令描述" />
    </el-table>

    <el-pagination
      :page-size="pageSize"
      :current-page="pageNo"
      :total="total"
      :pager-count="11"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="query">
    </el-pagination>


    <el-row>
      <el-col :span="2" :offset="8">
        <el-button type="primary" @click="toCreateDispOrd()">创建</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="toUpdateDispOrd()" :disabled="this.multipleSelection.length === 0 || this.multipleSelection.length > 1">修改</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="deleteDispOrd()" :disabled="this.multipleSelection.length === 0 || this.multipleSelection.length > 1">删除</el-button>
      </el-col>
    </el-row>


    <!-- 创建对话框 -->
    <el-dialog
      title="增加集团调度指令信息"
      :visible.sync="createDialogVisible"
      width="50%">
      <el-form label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="优先级">
              <el-select v-model="dispOrd.proproty" clearable placeholder="请选择">
                <el-option :value="1" label="一级"/>
                <el-option :value="2" label="二级"/>
                <el-option :value="3" label="三级"/>
                <el-option :value="4" label="四级"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业类型">
              <el-select v-model="dispOrd.rtcw" clearable placeholder="请选择">
                <el-option :value="1" label="生产调度指令"/>
                <el-option :value="2" label="安全调度指令"/>
                <el-option :value="3" label="开工调度指令"/>
                <el-option :value="4" label="培训调度指令"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="指令名称">
              <el-input v-model="dispOrd.orderName"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="指令描述">
              <el-input v-model="dispOrd.orderCbd" :rows="10" type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" :offset="5">
            <el-form-item>
              <el-button :disabled="saveBtnDisabled" type="primary" @click="saveDispOrd()">保存</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-button type="primary" @click="createDialogVisible = false">返回</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import dispord from "@/api/pms/dispord";
  export default {
    data(){  //定义变量初始值
      return{
        pageNo: 1,   //页码
        pageSize: 5, //每页最大条数
        total:0,     //总条数
        dispOrdQuery: {},   //查询条件封装对象
        dispOrdList:[],  //数组列表
        multipleSelection:[],  //记录表格复选框选中的id
        createDialogVisible:false, //是否弹出对话框
        dispOrd:{},//添加的对象
        saveBtnDisabled:false
      }
    },
    //页面未渲染之前调用的方法
    created() {
      this.query()
    },
    methods: {
      //自定义函数
      query(pageNo = 1) {
        this.pageNo=pageNo
        dispord.findPage(this.dispOrdQuery, this.pageNo, this.pageSize)
          .then(response => {
            this.dispOrdList = response.data.items
            this.total = response.data.total
          })
      },
      resetData() { // ## 清空方法
        // ## 清空所有值
        this.dispOrdQuery = {}
        // ## 查询所有数据
        this.query()
      },
      handleSelectionChange(val) { // ## 复选框改变时触发该事件
        this.multipleSelection = val

      },
      toCreateDispOrd(){
        //创建
        //打开窗口
        this.createDialogVisible=true,
          //接触按钮的禁用
          this.saveBtnDisabled=false,
          //清空数据
          this.dispOrd={}
      },
      toUpdateDispOrd(){
        //跳转修改窗口
        // ## 获取所有选中行的id组成的字符串，以逗号分隔
        var ids = this.multipleSelection.map(item => item.id).join()
        // ## 跳转
        this.$router.push('/dispord/update/' + ids)

      },
      deleteDispOrd(){

        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var ids = this.multipleSelection.map(item => item.id).join()
          dispord.delete(ids)
            .then(respone =>{
              this.$message({
                type:'success',
                message: '删除成功!'
              })
              this.query()
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });



        // ## 获取所有选中行的id组成的字符串，以逗号分隔

      },
      saveDispOrd(){
        //保存新增数据
        this.saveBtnDisabled=true
        dispord.addDispOrd(this.dispOrd)
        .then(response => {
          this.$message({
            type:'success',
            message:'保存成功'
          }),
            this.createDialogVisible=false,
            this.query()
        })
      }

    }

  }
</script>
