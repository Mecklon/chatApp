export const normalizeTime = (dateString)=>{

    
    if(!dateString)return""

    const date = dateString.substring(0,19)
    const time = dateString.substring(11,19)

    const year = date.substring(0,4)
    const month = date.substring(5,7)
    const day = date.substring(8,10)

    const hour = time.substring(0,2)
    const minute = time.substring(3,5)
    const second = time.substring(6,8)

    const curr = new Date()

    if(curr.getFullYear()===parseInt(year) && curr.getMonth()+1 === parseInt(month) && curr.getDate() === parseInt(day) && curr.getHours() === parseInt(hour) && curr.getMinutes() === parseInt(minute) ){
      return "now"
    }else if(curr.getFullYear()===parseInt(year) && curr.getMonth()+1 === parseInt(month) && curr.getDate() === parseInt(day)){
      return hour+":"+minute
    }
    return day+"-"+month+"-"+year;
  }