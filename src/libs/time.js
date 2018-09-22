import moment from 'moment'

moment.locale('zh_CN')

export const timeSince = (date) => {
  // moment.tz.setDefault("Asia/Shanghai");
  return moment(date).calendar()
}
