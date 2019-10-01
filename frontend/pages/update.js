import UpdateItem from '../components/UpdateItem';

// Destructuring props into query
const Sell = ({ query }) => (
  <div>
    <UpdateItem id={query.id} />
  </div>
);
export default Sell;
