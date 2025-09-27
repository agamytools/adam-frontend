import moment from "moment";

export class DateTimeUtil{ // use Independent of framework pattern.

    static format(date, format='YYYY-MM-DD HH:mm:ss'){
      return moment(date).format(format);
    }

}
