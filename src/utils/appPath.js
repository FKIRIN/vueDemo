export const firstPagePath = (pathList ) =>{
  let outPath = ''
  const findPath = (pathList ,base) => {
    if( pathList[0].children){
      let pathKay = (base ? base : "") +"/"+ pathList[0].path.replace(/^\//, "")
      findPath(pathList[0].children, pathKay)
    } else{
      let pathend = pathList[0].path.replace(/^\//, "")
      let deepPath = base ? base : ""
      // 不知道为啥要用这个表达
      outPath = `${deepPath}/${pathend}`
    }
  }
  findPath(pathList)
  return outPath
}
