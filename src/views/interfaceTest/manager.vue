<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="1.5"><el-button  @click="openDialog" type="primary" size="small">新增接口</el-button></el-col>
      <el-col :span="1.5"><el-button type="danger" size="small" @click="removeSelect">批量删除</el-button></el-col>
      <el-col :span="1.5"><el-button type="success" size="small" @click="importExcel">批量导入</el-button></el-col>
    </el-row>
    <!--  条件查询-->
    <el-form :inline="true" :model="formInline" class="demo-form-inline" style="margin-top: 20px">
      <el-form-item label="接口名称">
        <el-input maxlength="20" v-model="formInline.interfaceName" placeholder="接口名称" size="mini" style="width: 120px"></el-input>
      </el-form-item>
      <el-form-item label="所属项目" >
        <el-select
          v-model="formInline.projectId"
          placeholder="请选择"
          size="mini"
          style="width: 120px"
          :clearable="true"
          >
          <el-option
            v-for="p in projectList"
            :key="p.id"
            :label="p.title"
            :value="p.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="开始时间">

        <el-date-picker
          v-model="formInline.begin"
          type="datetime"
          placeholder="选择日期时间"
          size="mini"
          style="width: 180px"
          clearable
          :editable="false"
          value-format="yyyy-MM-dd HH:mm:ss">
        >

        </el-date-picker>
      </el-form-item>

      <el-form-item label="结束时间">

        <el-date-picker
          v-model="formInline.end"
          type="datetime"
          placeholder="选择日期时间"
          size="mini"
          style="width: 180px"
          clearable
          :editable="false"
          value-format="yyyy-MM-dd HH:mm:ss"
        >

        </el-date-picker>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit" size="mini">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="resetData"  size="mini" >清空条件</el-button>
      </el-form-item>
    </el-form>
    <!--新增或修改接口信息-->
    <el-dialog title=""  :visible.sync="dialogFormVisible" :close-on-click-modal="false" @close="celarData" width="600px"  >



      <div slot="title" class="header-title">
        <span v-show="daligName" class="title-name">{{daligName}}</span>
      </div>


      <el-form   :model="interfaceData" :rules="rules" ref="interfaceData"  label-width="80px">
        <el-form-item label="接口名称" prop="interfaceName">
          <el-input style="width: 250px"  v-model="interfaceData.interfaceName" placeholder="接口名称" auto-complete="off" size="small" :show-word-limit="true" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="接口地址"  prop="interfaceAddress">
          <el-input style="width: 250px"  v-model="interfaceData.interfaceAddress" placeholder="接口地址" auto-complete="off" size="small" :show-word-limit="true" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item label="所属项目"    prop="projectId">
          <el-select style="width: 250px" v-model="interfaceData.projectId" placeholder="请选择项目" size="small"  :clearable="true" :disabled="isDisabled">
            <el-option
              v-for="p in projectList"
              :key="p.id"
              :label="p.title"
              :value="p.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitInfo(interfaceId)" >确 定</el-button>
      </div>
    </el-dialog>
<!--    列表展示-->
    <template>
      <el-table
        :data="items"
        element-loading-text="数据加载中"
        border
        highlight-current-row
        @selection-change="handleSelectionChange"
        :cell-style="{background:'#fff'}"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="序号"
          width="50"
          align="center">
          <template slot-scope="scope">
            {{ (page-1)* limit+scope.$index+1 }}
          </template>
        </el-table-column>

        <el-table-column prop="interfaceName" label="接口名称" width="150" />

<!--        <el-table-column label="项目测试类型" width="80">-->
<!--          <template slot-scope="scop" >-->
<!--            <div v-if="scop.row.testType === '0'">UI测试</div>-->
<!--            <div v-if="scop.row.testType === '1'">接口测试</div>-->
<!--            <div v-if="scop.row.testType === '2'">性能测试</div>-->
<!--            <div v-if="scop.row.testType === '3'">app测试</div>-->

<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column  prop="interfaceAddress" label="接口地址" width="150"/>
        <el-table-column  prop="interfaceCases" label="关联用例数" width="80"/>
        <el-table-column  prop="projectName" label="所属项目" width="150"/>
        <el-table-column prop="gmtCreate" label="创建时间" width="150"/>
        <el-table-column prop="gmtModified" label="更新时间" width="150" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="eidtor(scope.row.id)">修改</el-button>

            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />
  </div>
</template>
<script>
import i from '@/api/interfaceTest/manager'
export default {
  data() {
    var checkInterfaceName = (rule, value, callback) =>{

      if(!value){
        callback(new Error('接口名称未填入'));
      }
      else {
        callback();
      }
    }
    var checkInterfaceAddr = (rule, value, callback)=>{
      if(!value){
        callback(new Error("接口地址未填入"))
      }
      else {
        callback()
      }
    }
    var checkProjectId = (rule, value, callback)=>{
      if(!value){
        callback(new Error("所属项目未选择"))
      }else {
        callback()
      }
    }
    return {
      total:0,
      items: [],
      interfaceQuery:{

      },
      page:1,
      limit:10,
      interfaceData:{

      },
      formInline:{
        begin:null,
        end:null,
        interfaceName:null,
        projectId:null
      },
      projectList:[],
      dialogFormVisible:false,
      daligName:"新增接口",
      interfaceId:"",
      rules:{
        interfaceName: [
          { validator:checkInterfaceName ,trigger: 'blur' },
        ],
        interfaceAddress:[
          {validator:checkInterfaceAddr ,trigger: 'blur'},
          {pattern:/^\/(\w+\/?)+$/,message: '格式错误；例如：/test', trigger: 'blur'}
        ],
        projectId:[
          {validator:checkProjectId,trigger:'change'}
        ]
      },
      isDisabled:false
    }
  },
  created() {
    this.getList()
    this.getProject()
  },
  methods: {

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getList() {
      i.getPageInterface(this.page,this.limit,this.formInline)
      .then(response =>{
        this.page = response.data.current
        this.items = response.data.items
        this.total = response.data.total
      })
      .catch(error => {
        console.log(error)
      })
    },
  fetchData(val){
    this.page =val
    this.getList(this.page,this.limit,this.formInline)
  },
    //新增按钮
    openDialog(){
      this.projectName = "新增接口"
      this.dialogFormVisible = true
    },
    //批量删除
    removeSelect(){

    },
    //导入Excel
    importExcel(){

    },
    //获取所有项目方法
    getProject(){
      i.getProject()
      .then(response =>{

        this.projectList = response.data.items
      })
    },
   //条件查询
    onSubmit(){
      this.getList()
    },
    //清空条件
    resetData(){
      this.formInline = {}
      this.getList()
      this.formInline = {}
    },
    commitInfo(id){
      if(id===""){
        this.$refs.interfaceData.validate((valid) =>{
          if(valid){
            this.$confirm('是否确认修改？', '确认修改', {
              distinguishCancelAndClose: true,
              confirmButtonText: '确认',
              cancelButtonText: '取消'
            })
              .then(()=>{
                this.addInterfaceInfo()
              })
              .catch(()=>{
                this.$message({
                  type: 'info',
                  message: "取消修改"
                })
              })
          }else {
            this.$message.error('接口信息填写不完整');
          }

        })
      }else {
        console.log("222222222222222")
      }
    },
    //发生添加接口请求
    addInterfaceInfo(){
      i.addInterface(this.interfaceData)
      .then(response =>{
        if(response.success){
          this.dialogFormVisible=false
          this.formInline = {}
          this.interfaceData ={}
          this.$message({
            type: 'success',
            message: '添加接口成功'
          });
          this.getList()
        }else {
          this.$message({
            type: 'error',
            message: '添加接口失败'
          });
        }
      })
    },
    celarData(){
      this.$refs.interfaceData.resetFields();
      this.getList()
      this.isDisabled = false
      this.interfaceId =""
      this.formInline = {}
      this.interfaceId = ""
    },
    //修改按钮方法
    eidtor(id){
      this.daligName = "修改接口"
      this.isDisabled = true
      this.dialogFormVisible = true
      this.interfaceId = id
      console.log(id)
    },
    //删除按钮方法
    removeDataById(id){
      console.log(id)
    }

  }
}
</script>



