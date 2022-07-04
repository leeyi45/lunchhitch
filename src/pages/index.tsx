import { LunchHitchUser } from '../auth';
import AuthSelector from '../common/auth_selector';
import Navbar from '../common/navbar';
import NoUserHomePage from './profile/noUser/NoUserHomePage';
import UserHomePage from './profile/user/UserHomePage';

export default function IndexPage() {
  return (
    <AuthSelector
      unauthenticated={(
        <>
          <Navbar user={null} />
          <NoUserHomePage />
        </>
      )}
    >
      {(user) => (
        <>
          <Navbar user={user as LunchHitchUser} />
          <UserHomePage user={user as LunchHitchUser} />
        </>
      )}
    </AuthSelector>
  );
}
