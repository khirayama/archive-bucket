import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { dispatch } from '../../libs/app-dispatcher';
import { pages } from '../../constants';

import BucketPage from './bucket-page';


const propTypes = {
  store: React.PropTypes.object.isRequired,
};

export default class MobileContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      store: this.props.store,
    };

    this.updateState = this._updateState.bind(this);
  }

  componentDidMount() {
    this.props.store.addChangeListener(this.updateState);
    dispatch({
      type: 'UI_START_APP',
      pathname: location.pathname,
    });
  }

  componentWillUnmount() {
    this.props.store.removeChangeListener(this.updateState);
  }

  _updateState() {
    this.setState({
      store: this.props.store,
    });
  }

  _changeTitle(title) {
    document.title = `${title}`;
  }

  _createPageElement(state) {
    switch (state.pageInformation.name) {
      case pages.BUCKET:
        return (
          <section className="page-container">
            <BucketPage />
          </section>
        );
      default:
        if (state.pageInformation.name == pages.NOT_FOUND) {
          return (
            <section className="page-container">
              <section className="page not-found-page">
                <section className="page-content">
                  <h1>Not found contents...</h1>
                </section>
              </section>
            </section>
          );
        } else {
          return (
            <section className="page-container">
              <section className="page not-found-page">
                <section className="page-content">
                  <a href="/api/v1/auth/twitter">login with Twitter</a>
                </section>
              </section>
            </section>
          );
        }
    }
  }

  render() {
    const state = this.state.store.getState();
    const pageElement = this._createPageElement(state);

    // Ref _transition.sass
    const transitionVariations = {
      fadeInOut: {
        names: {
          enter: 'fade-in',
          leave: 'fade-out',
        },
        options: {
          transitionEnterTimeout: 300,
          transitionLeaveTimeout: 300,
        }
      },
      slideInOut: {
        names: {
          enter: 'slide-in',
          leave: 'slide-out',
        },
        options: {
          transitionEnterTimeout: 300,
          transitionLeaveTimeout: 300,
        }
      },
      slideUpDown: {
        names: {
          enter: 'slide-up',
          leave: 'slide-down',
        },
        options: {
          transitionEnterTimeout: 300,
          transitionLeaveTimeout: 300,
        }
      },
    };

    this._changeTitle(state.pageInformation.meta.title);
    return (
      <div>
        <ReactCSSTransitionGroup
        transitionName={transitionVariations.fadeInOut.names}
        { ...transitionVariations.fadeInOut.options }
        >
          {( state.pageInformation.styles.transition === 'fadeInOut') ? pageElement : null}
        </ReactCSSTransitionGroup>

        <ReactCSSTransitionGroup
        transitionName={transitionVariations.slideInOut.names}
        { ...transitionVariations.slideInOut.options }
        >
          {( state.pageInformation.styles.transition === 'slideInOut') ? pageElement : null}
        </ReactCSSTransitionGroup>

        <ReactCSSTransitionGroup
        transitionName={transitionVariations.slideUpDown.names}
        { ...transitionVariations.slideUpDown.options }
        >
          {( state.pageInformation.styles.transition === 'slideUpDown') ? pageElement : null}
        </ReactCSSTransitionGroup>

        {( !state.pageInformation.styles.transition ) ? pageElement : null}
      </div>
    );
  }
}

MobileContainer.propTypes = propTypes;
