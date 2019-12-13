import React, { Component } from 'react';
import { Query } from 'react-apollo';
import Link from 'next/link';
import styled from 'styled-components';
import { formatDistance } from 'date-fns';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import formatMoney from '../lib/formatMoney';
import OrderItemStyles from './styles/OrderItemStyles';

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    orders(orderBy: createdAt_DESC) {
      id
      total
      createdAt
      items {
        id
        title
        price
        description
        quantity
        image
      }
    }
  }
`;

const OrderUl = styled.ul`
  display: grid;
  grid-gap: 4rem;
  /* grid-template-columns: repeat(auto-fit, minmax(40%, 1fr)); */
  /* grid-template-columns: minmax(40%, 1fr); */
  grid-template-columns: auto-fit;
  padding: 0;
`;

class Orders extends Component {
  render() {
    return (
      <Query query={USER_ORDERS_QUERY}>
        {({ data: { orders }, loading, error }) => {
          if (error) return <Error error={error} />;
          if (loading) return <p>Loading...</p>;
          // console.log(orders);
          return (
            <div>
              <h2>You have {orders.length} orders!</h2>
              <OrderUl>
                {orders.map((order) => (
                  <OrderItemStyles key={order.id}>
                    <Link
                      href={{
                        pathname: '/order',
                        query: { id: order.id },
                      }}
                    >
                      <a>
                        <h3>Order: {order.id}</h3>
                        <div className="order-meta">
                          <p>
                            {order.items.reduce(
                              (tally, item) => tally + item.quantity,
                              0
                            )}{' '}
                            Items
                          </p>
                          <p>{order.items.length} Products</p>
                          <p>
                            {formatDistance(
                              Date.parse(order.createdAt),
                              new Date()
                            )}{' '}
                            ago
                          </p>
                          <p>{formatMoney(order.total)}</p>
                        </div>
                        <div className="images">
                          {order.items.map((item) => (
                            <img
                              key={item.id}
                              src={item.image}
                              alt={item.title}
                            />
                          ))}
                        </div>
                      </a>
                    </Link>
                  </OrderItemStyles>
                ))}
              </OrderUl>
            </div>
          );
        }}
      </Query>
    );
  }
}
export default Orders;
