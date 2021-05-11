<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="2.5"><el-button  @click="dialogFormVisible = true" type="primary" size="small">新增项目</el-button></el-col>
      <el-col :span="1"><el-button type="danger" size="small">批量删除</el-button></el-col>
    </el-row>

<!--新增项目-->
    <el-dialog title="新增项目"  :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form   :model="projects" :rules="rules"  label-width="80px">
        <el-form-item label="项目名称" :required="true" prop="title">
          <el-input style="width: 250px"  v-model="projects.title" placeholder="项目名称" autocomplete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="测试类型"   :required="true">
          <el-select style="width: 250px" v-model="projects.testType" placeholder="请选择活动区域" size="small" >
            <el-option label="UI测试" value="0"></el-option>
            <el-option label="接口测试" value="1"></el-option>
            <el-option label="性能测试" value="2"></el-option>
            <el-option label="app测试" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目描述" :required="true" >
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="projects.describtion"
            maxlength="30"
            style="width: 250px"
            size="small"
          >

          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitProjectInfo" >确 定</el-button>
      </div>
    </el-dialog>





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
    <!-- 表格 -->
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
        <div v-if="scop.row.testType === 0">UI测试</div>
        <div v-if="scop.row.testType === 1">接口测试</div>
        <div v-if="scop.row.testType === 2">性能测试</div>
        <div v-if="scop.row.testType === 3">app测试</div>

      </template>
      </el-table-column>
      <el-table-column prop="interfaceCount" label="接口总数" width="80"/>

      <el-table-column prop="caseCount" label="用例总数" width="80"/>

      <el-table-column prop="gmtCreate" label="创建时间" width="160"/>

      <el-table-column prop="gmtModified" label="更新时间" width="160" />
      <el-table-column prop="describtion" label="描述" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
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
    return {
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
        title:null,
        testType: null,
        describtion:null
      },
      rules:{
        title: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
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
    addProject(projects){
      project.addProject(projects)
      .then(respones => {
        console.log(respones)
        this.projects={}
      })
      .catch(error => {
        console.log(error)
      })
    },
    commitProjectInfo(){
      this.$confirm('是否确认添加？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '添加项目成功'
          });
        })
        .catch(action => {
          this.$message({
            type: 'info',
            message: action === 'cancel'
              ? '取消添加并离开页面'
              : '停留在当前页面'
          })
        });
    }

  }
}



</script>

