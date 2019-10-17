import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      name
      permissions
    }
  }
`;
const User = (props) => (
  <Query {...props} query={CURRENT_USER_QUERY}>
    {
      // Give the children of this query direct access to the payload
    }
    {(payload) => props.children(payload)}
  </Query>
);

// Making sure that the only thing you can pass
// in as a child is a function
User.PropTypes = {
  children: PropTypes.func.isRequired,
};

export default User;
export { CURRENT_USER_QUERY };
