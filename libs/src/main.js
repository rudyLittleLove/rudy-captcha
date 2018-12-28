/* istanbul ignore next */
export default {
  name: "RudyCaptcha",

  props: {
    width: {
      type: Number,
      default: 82
    },
    height: {
      type: Number,
      default: 38
    },
    bgColor: {
      type: String,
      default: '#ffffff'
    },
    captchaCodes: {
      type: String,
      default: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    },
    colors: {
      type: Array,
      default () {
        return ['red', 'orange', 'green', 'blue', 'purple']
      }
    },
    fontFamily: {
      type: String,
      default: '微软雅黑 Arial'
    },
    fontSizeMin: {
      type: Number,
      default: 12
    },
    fontSizeMax: {
      type: Number,
      default: 38
    },
    codeLength: {
      type: Number,
      default: 4
    },
    textFuzzy: {
      type: Number,
      default: 3
    },
    lineColorMax: {
      type: Number,
      default: 200
    },
    lineColorMin: {
      type: Number,
      default: 30
    },
    lineColorOpacity: {
      type: Number,
      default: .2
    },
    lineFuzzy: {
      type: Number,
      default: 3
    },
    lineWidth: {
      type: Number,
      default: 10
    },
    lineNumber: {
      type: Number,
      default: 0
    },
    dotColorMax: {
      type: Number,
      default: 200
    },
    dotColorMin: {
      type: Number,
      default: 30
    },
    dotColorOpacity: {
      type: Number,
      default: .2
    },
    dotFuzzy: {
      type: Number,
      default: 10
    },
    dotNumber: {
      type: Number,
      default: 30
    },
    dotR: {
      type: Number,
      default: 0
    }
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
        onClick={this.updateCode}
        style={{backgroundColor: this.bgColor}}
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
      ctx.shadowColor = this.colors[this.randomNum(0, this.colors.length)];
      ctx.shadowBlur = this.randomNum(0, this.textFuzzy);
      ctx.shadowOffsetY = this.height;
      let fontSize = this.randomNum(this.fontSizeMin, this.fontSizeMax);
      
      ctx.font = `${fontSize}px ${this.fontFamily}`;

      let x = (i + 1) * (this.width / (this.codeLength + 1));
      let diff = (this.height - fontSize - 6) / 2;
      let y = this.height / 2 - this.height;
      y+= this.randomNum(-Math.abs(diff) + 3,Math.abs(diff) + 3);
      var deg = this.randomNum(-45, 45);
      // 修改坐标原点和旋转角度
      ctx.translate(x, y);
      ctx.rotate(deg * Math.PI / 180);
      i % 2 ? ctx.fillText(txt, 0, 0): ctx.strokeText(txt, 0, 0);
      // 恢复坐标原点和旋转角度
      ctx.rotate(-deg * Math.PI / 180);
      ctx.translate(-x, -y);
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
        ctx.shadowOffsetY = this.height;
        ctx.lineWidth = this.randomNum(2, this.lineWidth);

        let startX = this.randomNum(0, this.width);
        let startY = this.randomNum(0, this.height) - this.height;
        ctx.moveTo(startX, startY);

        let endX = this.randomNum(0, this.width);
        let endY = this.randomNum(0, this.height) - this.height;
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
        ctx.shadowOffsetY = this.height;

        ctx.beginPath();
        let x = this.randomNum(0, this.width)
        let y = this.randomNum(0, this.height) - this.height
        ctx.arc(x, y, this.randomNum(1, this.dotR), 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }
};
