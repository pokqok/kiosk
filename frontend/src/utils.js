import dayjs from "dayjs";
import weekOfYear from 'dayjs/plugin/weekOfYear';
dayjs.extend(weekOfYear);

export function getSalesData() {
  const salesData = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('orders_')) {
      const data = JSON.parse(localStorage.getItem(key));
      salesData.push({ key, data });
    }
  }
  return salesData;
}

export function groupByDate() {
  const salesData = getSalesData();
  const groupedData = {};

  salesData.forEach(record => {
    const date = record.key.split('_')[1];
    if (!groupedData[date]) {
      groupedData[date] = [];
    }
    groupedData[date].push(...record.data);
  });

  return Object.keys(groupedData).map(date => ({
    key: date,
    data: groupedData[date]
  }));
}

export function groupByWeek() {
  const salesData = getSalesData();
  const groupedData = {};

  salesData.forEach(record => {
    const week = dayjs(record.key.split('_')[1]).week();
    const year = dayjs(record.key.split('_')[1]).year();
    const weekKey = `${year}-W${week}`;
    if (!groupedData[weekKey]) {
      groupedData[weekKey] = [];
    }
    groupedData[weekKey].push(...record.data);
  });

  return Object.keys(groupedData).map(week => ({
    key: week,
    data: groupedData[week]
  }));
}

export function groupByMonth() {
  const salesData = getSalesData();
  const groupedData = {};

  salesData.forEach(record => {
    const month = dayjs(record.key.split('_')[1]).format('YYYY-MM');
    if (!groupedData[month]) {
      groupedData[month] = [];
    }
    groupedData[month].push(...record.data);
  });

  return Object.keys(groupedData).map(month => ({
    key: month,
    data: groupedData[month]
  }));
}
