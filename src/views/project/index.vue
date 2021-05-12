<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="2.5"><el-button  @click="openDialog" type="primary" size="small">新增项目</el-button></el-col>
      <el-col :span="1"><el-button type="danger" size="small" @click="removeSelect">批量删除</el-button></el-col>
    </el-row>

<!--新增项目-->
    <el-dialog title=""  :visible.sync="dialogFormVisible" :close-on-click-modal="false" @close="celarData" width="600px"  >



      <div slot="title" class="header-title">
        <span v-show="projectName" class="title-name">{{projectName}}</span>
      </div>


      <el-form   :model="projects" :rules="rules" ref="projects"  label-width="80px">
        <el-form-item label="项目名称" :required="true" prop="title">
          <el-input style="width: 250px"  v-model="projects.title" placeholder="项目名称" auto-complete="off" size="small" :show-word-limit="true" maxlength="20"></el-input>
        </el-form-item>


        <el-form-item label="测试类型"   :required="true" prop="testType">
          <el-select style="width: 250px" v-model="projects.testType" placeholder="请选择测试类型" size="small"  :clearable="true" :disabled="isDisabled">
            <el-option label="UI测试" value="0"></el-option>
            <el-option label="接口测试" value="1"></el-option>
            <el-option label="性能测试" value="2"></el-option>
            <el-option label="app测试" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目描述"  >
          <el-input
            type="textarea"
            placeholder="请输入项目描述"
            v-model="projects.describtion"
            maxlength="50"
            style="width: 250px"
            size="small"
          >

          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitProjectInfo(projectId)" >确 定</el-button>
      </div>
    </el-dialog>




<!--  条件查询-->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="项目名称">
        <el-input maxlength="20" v-model="formInline.title" placeholder="项目名称" size="mini" style="width: 120px"></el-input>
      </el-form-item>
      <el-form-item label="测试类型" >
        <el-select v-model="formInline.testType" placeholder="测试类型" size="mini"  style="width: 120px" >
          <el-option label="UI测试" value=0></el-option>
          <el-option label="接口测试" value=1></el-option>
          <el-option label="性能测试" value=2></el-option>
          <el-option label="app测试" value=3></el-option>
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
    <!-- 项目列表展示 -->
    <el-table
      :data="items"
      element-loading-text="数据加载中"

      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
      :cell-style="{background:'#fff'}"
      :border="true"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page-1)* limit+scope.$index+1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="项目名称" width="180" />

      <el-table-column label="项目测试类型" width="80">
      <template slot-scope="scop" >
        <div v-if="scop.row.testType === '0'">UI测试</div>
        <div v-if="scop.row.testType === '1'">接口测试</div>
        <div v-if="scop.row.testType === '2'">性能测试</div>
        <div v-if="scop.row.testType === '3'">app测试</div>

      </template>
      </el-table-column>
      <el-table-column prop="interfaceCount" label="接口总数" width="80"/>

      <el-table-column prop="caseCount" label="用例总数" width="80"/>

      <el-table-column prop="gmtCreate" label="创建时间" width="160"/>

      <el-table-column prop="gmtModified" label="更新时间" width="160" />
      <el-table-column prop="describtion" label="描述" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="eidtor(scope.row.id)">修改</el-button>

          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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
import project from '@/api/project/project'
export default {
  data() {
    var checkTilte = (rule, value, callback)=> {
        if(!value){
          callback(new Error('项目名称未填入'));
        }
        else if(value.trim().length <1){
          callback(new Error("项目名称未填入"))
        }else {
          project.findProjectByTitle(value)
          .then(respones =>{
            if(respones.data.size > 0){
              callback(new Error("项目名称重复"))
            }else {
              callback()
            }
          })
          .catch(error => {
            callback(new Error("项目名称重复"))
          })
        }


    }
    var checkTestType = (rule, value, callback) =>{
      if(!value){
        return callback(new Error('测试类型未选择'));
      }else {
        return callback()
      }
    }
    return {
      projectName:"",
      timer:null,
      projectId:"",
      isDisabled : false,
      formLabelWidth: '120px',
      dialogFormVisible: false,
      total:0,
      page:1,
      limit:10,
      items:null,
      formInline: {
        title: null,
        testType: null,
        begin:null,
        end:null,
      },
      projects:{
        id:null,
        title:null,
        testType: null,
        describtion:null
      },
      eidtorProject:{
        id:null,
        title:null,
        testType: "",
        describtion:null
      },
      rules:{
        title: [
          { validator:checkTilte ,trigger: 'blur' },
        ],
        testType:[
          { validator:checkTestType, trigger: 'change' },
        ]
      }
    }
  },
  created() {
    this.getList()

  },
  methods: {

    /**
     * 查询项目列表信息
     */
    getList(){
      project.getProjectPage(this.page,this.limit,this.formInline)
        .then(response => {
          this.page = response.data.current
          this.items = response.data.items
          this.total = response.data.total
        })
        .catch(error => {
          console.log(error)
        })
    },

    /**
     * 全选
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    /**
     * 清空查询条件
     */
    resetData(){


      this.getList(this.page,this.limit,this.formInline)

      this.formInline ={}

    },
    fetchData(val){
      this.page =val
      this.getList(this.page,this.limit,this.formInline)
    },
    onSubmit(){
      if(JSON.stringify(this.formInline) !== {}){
        this.getList(this.page,this.limit,this.formInline)
      }

    },
    openDialog(){
      this.dialogFormVisible = true
      this.projectName = "添加项目"
    },
    /**
     * 添加项目接口
     */
    addProject(projects){
      project.addProject(projects)
      .then(respones => {
        if(respones.success){
          this.dialogFormVisible=false
          this.formInline = {}
          this.getList()
          this.$message({
            type: 'success',
            message: '添加项目成功'
          });
        }else {
          this.dialogFormVisible=false
          this.$message({
            type: 'fialed',
            message: '添加项目失败'
          });
        }

      })
      .catch(error => {
        console.log(error)
      })
    },
    /**
     *提交dialog表单
     */
    commitProjectInfo(id){
      if(id === ""){
        this.$refs.projects.validate((valid) =>{
          if(valid){
            this.$confirm('是否确认添加？', '确认信息', {
              distinguishCancelAndClose: true,
              confirmButtonText: '确认',
              cancelButtonText: '取消'
            })
              .then(() => {
                this.addProject(this.projects)
              })
              .catch(action => {
                this.$message({
                  type: 'info',
                  message: "取消添加"
                })
              });
          }else {
            this.$message.error('项目信息填写不完整');
          }
        })
      }else {
        this.$refs.projects.validate((valid) =>{
          if(valid){
            this.$confirm('是否确认修改？', '确认修改', {
              distinguishCancelAndClose: true,
              confirmButtonText: '确认',
              cancelButtonText: '取消'
            })
            .then(()=>{
              this.updateProject()

            })
            .catch(()=>{
              this.$message({
                type: 'info',
                message: "取消修改"
              })
            })
          }

        })
      }

    },
    /**
     *清除dialog框数据
     */
    celarData(){
      this.projects = {}
      this.formInline = {}
      this.getList()
      this.$refs.projects.resetFields();
      this.isDisabled = false
      this.projectId =""
    },
    /**
     * 单个删除
     * @param id
     */
    removeProjectId(id){
        project.removeProjectId(id)
      .then(respones =>{
        if(respones.success){
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }else {
          this.$message({
            type: 'warning',
            message: '删除失败!'
          });
        }
      })
      .catch(error => {
        this.$message({
          type: 'error',
          message: error
        });
      })
    },
    removeDataById(id){
      this.$confirm('此操作将永久删除项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeProjectId(id)

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    /**
     * 批量删除
     */
    removeSelect(){
      var ids = [];
      this.multipleSelection.forEach(selectltem => {
        ids.push(selectltem.id)
      })
      this.$confirm('删除已选中的项目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delPartProject(ids)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
    delPartProject(ids){
      project.deletePartProject(ids)
        .then(response =>{
          this.getList()
          if(response.success){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }else{
            this.$message({
              type: 'error',
              message: '删除失败!'
            });
          }
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error +'删除失败'
          });
        })
    },
    /**
     * 修改项目
     * @param id
     */
    eidtor(id){
      this.projectName = "修改项目"
      this.isDisabled = true
      this.projectId = id
      this.findProject()

      this.dialogFormVisible = true



    },
    findProject(){
      project.findProjectById(this.projectId)
      .then(response =>{
        this.projects = response.data.items

      })
      .catch(error => {
        console.log(error)
      })
    },
    updateProject(){
      project.updatePorjectById(this.projects)
        .then(response =>{
          if(response.success){
            this.dialogFormVisible = false
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          }else {
            this.$message({
              type: 'error',
              message: '修改失败!'
            });
          }
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '修改失败'+error
          });
        })
    }

  }

}



</script>

