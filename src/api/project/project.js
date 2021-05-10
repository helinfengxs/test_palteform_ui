import request from '@/utils/request'

export default {
  getProjectPage(current,limit,projectQuery) {
    return request({
      url: `/projectservice/pageProject/${current}/${limit}`,
      method: 'post',
      data: projectQuery
    })
  }
}

