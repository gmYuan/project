const { Command } = require('commander');
const program = new Command();

const api = require('./index')

program.option('-t, --test', '我是选项测试')

program
  .command('add')
  .description('add a task')
  .action((...args) => {
    const words = args.slice(0, -1).join(' ')
    api.add(words)
  })

  program
  .command('clear')
  .description('clear all tasks')
  .action(() => {
    api.clear()
  })

program.parse(process.argv)

if (process.argv.length === 2) {
  // 说明用户直接运行 node cli.js
  api.showAll()
}
