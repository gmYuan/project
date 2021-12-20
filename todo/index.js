const db = require('./db')
const inquirer = require('inquirer')

module.exports.add = async (title) => {
  // 读取文件
  const list = await db.read()
  // 追加新的内容
  list.push({ title, done: false })
  // 存储任务到文件
  await db.write(list)
}

// 清空任务
module.exports.clear = async () => {
  await db.write([])
}

// 展示所有任务及选项
module.exports.showAll = async () => {
  // 读取之前的任务
  const list = await db.read()
  // 打印之前的任务
  printTasks(list)
}

function printTasks(list) {
  // 创建列表项
  let choices = list.map((task, index) => {
    return { name: `${task.done ? '[x]' : '[_]'} ${index + 1}-${task.title}`, value: index.toString() }
  })
  choices = [
    { name: '退出', value: '-1' },
    ...choices,
    { name: '+ 创建任务', value: '-2' }
  ]

  inquirer.prompt({
      type: 'list',
      name: 'index',
      message: '请选择你想操作的任务',
      choices,
    }).then((answer) => {
      const index = +answer.index
      if (index >= 0) {
        askForAction(list, index)
      } else if (index === -2) {
        askForCreateTask(list)
      }
    })
}

function askForCreateTask(list) {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: '输入任务标题'
  }).then(answer => {
    list.push({
      title: answer.title,
      done: false
    })
    db.write(list)
  })
}

function askForAction(list, index) {
  const choices = [
    {name: '退出', value: 'quit'},
    {name: '已完成', value: 'markAsDone'},
    {name: '未完成', value: 'markAsUndone'},
    {name: '改标题', value: 'updateTitle'},
    {name: '删除', value: 'remove'},
  ]
  const actions = {markAsUndone, markAsDone, remove, updateTitle}

  inquirer.prompt({
    type: 'list',
    name: 'action',
    message: '请选择操作',
    choices,
  }).then((answer2) => {
    const action = actions[answer2.action]
    action && action(list, index)
  })
}

function markAsDone(list, index) {
  list[index].done = true
  db.write(list)
}

function markAsUndone(list, index) {
  list[index].done = false
  db.write(list)
}

function updateTitle(list, index) {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: '新的标题',
    default: list[index].title
  }).then(answer => {
    list[index].title = answer.title
    db.write(list)
  })
}

function remove(list, index) {
  list.splice(index, 1)
  db.write(list)
}
