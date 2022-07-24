import React from 'react';
import { useQuery } from 'react-query';
import { getUsers } from '../../../../config/api';

const TableUser = () => {
  let { data: users } = useQuery('usersCache', getUsers);

  users = users?.filter((data) => data.email !== 'adminwaysbucks@gmail.com');

  return (
    <>
      <title>DNcoffee | User</title>
      <section className="income-transaction">
        <div class="container">
          <h1 className="mb-3">Users DNcoffee</h1>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Full Name</th>
                <th scope="col">Email</th>
                <th scope="col">Total Order</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user, index) => {
                return (
                  <tr>
                    <td scope="col">{index + 1}</td>
                    <td scope="col">{user.fullname}</td>
                    <td scope="col">{user.email}</td>
                    <td scope="col">{user.transactions.length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default TableUser;
