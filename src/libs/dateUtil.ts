function minutesDiff(dtStart: Date, dtEnd: Date): number {
  let diffValue = (dtEnd.getTime() - dtStart.getTime()) / 1000;
  diffValue /= 60;
  return Math.abs(Math.round(diffValue));
}

export default {
  minutesDiff
}