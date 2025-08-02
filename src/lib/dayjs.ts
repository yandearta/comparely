import dayjs from 'dayjs';
import id from 'dayjs/locale/id';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale(id);

export { dayjs };
