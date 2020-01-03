import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import Nav from '../components/Nav';
import { CURRENT_USER_QUERY } from '../components/User';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeUser, fakeCartItem } from '../lib/testUtils';

const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: null } },
  },
];
const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: fakeUser() } },
  },
];
const signedInMocksWithCartItems = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem(), fakeCartItem(), fakeCartItem()],
        },
      },
    },
  },
];

describe('<Nav />', () => {
  it('renders a minimal nav when signed out', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <Nav />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const nav = wrapper.find('ul[data-test="nav"]');
    // console.log(nav.debug());
    expect(toJSON(nav)).toMatchSnapshot();
  });

  it('renders full nav when signed in', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <Nav />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const nav = wrapper.find('ul[data-test="nav"]');
    // console.log(nav.debug());
    // expect(toJSON(nav)).toMatchSnapshot();

    // NOTE: this could change if I add an admin nav
    // that differs from a regular account nav
    expect(nav.children().length).toBe(6);
    expect(nav.text()).toContain('Sign Out');

    const sell = wrapper.find('Link[href="/sell"]');
    expect(sell.exists()).toBe(true);
    expect(sell.text()).toContain('Sell');

    const me = wrapper.find('Link[href="/me"]');
    expect(me.exists()).toBe(true);
    expect(me.text()).toContain('Account');

    const items = wrapper.find('Link[href="/items"]');
    expect(items.exists()).toBe(true);
    expect(items.text()).toContain('Shop');

    const orders = wrapper.find('Link[href="/orders"]');
    expect(orders.exists()).toBe(true);
    expect(orders.text()).toContain('Orders');

    // console.log(sell.text());
  });

  it('renders the right amount of items in the cart', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocksWithCartItems}>
        <Nav />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const nav = wrapper.find('ul[data-test="nav"]');
    const count = nav.find('div.count');
    // console.log(count.debug());
    expect(toJSON(count)).toMatchSnapshot();
  });
});
