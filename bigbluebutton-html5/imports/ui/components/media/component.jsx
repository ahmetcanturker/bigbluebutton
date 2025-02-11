import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import deviceInfo from '/imports/utils/deviceInfo';
import WebcamDraggable from './webcam-draggable-overlay/component';
import { styles } from './styles';
import Storage from '../../services/storage/session';

const { isMobile } = deviceInfo;

const propTypes = {
  children: PropTypes.element.isRequired,
  usersVideo: PropTypes.arrayOf(Array),
  singleWebcam: PropTypes.bool.isRequired,
  hideOverlay: PropTypes.bool,
  swapLayout: PropTypes.bool,
  audioModalIsOpen: PropTypes.bool,
  layoutContextState: PropTypes.instanceOf(Object).isRequired,
  isRTL: PropTypes.bool.isRequired,
};

const defaultProps = {
  usersVideo: [],
  hideOverlay: true,
  swapLayout: false,
  audioModalIsOpen: false,
};


export default class Media extends Component {
  constructor(props) {
    super(props);
    this.refContainer = React.createRef();
  }

  render() {
    const {
      swapLayout,
      singleWebcam,
      hideOverlay,
      children,
      audioModalIsOpen,
      usersVideo,
      layoutContextState,
      isMeteorConnected,
      isRTL,
    } = this.props;

    const { webcamsPlacement: placement } = layoutContextState;
    const placementStorage = Storage.getItem('webcamsPlacement');
    const webcamsPlacement = placement || placementStorage;

    const contentClassName = cx({
      [styles.content]: true,
    });

    const overlayClassName = cx({
      [styles.overlay]: true,
      [styles.hideOverlay]: hideOverlay,
      [styles.floatingOverlay]: (webcamsPlacement === 'floating'),
    });

    const containerClassName = cx({
      [styles.container]: true,
      [styles.containerV]: webcamsPlacement === 'top' || webcamsPlacement === 'bottom' || webcamsPlacement === 'floating',
      [styles.containerH]: webcamsPlacement === 'left' || webcamsPlacement === 'right',
    });

    const showVideo = usersVideo.length > 0 && isMeteorConnected;

    return (
      <div
        id="container"
        className={containerClassName}
        ref={this.refContainer}
      >
        <div
          className={!swapLayout ? contentClassName : overlayClassName}
          style={{
            maxHeight: usersVideo.length > 0
            && (
              webcamsPlacement !== 'left'
              || webcamsPlacement !== 'right'
            )
            && (
              webcamsPlacement === 'top'
              || webcamsPlacement === 'bottom'
            )
              ? '80%'
              : '100%',
            minHeight: isMobile && window.innerWidth > window.innerHeight ? '50%' : '20%',
            maxWidth: usersVideo.length > 0
            && (
              webcamsPlacement !== 'top'
              || webcamsPlacement !== 'bottom'
            )
            && (
              webcamsPlacement === 'left'
              || webcamsPlacement === 'right'
            )
              ? '80%'
              : '100%',
            minWidth: '20%',
          }}
        >
          {children}
        </div>
        {showVideo ? (
          <WebcamDraggable
            refMediaContainer={this.refContainer}
            swapLayout={swapLayout}
            singleWebcam={singleWebcam}
            usersVideoLenght={usersVideo.length}
            hideOverlay={hideOverlay}
            audioModalIsOpen={audioModalIsOpen}
            usersVideo={usersVideo}
            isRTL={isRTL}
          />
        ) : null}
      </div>
    );
  }
}

Media.propTypes = propTypes;
Media.defaultProps = defaultProps;
