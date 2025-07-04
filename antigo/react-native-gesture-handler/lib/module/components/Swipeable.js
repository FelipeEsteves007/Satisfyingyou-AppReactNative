function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Similarily to the DrawerLayout component this deserves to be put in a
// separate repo. Although, keeping it here for the time being will allow us to
// move faster and fix possible issues quicker
import * as React from 'react';
import { Component } from 'react';
import { Animated, StyleSheet, View, I18nManager } from 'react-native';
import { PanGestureHandler } from '../handlers/PanGestureHandler';
import { TapGestureHandler } from '../handlers/TapGestureHandler';
import { State } from '../State';
const DRAG_TOSS = 0.05;

/**
 * @deprecated use Reanimated version of Swipeable instead
 *
 * This component allows for implementing swipeable rows or similar interaction.
 */
export default class Swipeable extends Component {
  constructor(_props) {
    super(_props);

    _defineProperty(this, "onGestureEvent", void 0);

    _defineProperty(this, "transX", void 0);

    _defineProperty(this, "showLeftAction", void 0);

    _defineProperty(this, "leftActionTranslate", void 0);

    _defineProperty(this, "showRightAction", void 0);

    _defineProperty(this, "rightActionTranslate", void 0);

    _defineProperty(this, "updateAnimatedEvent", (props, state) => {
      const {
        friction,
        overshootFriction
      } = props;
      const {
        dragX,
        rowTranslation,
        leftWidth = 0,
        rowWidth = 0
      } = state;
      const {
        rightOffset = rowWidth
      } = state;
      const rightWidth = Math.max(0, rowWidth - rightOffset);
      const {
        overshootLeft = leftWidth > 0,
        overshootRight = rightWidth > 0
      } = props;
      const transX = Animated.add(rowTranslation, dragX.interpolate({
        inputRange: [0, friction],
        outputRange: [0, 1]
      })).interpolate({
        inputRange: [-rightWidth - 1, -rightWidth, leftWidth, leftWidth + 1],
        outputRange: [-rightWidth - (overshootRight ? 1 / overshootFriction : 0), -rightWidth, leftWidth, leftWidth + (overshootLeft ? 1 / overshootFriction : 0)]
      });
      this.transX = transX;
      this.showLeftAction = leftWidth > 0 ? transX.interpolate({
        inputRange: [-1, 0, leftWidth],
        outputRange: [0, 0, 1]
      }) : new Animated.Value(0);
      this.leftActionTranslate = this.showLeftAction.interpolate({
        inputRange: [0, Number.MIN_VALUE],
        outputRange: [-10000, 0],
        extrapolate: 'clamp'
      });
      this.showRightAction = rightWidth > 0 ? transX.interpolate({
        inputRange: [-rightWidth, 0, 1],
        outputRange: [1, 0, 0]
      }) : new Animated.Value(0);
      this.rightActionTranslate = this.showRightAction.interpolate({
        inputRange: [0, Number.MIN_VALUE],
        outputRange: [-10000, 0],
        extrapolate: 'clamp'
      });
    });

    _defineProperty(this, "onTapHandlerStateChange", ({
      nativeEvent
    }) => {
      if (nativeEvent.oldState === State.ACTIVE) {
        this.close();
      }
    });

    _defineProperty(this, "onHandlerStateChange", ev => {
      if (ev.nativeEvent.oldState === State.ACTIVE) {
        this.handleRelease(ev);
      }

      if (ev.nativeEvent.state === State.ACTIVE) {
        const {
          velocityX,
          translationX: dragX
        } = ev.nativeEvent;
        const {
          rowState
        } = this.state;
        const {
          friction
        } = this.props;
        const translationX = (dragX + DRAG_TOSS * velocityX) / friction;
        const direction = rowState === -1 ? 'right' : rowState === 1 ? 'left' : translationX > 0 ? 'left' : 'right';

        if (rowState === 0) {
          var _this$props$onSwipeab, _this$props;

          (_this$props$onSwipeab = (_this$props = this.props).onSwipeableOpenStartDrag) === null || _this$props$onSwipeab === void 0 ? void 0 : _this$props$onSwipeab.call(_this$props, direction);
        } else {
          var _this$props$onSwipeab2, _this$props2;

          (_this$props$onSwipeab2 = (_this$props2 = this.props).onSwipeableCloseStartDrag) === null || _this$props$onSwipeab2 === void 0 ? void 0 : _this$props$onSwipeab2.call(_this$props2, direction);
        }
      }
    });

    _defineProperty(this, "handleRelease", ev => {
      const {
        velocityX,
        translationX: dragX
      } = ev.nativeEvent;
      const {
        leftWidth = 0,
        rowWidth = 0,
        rowState
      } = this.state;
      const {
        rightOffset = rowWidth
      } = this.state;
      const rightWidth = rowWidth - rightOffset;
      const {
        friction,
        leftThreshold = leftWidth / 2,
        rightThreshold = rightWidth / 2
      } = this.props;
      const startOffsetX = this.currentOffset() + dragX / friction;
      const translationX = (dragX + DRAG_TOSS * velocityX) / friction;
      let toValue = 0;

      if (rowState === 0) {
        if (translationX > leftThreshold) {
          toValue = leftWidth;
        } else if (translationX < -rightThreshold) {
          toValue = -rightWidth;
        }
      } else if (rowState === 1) {
        // Swiped to left
        if (translationX > -leftThreshold) {
          toValue = leftWidth;
        }
      } else {
        // Swiped to right
        if (translationX < rightThreshold) {
          toValue = -rightWidth;
        }
      }

      this.animateRow(startOffsetX, toValue, velocityX / friction);
    });

    _defineProperty(this, "animateRow", (fromValue, toValue, velocityX) => {
      const {
        dragX,
        rowTranslation
      } = this.state;
      dragX.setValue(0);
      rowTranslation.setValue(fromValue);
      this.setState({
        rowState: Math.sign(toValue)
      });
      Animated.spring(rowTranslation, {
        restSpeedThreshold: 1.7,
        restDisplacementThreshold: 0.4,
        velocity: velocityX,
        bounciness: 0,
        toValue,
        useNativeDriver: this.props.useNativeAnimations,
        ...this.props.animationOptions
      }).start(({
        finished
      }) => {
        if (finished) {
          if (toValue > 0) {
            var _this$props$onSwipeab3, _this$props3, _this$props$onSwipeab4, _this$props4;

            (_this$props$onSwipeab3 = (_this$props3 = this.props).onSwipeableLeftOpen) === null || _this$props$onSwipeab3 === void 0 ? void 0 : _this$props$onSwipeab3.call(_this$props3);
            (_this$props$onSwipeab4 = (_this$props4 = this.props).onSwipeableOpen) === null || _this$props$onSwipeab4 === void 0 ? void 0 : _this$props$onSwipeab4.call(_this$props4, 'left', this);
          } else if (toValue < 0) {
            var _this$props$onSwipeab5, _this$props5, _this$props$onSwipeab6, _this$props6;

            (_this$props$onSwipeab5 = (_this$props5 = this.props).onSwipeableRightOpen) === null || _this$props$onSwipeab5 === void 0 ? void 0 : _this$props$onSwipeab5.call(_this$props5);
            (_this$props$onSwipeab6 = (_this$props6 = this.props).onSwipeableOpen) === null || _this$props$onSwipeab6 === void 0 ? void 0 : _this$props$onSwipeab6.call(_this$props6, 'right', this);
          } else {
            var _this$props$onSwipeab7, _this$props7;

            const closingDirection = fromValue > 0 ? 'left' : 'right';
            (_this$props$onSwipeab7 = (_this$props7 = this.props).onSwipeableClose) === null || _this$props$onSwipeab7 === void 0 ? void 0 : _this$props$onSwipeab7.call(_this$props7, closingDirection, this);
          }
        }
      });

      if (toValue > 0) {
        var _this$props$onSwipeab8, _this$props8, _this$props$onSwipeab9, _this$props9;

        (_this$props$onSwipeab8 = (_this$props8 = this.props).onSwipeableLeftWillOpen) === null || _this$props$onSwipeab8 === void 0 ? void 0 : _this$props$onSwipeab8.call(_this$props8);
        (_this$props$onSwipeab9 = (_this$props9 = this.props).onSwipeableWillOpen) === null || _this$props$onSwipeab9 === void 0 ? void 0 : _this$props$onSwipeab9.call(_this$props9, 'left');
      } else if (toValue < 0) {
        var _this$props$onSwipeab10, _this$props10, _this$props$onSwipeab11, _this$props11;

        (_this$props$onSwipeab10 = (_this$props10 = this.props).onSwipeableRightWillOpen) === null || _this$props$onSwipeab10 === void 0 ? void 0 : _this$props$onSwipeab10.call(_this$props10);
        (_this$props$onSwipeab11 = (_this$props11 = this.props).onSwipeableWillOpen) === null || _this$props$onSwipeab11 === void 0 ? void 0 : _this$props$onSwipeab11.call(_this$props11, 'right');
      } else {
        var _this$props$onSwipeab12, _this$props12;

        const closingDirection = fromValue > 0 ? 'left' : 'right';
        (_this$props$onSwipeab12 = (_this$props12 = this.props).onSwipeableWillClose) === null || _this$props$onSwipeab12 === void 0 ? void 0 : _this$props$onSwipeab12.call(_this$props12, closingDirection);
      }
    });

    _defineProperty(this, "onRowLayout", ({
      nativeEvent
    }) => {
      this.setState({
        rowWidth: nativeEvent.layout.width
      });
    });

    _defineProperty(this, "currentOffset", () => {
      const {
        leftWidth = 0,
        rowWidth = 0,
        rowState
      } = this.state;
      const {
        rightOffset = rowWidth
      } = this.state;
      const rightWidth = rowWidth - rightOffset;

      if (rowState === 1) {
        return leftWidth;
      } else if (rowState === -1) {
        return -rightWidth;
      }

      return 0;
    });

    _defineProperty(this, "close", () => {
      this.animateRow(this.currentOffset(), 0);
    });

    _defineProperty(this, "openLeft", () => {
      const {
        leftWidth = 0
      } = this.state;
      this.animateRow(this.currentOffset(), leftWidth);
    });

    _defineProperty(this, "openRight", () => {
      const {
        rowWidth = 0
      } = this.state;
      const {
        rightOffset = rowWidth
      } = this.state;
      const rightWidth = rowWidth - rightOffset;
      this.animateRow(this.currentOffset(), -rightWidth);
    });

    _defineProperty(this, "reset", () => {
      const {
        dragX,
        rowTranslation
      } = this.state;
      dragX.setValue(0);
      rowTranslation.setValue(0);
      this.setState({
        rowState: 0
      });
    });

    const _dragX = new Animated.Value(0);

    this.state = {
      dragX: _dragX,
      rowTranslation: new Animated.Value(0),
      rowState: 0,
      leftWidth: undefined,
      rightOffset: undefined,
      rowWidth: undefined
    };
    this.updateAnimatedEvent(_props, this.state);
    this.onGestureEvent = Animated.event([{
      nativeEvent: {
        translationX: _dragX
      }
    }], {
      useNativeDriver: _props.useNativeAnimations
    });
  }

  shouldComponentUpdate(props, state) {
    if (this.props.friction !== props.friction || this.props.overshootLeft !== props.overshootLeft || this.props.overshootRight !== props.overshootRight || this.props.overshootFriction !== props.overshootFriction || this.state.leftWidth !== state.leftWidth || this.state.rightOffset !== state.rightOffset || this.state.rowWidth !== state.rowWidth) {
      this.updateAnimatedEvent(props, state);
    }

    return true;
  }

  render() {
    const {
      rowState
    } = this.state;
    const {
      children,
      renderLeftActions,
      renderRightActions,
      dragOffsetFromLeftEdge = 10,
      dragOffsetFromRightEdge = 10
    } = this.props;
    const left = renderLeftActions && /*#__PURE__*/React.createElement(Animated.View, {
      style: [styles.leftActions, // All those and below parameters can have ! since they are all
      // asigned in constructor in `updateAnimatedEvent` but TS cannot spot
      // it for some reason
      {
        transform: [{
          translateX: this.leftActionTranslate
        }]
      }]
    }, renderLeftActions(this.showLeftAction, this.transX, this), /*#__PURE__*/React.createElement(View, {
      onLayout: ({
        nativeEvent
      }) => this.setState({
        leftWidth: nativeEvent.layout.x
      })
    }));
    const right = renderRightActions && /*#__PURE__*/React.createElement(Animated.View, {
      style: [styles.rightActions, {
        transform: [{
          translateX: this.rightActionTranslate
        }]
      }]
    }, renderRightActions(this.showRightAction, this.transX, this), /*#__PURE__*/React.createElement(View, {
      onLayout: ({
        nativeEvent
      }) => this.setState({
        rightOffset: nativeEvent.layout.x
      })
    }));
    return /*#__PURE__*/React.createElement(PanGestureHandler, _extends({
      activeOffsetX: [-dragOffsetFromRightEdge, dragOffsetFromLeftEdge],
      touchAction: "pan-y"
    }, this.props, {
      onGestureEvent: this.onGestureEvent,
      onHandlerStateChange: this.onHandlerStateChange
    }), /*#__PURE__*/React.createElement(Animated.View, {
      onLayout: this.onRowLayout,
      style: [styles.container, this.props.containerStyle]
    }, left, right, /*#__PURE__*/React.createElement(TapGestureHandler, {
      enabled: rowState !== 0,
      touchAction: "pan-y",
      onHandlerStateChange: this.onTapHandlerStateChange
    }, /*#__PURE__*/React.createElement(Animated.View, {
      pointerEvents: rowState === 0 ? 'auto' : 'box-only',
      style: [{
        transform: [{
          translateX: this.transX
        }]
      }, this.props.childrenContainerStyle]
    }, children))));
  }

}

_defineProperty(Swipeable, "defaultProps", {
  friction: 1,
  overshootFriction: 1,
  useNativeAnimations: true
});

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  },
  leftActions: { ...StyleSheet.absoluteFillObject,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row'
  },
  rightActions: { ...StyleSheet.absoluteFillObject,
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse'
  }
});
//# sourceMappingURL=Swipeable.js.map