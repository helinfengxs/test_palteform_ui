import request from '@/utils/request'

export default {
  getProjectPage(current,limit,projectQuery) {
    return request({
      url: `/projectservice/pageProject/${current}/${limit}`,
      method: 'post',
      data: projectQuery
    })
  },
  addProject(project){
    return request({
      url: `/projectservice/addProject/`,
      method: 'post',
      data: project
    })
  },
  removeProjectId(id){
    return request({
      url: `/projectservice/${id}`,
      method: 'delete',
    })
  },
  findProjectByTitle(title){
    return request({
      url: `/projectservice/findProjectByTitle`,
      method: 'get',
      params: {"title":title}
    })
  },
  deletePartProject(ids){
    return request({
      url: `/projectservice/deletePartProject`,
      method: 'delete',
      data:ids
    })
  }
}


