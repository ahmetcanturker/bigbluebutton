import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import UserList from './component';
import Service from './service';
import Meetings from '/imports/api/meetings';
import Auth from '/imports/ui/services/auth';
import getFromUserSettings from '/imports/ui/services/users-settings';
import { UsersContext } from '/imports/ui/components/components-data/users-context/context';

const propTypes = {
  isPublicChat: PropTypes.func.isRequired,
  setEmojiStatus: PropTypes.func.isRequired,
  clearAllEmojiStatus: PropTypes.func.isRequired,
  roving: PropTypes.func.isRequired,
  requestUserInformation: PropTypes.func.isRequired,
};

const UserListContainer = (props) => {
  const usingUsersContext = useContext(UsersContext);
  const { users } = usingUsersContext;

  return (<UserList {...props} user={users[Auth.meetingID][Auth.userID]} />);
};

// const UserListContainer = props => <UserList {...props}  />;

UserListContainer.propTypes = propTypes;

export default withTracker(({ compact }) => ({
  hasBreakoutRoom: Service.hasBreakoutRoom(),
  isPublicChat: Service.isPublicChat,
  setEmojiStatus: Service.setEmojiStatus,
  clearAllEmojiStatus: Service.clearAllEmojiStatus,
  roving: Service.roving,
  CustomLogoUrl: Service.getCustomLogoUrl(),
  compact,
  getGroupChatPrivate: Service.getGroupChatPrivate,
  handleEmojiChange: Service.setEmojiStatus,
  getEmojiList: Service.getEmojiList(),
  getEmoji: Service.getEmoji(),
  showBranding: getFromUserSettings('bbb_display_branding_area', Meteor.settings.public.app.branding.displayBrandingArea),
  hasPrivateChatBetweenUsers: Service.hasPrivateChatBetweenUsers,
  toggleUserLock: Service.toggleUserLock,
  requestUserInformation: Service.requestUserInformation,

  // New added:
  meeting: Meetings.findOne({ meetingId: Auth.meetingID }),
  isInterview: !!Meetings.findOne({ meetingId: Auth.meetingID }).metadataProp?.metadata?.presenter,
  intervieweeName: Meetings.findOne({ meetingId: Auth.meetingID }).metadataProp?.metadata?.presenter,
  handleTakePresenter: Service.takePresenterRole
}))(UserListContainer);
