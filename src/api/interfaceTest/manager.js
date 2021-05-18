import request from '@/utils/request'
export default {
  getPageInterface(current,limit,interfaceQuery){
    return request({
      url: `/projectservice/interface/pageInterface/${current}/${limit}`,
      method: 'post',
      data: interfaceQuery
    })
  }
}
