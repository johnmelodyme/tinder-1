/*
 *
 * Messages
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectPersonSelector, selectMatchesSelector, selectMatchDetailImages } from './selectors';
import styles from './styles.css';
import { selectDashboardHistory } from 'containers/Dashboard/selectors';
import { createStructuredSelector } from 'reselect';
import { selectPersonAction } from './actions';

import MessengerCard from 'components/MessengerCard';
import DetailView from 'components/DetailView';
import MessageBubble from 'components/MessageBubble';
import MessengerInput from 'components/MessengerInput';

export class Messages extends React.Component { // eslint-disable-line react/prefer-stateless-function
  mapMatches() {
    return this.props.selectMatches && this.props.selectMatches.map((each) => <MessengerCard onClick={this.props.selectPerson} key={each._id} data={each} />);
  }

  render() {
    return (
      <div className={styles.messagesContainer}>
        <div className={styles.messagePanel}>
          <div className={styles.messagePanelContainenr}>
            {this.props.userHistory.matches && this.mapMatches()}
          </div>
        </div>
        <div className={styles.messengerPanel}>
          <div className={styles.messengerPanelContainer}>
            <div className={styles.horizontalMessengerPanel}>
              <div className={styles.columnMessengerPanel}>
                <div className={styles.messagesPanel} >
                  <MessageBubble from="me">This is good content</MessageBubble>
                  <MessageBubble from="you">This is bad content</MessageBubble>
                </div>
                <div className={styles.chatBoxPanel} >
                  <MessengerInput />
                </div>
              </div>
              <div className={styles.profileBioPanel} >
                {this.props.currentPerson && this.props.matchDetailImages ?
                  <DetailView
                    data={this.props.currentPerson.person}
                    imageData={this.props.matchDetailImages}
                  /> : <h1>Test</h1>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    selectPerson: (id) => dispatch(selectPersonAction(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  userHistory: selectDashboardHistory(),
  currentPerson: selectPersonSelector(),
  selectMatches: selectMatchesSelector(),
  matchDetailImages: selectMatchDetailImages(),
});

Messages.propTypes = {
  matchMessages: PropTypes.object,
  userHistory: PropTypes.object,
  selectPerson: PropTypes.func,
  currentPerson: PropTypes.object,
  selectMatches: PropTypes.array,
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
