import setTitle from "@/utils/set-title"
function afterEachHandler(to, from) {
  let { title } = to.meta
  title || (title = to.name)
  if (title) {
    setTitle(title)
  }
}

export default afterEachHandler

