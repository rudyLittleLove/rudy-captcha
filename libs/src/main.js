/* istanbul ignore next */
export default {
  name: "RudyCaptcha",

  props: {
    width: { // 验证码宽度
      type: Number,
      default: 82
    },
    height: { // 验证码高度
      type: Number,
      default: 38
    },
    bgColor: { // 验证码背景色（设置后可判断计算背景差值去除相似色，不支持透明度色值，支持16进制与rgb色值）
      type: String,
      default: '#ffffff'
    },
    captchaCodes: { // 验证码可选值（随机选取其中一定长度数值，根据codeLength判断长度）
      type: String,
      default: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    },
    colors: { // 在传入数组的颜色中随机选取值赋值给文字（希望背景颜色与文字颜色色差较大时设置此参数），默认为空，取随机颜色值。
      type: Array,
      default () {
        return []
      }
    },
    fontStyle: { // 支持实心字与空心字 both为随机实心或空心
      type: String,
      default: 'both' // 支持 line solid both 默认both
    },
    fontFamily: { // 支持设置字体，受限与canvas支持少量字体，具体支持字体请自行尝试（不支持多个字体候选，谷歌支持多个字体 IE 火狐不支持）
      type: String,
      default: '微软雅黑'
    },
    fontSizeMin: { // 字体随机最小值 不建议设置过小
      type: Number,
      default: 12
    },
    fontSizeMax: { // 字体随机最大值 不建议设置过大
      type: Number,
      default: 38
    },
    codeLength: { // 验证码长度，默认4个
      type: Number,
      default: 4
    },
    textFuzzy: { // 文字随机羽化值，默认最大3px
      type: Number,
      default: 3
    },
    lineColorMax: { // 干扰线最大随机颜色值 最大255
      type: Number,
      default: 200
    },
    lineColorMin: { // 干扰线最小随机颜色值 最小0
      type: Number,
      default: 30
    },
    lineColorOpacity: { // 干扰线透明度 0-1
      type: Number,
      default: .2
    },
    lineFuzzy: { // 干扰线羽化值 同文字羽化值相同
      type: Number,
      default: 3
    },
    lineWidth: { // 干扰线宽度
      type: Number,
      default: 5
    },
    lineNumber: { // 干扰线数量 为0时无干扰线
      type: Number,
      default: 0
    },
    dotColorMax: { // 干扰点最大随机颜色值 最大255
      type: Number,
      default: 200
    },
    dotColorMin: { // 干扰点最小随机颜色值 最小0
      type: Number,
      default: 30
    },
    dotColorOpacity: {// 干扰点透明度0-1
      type: Number,
      default: .2
    },
    dotFuzzy: { // 干扰点最大羽化值
      type: Number,
      default: 10
    },
    dotNumber: { // 干扰点数量 为0无干扰点
      type: Number,
      default: 0
    },
    dotR: { // 干扰点最大半径
      type: Number,
      default: 10
    },
    cursor: { // 点击刷新鼠标类型
      type: String,
      default: 'pointer'
    },
    clickFresh: Boolean // 是否点击验证码刷新
  },

  data() {
    return {
      captchaCode: ''
    };
  },

  render(h) {
    const style = {
      'display': 'inline-block',
      'font-size': 0
    }
    const canvas = (
      <canvas
        ref="rudyCaptcha"
        width={this.width}
        height={this.height}
        onClick={this.clickFresh && this.updateCode}
        style={{backgroundColor: this.bgColor, cursor: this.clickFresh && this.cursor}}
      ></canvas>
    )
    return h(
      "div",
      {
        style: style
      },
      [canvas]
    );
  },

  mounted() {
    // 'rgba(255,255,255,0)'.replace(/rgb\(|\)|rgba\(/g,'').split(',')
    // '#ffeedd'.substr(5,2)
    this.ctx = this.$refs.rudyCaptcha.getContext('2d');
    this.updateCode();
  },

  methods: {
    updateCode () {
      this.refreshCode ();
      this.$refs.rudyCaptcha.width = this.width;
      this.$refs.rudyCaptcha.height = this.height;
      // this.ctx.fillStyle = this.bgColor;
      // this.ctx.fillRect(0, 0, this.width, this.height);

      this.drawLine();
      this.drawDot();
      this.drawImg();
      
    },
    refreshCode () {
      this.captchaCode = "";
      for (let i = 0; i < this.codeLength; i++) {
        this.captchaCode += this.captchaCodes[this.randomNum(0, this.captchaCodes.length)]
      }
    },
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    randomRgbColor (min, max) {
      let r = this.randomNum(min, max)
      let g = this.randomNum(min, max)
      let b = this.randomNum(min, max)
      return `rgb(${r},${g},${b})`
    },
    randomRgbaColor (min, max, opacity) {
      let r = this.randomNum(min, max)
      let g = this.randomNum(min, max)
      let b = this.randomNum(min, max)
      return `rgb(${r},${g},${b}, ${opacity})`
    },
    drawImg () {
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.lineWidth = 1;
      for(let i = 0; i < this.codeLength; i++){
        this.drawText(this.captchaCode[i], i);
      }

    },
    drawText (txt, i) {
      let ctx = this.ctx;
      ctx.shadowColor = this.calcColor();
      ctx.shadowBlur = this.randomNum(0, this.textFuzzy);
      ctx.shadowOffsetY = this.height * 2;
      let fontSize = this.randomNum(this.fontSizeMin, this.fontSizeMax);
      
      ctx.font = `${fontSize}px ${this.fontFamily}`;

      let x = (i + 1) * (this.width / (this.codeLength + 1));
      let diff = (this.height - fontSize - 6) / 2;
      let y = this.height / 2 - this.height * 2;
      y+= this.randomNum(-Math.abs(diff) + 3,Math.abs(diff) + 3);
      var deg = this.randomNum(-45, 45);
      // 修改坐标原点和旋转角度
      ctx.translate(x, y);
      ctx.rotate(deg * Math.PI / 180);

      // 实心或空心字
      switch(this.fontStyle){
        // case 'both':
        //   i % 2 ? ctx.fillText(txt, 0, 0): ctx.strokeText(txt, 0, 0);
        //   break;
        case 'line':
          ctx.strokeText(txt, 0, 0);
          break;
        case 'solid':
          ctx.fillText(txt, 0, 0);
          break;
        default:
          i % 2 ? ctx.fillText(txt, 0, 0): ctx.strokeText(txt, 0, 0);
      }
      // 恢复坐标原点和旋转角度
      ctx.rotate(-deg * Math.PI / 180);
      ctx.translate(-x, -y);
    },
    calcColor () {
      let color = this.randomRgbColor(0, 255);
      let colorNum = 0;
      if(this.colors.length){
        colorNum = 2;
        color = this.colors[this.randomNum(0, this.colors.length)];
      } else {
        let colorVals = [];
        switch(this.bgColor.trim().length){
          case 4:
            let one = this.bgColor.substr(1,1);
            colorVals.push(parseInt(one += one, 16));
            let two = this.bgColor.substr(2,1);
            colorVals.push(parseInt(two += two, 16));
            let thr = this.bgColor.substr(3,1);
            colorVals.push(parseInt(thr += thr, 16));
            break;
          case 7:
            colorVals.push(parseInt(this.bgColor.substr(1,2), 16));
            colorVals.push(parseInt(this.bgColor.substr(3,2), 16));
            colorVals.push(parseInt(this.bgColor.substr(5,2), 16));
            break;
          case 11:
            colorVals = [1000,1000, 1000];
          default:
            colorVals = this.bgColor.replace(/rgb\(|\)|rgba\(/g,'').split(',');
        }
        let textColorVals = color.replace(/rgb\(|\)|rgba\(/g,'').split(',');

        textColorVals.map((item, i) => {
          if(Math.abs(item - colorVals[i]) > 80){
            colorNum++
          }
        })
      }

      if(colorNum > 1){
        return color;
      } else {
        return this.calcColor();
      }
    },
    valid (code) {
      return code.toLocaleLowerCase() === this.captchaCode.toLocaleLowerCase();
    },
    drawLine () {
      // 绘制干扰线
      let ctx = this.ctx
      // debugger;
      for (let i = 0; i < this.lineNumber; i++) {
        ctx.beginPath()

        ctx.shadowColor = this.randomRgbaColor(this.lineColorMin, this.lineColorMax, this.lineColorOpacity);
        ctx.shadowBlur = this.randomNum(0, this.lineFuzzy);
        ctx.shadowOffsetY = this.height * 2;
        ctx.lineWidth = this.randomNum(2, this.lineWidth);

        let startX = this.randomNum(0, this.width);
        let startY = this.randomNum(0, this.height) - this.height * 2;
        ctx.moveTo(startX, startY);

        let endX = this.randomNum(0, this.width);
        let endY = this.randomNum(0, this.height) - this.height * 2;
        ctx.lineTo(endX, endY);

        ctx.stroke()
      }
    },
    
    drawDot () {
      let ctx = this.ctx
      // 绘制干扰点
      for (let i = 0; i < this.dotNumber; i++) {
        ctx.shadowColor = this.randomRgbaColor(this.dotColorMin, this.dotColorMax, this.dotColorOpacity);
        ctx.shadowBlur = this.randomNum(0, this.dotFuzzy);
        ctx.shadowOffsetY = this.height * 2;

        ctx.beginPath();
        let x = this.randomNum(0, this.width)
        let y = this.randomNum(0, this.height) - this.height * 2
        ctx.arc(x, y, this.randomNum(1, this.dotR), 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }
};
