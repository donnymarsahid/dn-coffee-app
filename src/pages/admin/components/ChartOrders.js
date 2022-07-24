import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useQuery } from 'react-query';
import { getUsers } from '../../../config/api';

const ChartOrders = () => {
  const [state, setState] = useState({
    options: {
      chart: {
        id: 'apexchart-example',
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      },
    },
    series: [
      {
        name: 'series-1',
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
      },
    ],
  });

  const { data: users, isLoading: loadUsers } = useQuery('usersCache', getUsers);

  const nameValue = [];
  const value = [];

  const findUserTarget = users?.filter((data) => data.fullname !== 'Admin DNcoffee');

  useEffect(() => {
    findUserTarget.map((data) => {
      nameValue.push(data.fullname);
      value.push(data.transactions.length);
    });

    setState({
      options: {
        chart: {
          id: 'apexchart-example',
        },
        xaxis: {
          categories: nameValue,
        },
      },
      series: [
        {
          name: 'series-1',
          data: value,
        },
      ],
    });
  }, []);

  return <Chart options={state.options} series={state.series} type="bar" width={700} height={350} style={{ boxShadow: '0 0 8px #3d3d3d54' }} />;
};

export default ChartOrders;
