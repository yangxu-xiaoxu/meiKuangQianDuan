<template>
  <div id="app-container" style="padding:30px;">

      <el-form label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="优先级">
              <el-select v-model="dispOrd.priority" clearable placeholder="请选择">
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
<!--          <el-col :span="3">-->
<!--            <el-form-item>-->
<!--              <el-button type="primary" @click="createDialogVisible = false">返回</el-button>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
        </el-row>
      </el-form>

  </div>
</template>

<script>
  import dispord from "@/api/pms/dispord";
  export default {
    data(){
      return{
        dispOrd:{},
        saveBtnDisabled:false,

      }
    },
    created() {
      this.init()
    },
    methods:{

      init(){
        if (this.$route.params&& this.$route.params.id){
          let id=this.$route.params.id
          this.getDisOrdById(id)
        }
      },

      getDisOrdById(dispOrdId){
      dispord.view(dispOrdId)
        .then(response => {
          this.dispOrd = response.data.dispOrd
        })
      },
      saveDispOrd(){
        //禁用保存按钮
        this.saveBtnDisabled = true
        //调用api
        dispord.update(this.dispOrd)
        .then(response => {
          this.$message({
            type:'success',
            message:'保存成功!'
          })
          //跳到list页面
          this.$router.push('/dispord/list')
        })
      }
    }
  }
</script>
