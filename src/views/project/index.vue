<template>
  <div class="app-container">
    admin
  </div>
</template>


<script>
  import project from '@/api/project/project'
  export default {
    data(){
      return{
        list:null,
        page:1,
        limit:10,
        total:0,
        projectQuery:{}
      }
    },
    created() {
      this.getList()
    },
    methods:{
      /**
       * 查询项目列表信息
       */
      getList(){
        project.getProjectPage(this.page,this.limit,this.projectQuery)
        .then(response => {
          console.log(response.data.rows)
        })
        .catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>

