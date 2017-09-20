// 这段代码只是为了演示 Promise 的用法，运行在浏览器端
08:00:00.000 function pms1() {
  return new Promise(function (resolve, reject) {
    console.log('执行任务1')
    resolve('执行任务1成功')
  })
}

function pms2() {
  return new Promise(function (resolve, reject) {
    console.log('执行任务2')
    resolve('执行任务2成功')
  })
}

function pms3() {
  return new Promise(function (resolve, reject) {
    console.log('执行任务3')
    resolve('执行任务3成功')
  })
}

pms1()
  .then(function (data) {
    console.log('第一个回调：' + data)
    return pms2()
  })
  .then(function (data) {
    console.log('第二个回调：' + data)
    return pms3()
  })
  .then(function (data) {
    console.log('第三个回调：' + data)
    return '哈哈，终于结束了'
  })
  .then(function (data) {
    console.log(data)
  })

// 执行任务1
// 第一个回调：执行任务1成功
// 执行任务2
// 第二个回调：执行任务2成功
// 执行任务3
// 第三个回调：执行任务3成功
// 还没完