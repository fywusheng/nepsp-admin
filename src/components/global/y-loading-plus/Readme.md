## 动画加载

### 如何使用
```js
this.$Loading.show()

this.$Loading.hide()
```

### API

| name          | 描述         | 参数      |
| ------------- | ------------|-----------|
| show          | 展示         |  duration |
| hide          | 关闭         |   无       |


### Options

| 参数          | 说明         | 类型   |   默认值         |
| ------------- | ------------| ------ |  ------         |
| duration      | 延迟多少秒自动关闭 当`duration`为0时不自动关闭      | `number` | 0  |