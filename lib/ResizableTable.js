// @flow
import * as React from 'react';
import { Resizable } from 'react-make-resizable';
import ResizingIcon from './ResizingIcon';

/** @memberOf ResizableTable */
type Props = {
  /** The table */
  children: React.Node,
  /** The widths */
  value: Array<number>,
  /** Calls when columns have been resized */
  onColumnResize: (Array<number>) => void,
  /** Minimum width of a column */
  minWidth: number
};

export default class ResizableTable extends React.Component<Props> {
  static defaultProps = {
    value: [],
    minWidth: 0
  };

  static resetCellWidth(cell) {
    cell.style.width = 'auto';
  }

  headerCells: Array<HTMLElement>;
  element: HTMLElement;
  currentIndex: number;

  afterDragEnd = (): void => {
    const width = [];
    this.resizableHeaderCells.forEach((cell) => {
      const icon = ((cell.querySelector('.resize-icon'): any): HTMLElement);

      width.push(cell.clientWidth);
      icon.style.display = '';
    });

    if (width.some((w, i) => w !== this.props.value[i])) {
      this.props.onColumnResize(width);
    }
  }

  setTableLayout(layout: 'fixed' | 'auto') {
    const table = this.element.querySelector('table');

    if (table) {
      table.style.tableLayout = layout;
    }
  }

  handleDoubleClick = (): void => {
    this.resizableHeaderCells.forEach(this.constructor.resetCellWidth);
    this.props.onColumnResize([]);
    this.setTableLayout('auto');
  }

  get headerCells(): Array<HTMLElement> {
    return Array.from(this.element.querySelectorAll('table thead tr th'));
  }

  get resizableHeaderCells(): Array<HTMLElement> {
    return this.headerCells.reduce((cells, cell) => {
      if (cell.querySelector('.resize-icon')) {
        return [...cells, cell];
      }

      return cells;
    }, []);
  }

  get normalHeaderCells(): Array<HTMLElement> {
    return this.headerCells.filter(cell => !this.resizableHeaderCells.includes(cell));
  }

  componentDidMount() {
    this.prepareTable();
  }

  componentDidUpdate() {
    this.prepareTable();
  }

  prepareTable = () => {
    if (!this.element) return;

    this.setTableLayout('auto');

    this.headerCells.forEach(this.constructor.resetCellWidth);

    this.normalHeaderCells.forEach((cell) => {
      cell.style.width = `${cell.getBoundingClientRect().width}px`;
    });

    this.resizableHeaderCells.forEach((cell, index) => {
      cell.style.width = `${Math.max(this.props.minWidth, this.props.value[index] || cell.getBoundingClientRect().width)}px`;
    });

    this.setTableLayout('fixed');
  };

  setElement = (el: HTMLElement | null): void => {
    if (el) this.element = el;
  };

  handleResizeStart = ({ currentTarget }: MouseEvent) => {
    this.currentIndex =
      parseInt(((currentTarget: any): HTMLElement).dataset.index, 10);

    this.prepareTable();

    this.headerCells.forEach((cell, index) => {
      const icon = cell.querySelector('.resize-icon');

      if (icon) {
        icon.style.display = index === this.currentIndex ? 'block' : 'none';
      }
    });
  };

  handleResizeDrag = (event: MouseEvent, { width }: { width: number }) => {
    if (width < this.props.minWidth) {
      this.headerCells[this.currentIndex].style.width = `${this.props.minWidth}px`;
    }
  };

  renderChildren(children: React.Node): React.Node {
    return React.Children.toArray(children).map((node, index) => {
      if (!node || !node.props) return node;

      let cell = false;

      const cellChildren = React.Children.map(node.props.children, (child) => {
        if (!child || child.type !== ResizingIcon) return child;

        cell = true;

        return React.cloneElement(
          child,
          {
            ...child.props,
            onDoubleClick: this.handleDoubleClick,
            'data-index': index
          }
        );
      });

      if (cell) {
        return (
          <Resizable
            key={index}
            onResizeStart={this.handleResizeStart}
            onResizeDrag={this.handleResizeDrag}
            onResizeEnd={this.afterDragEnd}
          >
            {React.cloneElement(
              node,
              node.props,
              cellChildren
            )}
          </Resizable>
        );
      }

      return React.cloneElement(
        node,
        node.props,
        node.props && this.renderChildren(node.props.children)
      );
    });
  }

  render(): React.Node {
    return (
      <div ref={this.setElement}>
        {this.renderChildren(this.props.children)}
      </div>
    );
  }
}
