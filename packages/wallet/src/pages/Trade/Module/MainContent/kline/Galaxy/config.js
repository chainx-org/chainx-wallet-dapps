export default {
  backgroundColor: '#FFF',
  marginTop: 30,
  marginBottom: 110,
  volumeCanvasHeight: 80,
  studyCanvasHeight: 0,
  candle: {
    width: 5, // 每根蜡烛的宽度
    interval: 2, // 蜡烛之间的间隔空间
    color: {
      up: '#E84352',
      down: '#49B07C'
    }
  },
  axis: {
    style: '#959595',
    width: 0.05
  },
  crosshair: {
    color: '#959595',
    width: 0.5,
    markBackgroundColor: '#DDD',
    markTextColor: 'black'
  },
  study: {
    candle: null,
    separate: null,
    config: {
      macd: {
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9
      },
      kd: {
        period: 14,
        signalPeriod: 3
      },
      rsi: {
        period: 14
      },
      cci: {
        period: 20
      },
      wr: {
        period: 14
      },
      roc: {
        period: 12,
        maPeriod: 6
      },
      stochrsi: {
        period: 14,
        smaPeriod: 5
      }
    }
  }
}
