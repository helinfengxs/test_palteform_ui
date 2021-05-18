import request from '@/utils/request'

export default {
  getProjectPage(current,limit,projectQuery) {
    return request({
      url: `/projectservice/project/pageProject/${current}/${limit}`,
      method: 'post',
      data: projectQuery
    })
  },
  addProject(project){
    return request({
      url: `/projectservice/project/addProject/`,
      method: 'post',
      data: project
    })
  },
  removeProjectId(id){
    return request({
      url: `/projectservice/project/${id}`,
      method: 'delete',
    })
  },
  findProjectByTitle(title){
    return request({
      url: `/projectservice/project/findProjectByTitle`,
      method: 'get',
      params: {"title":title}
    })
  },
  deletePartProject(ids){
    return request({
      url: `/projectservice/project/deletePartProject`,
      method: 'delete',
      data:ids
    })
  },
  findProjectById(id){
    return request({
      url: `/projectservice/project/getProject/${id}/`,
      method: 'get',
    })
  },
  updatePorjectById(project){
    return request({
      url: `/projectservice/project/updateProject/`,
      method: 'post',
      data:project
    })
  }
}


