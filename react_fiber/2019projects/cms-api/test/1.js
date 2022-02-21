let list = [
    {id: 1,name: "顶级分类", parent_id: 0},
    {id: 2,name: "子类2", parent_id: 1},
    {id: 3,name: "子类3", parent_id: 1},
    {id: 4,name: "子类4", parent_id: 1},
    {id: 5,name: "子类4子类1", parent_id: 4},
    {id: 6,name: "子类5子类1", parent_id: 5},
]

rootMenus = []
resourceMap = {}
list.forEach(item => {
    item.children = []
    resourceMap[item.id]= item
    if (item.parent_id === 0) {
        rootMenus.push(item)
    } else {
        resourceMap[item.parent_id]&&resourceMap[item.parent_id].children.push(item)
    }
})
console.log(rootMenus)
//console.log(resourceMap)