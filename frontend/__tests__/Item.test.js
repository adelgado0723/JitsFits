import ItemComponent from '../components/Item';
import { shallow, mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import formatMoney from '../lib/formatMoney';

const fakeItem = {
  id: 'ABC123',
  title: 'A Cool Item',
  price: 8000,
  description: 'This is a really cool item!',
  image: 'WhiteBelt.jpg',
  largeImage: 'LargeWhiteBelt.jpg',
};

describe('<Item />', () => {
  // it('renders the image properly', () => {
  //   const wrapper = shallow(<ItemComponent item={fakeItem} />);
  //   const img = wrapper.find('img');
  //   expect(img.props().src).toBe(fakeItem.image);
  //   expect(img.props().alt).toBe(fakeItem.title);
  // });
  // it('renders the PriceTag and Title properly', () => {
  //   const wrapper = shallow(<ItemComponent item={fakeItem} />);
  //   const PriceTag = wrapper.find('PriceTag');
  //   expect(PriceTag.children().text()).toBe(formatMoney(fakeItem.price));
  //   expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
  // });
  // it('renders out the buttons properly', () => {
  //   const wrapper = shallow(<ItemComponent item={fakeItem} />);
  //   const buttonList = wrapper.find('.buttonList');
  //   expect(buttonList.children()).toHaveLength(3);
  //   expect(buttonList.find('Link')).toHaveLength(1);
  //   expect(buttonList.find('AddToCart')).toHaveLength(1);
  //   expect(buttonList.find('DeleteItem')).toHaveLength(1);
  //   console.log(buttonList.children().debug());
  // });
  it('<Item /> renders and matches the snapshot', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
