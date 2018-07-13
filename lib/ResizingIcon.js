// @flow
import * as React from 'react';
import { Resizer } from 'react-make-resizable';
import classNames from 'classnames';

const ResizingIcon = (props: { [string]: any }): React.Node => (
  <Resizer
    className={classNames('resize-icon', props.className)}
    position="right"
    {...props}
  />
);

export default ResizingIcon;
