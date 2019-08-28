import moment from 'moment';

export const FormatTime = (start,end, total) => {
  const s_d = new Date(start)
  , s_e = end ? new Date(end) : new Date();
  const s = moment(s_d)
  , e = moment(s_e)
  
  const startFormat = new Date(s_d).getFullYear() === new Date().getFullYear() ? 'MMM D H:mm' : 'MMM D YY H:mm';
  const text = `${s.format(startFormat)} - ${end ? e.format('H:mm') : 'now'}`;

  if(!total) total = s_e.getTime() - s_d.getTime();
  const dur = moment.duration(total,'ms');
  const time = `${dur.humanize()}`;
  return {text,time};
}

export const FormatTimeStacked = (start, end, total) => {
  const s_d = new Date(start)
  , s_e = end ? new Date(end) : new Date();
  const s = moment(s_d)
  , e = moment(s_e)

  const format = new Date(s_d).getFullYear() === new Date().getFullYear() ? 'MMM D' : 'MMM D YY';
  const text = `${s.format(format)} - ${end ? e.format(format) : 'now'}`;

  const dur = moment.duration(total,'ms');
  const time = `${dur.humanize()}`;

  return {text,time};
}