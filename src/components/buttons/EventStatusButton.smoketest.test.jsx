import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import EventStatusButton from './EventStatusButton';

const mockEvent = { status: 'Pending', requestid: 123 };
const mockUser = {
  currentUser: { usertype: 'Admin', userid: 1, artistname: 'test-artist' },
  token: 'test-token',
};

test('renders EventStatusButton component without crashing', () => {
  render(
    <Router>
      <UserContext.Provider value={mockUser}>
        <EventStatusButton event={mockEvent} />
      </UserContext.Provider>
    </Router>
  );
});
