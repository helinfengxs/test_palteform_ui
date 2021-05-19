import request from '@/utils/request'
export default {
  getPageInterface(current,limit,interfaceQuery){
    return request({
      url: `/projectservice/interface/pageInterface/${current}/${limit}`,
      method: 'post',
      data: interfaceQuery
    })
  },
  getProject() {
    return request({
      url:"/projectservice/project/findAll",
      method:"get"
    })
  },
  addInterface(interfaceInfo){
    return request({
      url: `/projectservice/interface/addInterface`,
      method: 'post',
      data: interfaceInfo
    })
  }

}
