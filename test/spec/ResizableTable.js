/* globals jest */
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-enzyme';
import { Resizable, Resizer } from 'react-make-resizable';
import ResizableTable, { ResizingIcon } from '../../lib/index';

Enzyme.configure({ adapter: new Adapter() });

describe('ResizableTable', () => {
  const TestComponent = ({ children }) => (<b>{children}</b>);
  let component;
  let mockProps;
  let instance;

  const getRequiredProps = () => ({
    onColumnResize: jest.fn()
  });

  const setClientWidth = (width) => {
    const headerNode =
      instance.element.querySelectorAll('table thead tr th');

    headerNode.forEach((node) => {
      Object.defineProperty(node, 'clientWidth', {
        get: () => width
      });
    });
  };

  const setupComponent = (overrides = {}) => {
    mockProps = {
      ...getRequiredProps(),
      ...overrides
    };

    component = mount((
      <ResizableTable {...mockProps}>
        <table>
          <thead>
            <tr>
              <th>Dave <ResizingIcon /></th>
              <th>Jamie <ResizingIcon /></th>
              <th>Joe <ResizingIcon /></th>
              <th>No resizing </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>foo</td>
              <td>bar</td>
              <td><TestComponent>Bam</TestComponent></td>
              <td>Action</td>
            </tr>
            <tr>
              <td>whizz</td>
              <td>woop</td>
              <td>binary star system</td>
              <td>Action</td>
            </tr>
          </tbody>
        </table>
      </ResizableTable>
    ));
    instance = component.instance();
  };

  const table = () => component.find('table');
  const header = () => table().find('thead');
  const body = () => table().find('tbody');

  describe('when no value prop', () => {
    beforeEach(() => {
      setupComponent()
    });

    it('sets widths to the browser calculated column width', () => {
      expect(instance.headerCells.map(n => n.style.width))
        .toEqual(['0px', '0px', '0px', '0px']);
    });
  });

  describe('with value prop', () => {
    beforeEach(() => setupComponent({ value: [100, 100, 100] }));

    it('sets widths to value if its resizable', () => {
      expect(instance.headerCells.map(n => n.style.width))
        .toEqual(['100px', '100px', '100px', expect.any(String)]);
    });

    it('sets widths to the browser calculate column width if its not resizable', () => {
      expect(instance.headerCells.map(n => n.style.width))
        .toEqual([expect.any(String), expect.any(String), expect.any(String), '0px']);
    });

    describe('when child updated to no table', () => {
      it('does not throw an error', () => {
        expect(() => {
          component.setProps({ children: 'No content' });
          component.update();
        }).not.toThrow();
      });
    });

    describe('structure', () => {
      it('renders a table', () => {
        expect(table()).toHaveLength(1);
      });

      it('renders the headers in order', () => {
        const headers = header().find('th');

        expect(headers.length).toEqual(4);
        expect(headers.at(0)).toIncludeText('Dave');
        expect(headers.at(1)).toIncludeText('Jamie');
        expect(headers.at(2)).toIncludeText('Joe');
        expect(headers.at(3)).toIncludeText('No resizing');
      });

      it('renders the correct number of rows', () => {
        const rows = body().find('tr');

        expect(rows.length).toEqual(2);
      });

      it('renders the correct values in the body cells', () => {
        const rows = body().find('tr');

        expect(rows).toHaveLength(2);

        for (let i = 0; i < rows.length; i++) {
          const cellNodes = rows.at(i).find('td');

          expect(cellNodes).toHaveLength(4);
        }
      });

      it('renders a column resizing icon where ResizingIcon is used', () => {
        const headers = header().find('TableHeaderCell');

        for (let i = 0; i < headers.length; i++) {
          const icon = headers.at(i).find('.resize-icon');

          if (i === 3) {
            expect(icon).not.toBePresent();
          } else {
            expect(icon).toBePresent();
          }
        }
      });
    });

    it('should define headerCells', () => {
      expect(instance.headerCells).toBeDefined();
      expect(instance.headerCells.length).toBe(4);
    });

    describe('On mouse down', () => {
      beforeEach((done) => {
        const icon = header()
          .find(Resizer)
          .at(1)
          .find('div.resize-icon')
          .instance();
        icon.dispatchEvent(new MouseEvent('mousedown'));
        setTimeout(done);
      });

      it('should set the table layout to fixed', () => {
        expect(component.find('table').instance().style.tableLayout).toEqual('fixed');
      });

      it('should set the icon displays', () => {
        expect(instance.headerCells[1].querySelector('.resize-icon').style.display).toBe('block');
        expect(instance.headerCells[2].querySelector('.resize-icon').style.display).toBe('none');
      });

      describe('onResizeEnd when size changed', () => {
        beforeEach(() => {
          setClientWidth(250);
          component.find(Resizable).first().prop('onResizeEnd')();
        });

        it('calls onColumnResize with new widths', () => {
          expect(mockProps.onColumnResize).toHaveBeenCalledWith([250, 250, 250]);
        });

        it('should reset the icon displays', () => {
          expect(instance.headerCells[1].querySelector('.resize-icon').style.display).toBe('');
          expect(instance.headerCells[2].querySelector('.resize-icon').style.display).toBe('');
        });
      });

      describe('onResizeEnd when size not changed', () => {
        beforeEach(() => {
          setClientWidth(100);
          component.find(Resizable).first().prop('onResizeEnd')();
        });

        it('does not call onColumnResize', () => {
          expect(mockProps.onColumnResize).not.toHaveBeenCalled();
        });

        it('should reset the icon displays', () => {
          expect(instance.headerCells[1].querySelector('.resize-icon').style.display).toBe('');
          expect(instance.headerCells[2].querySelector('.resize-icon').style.display).toBe('');
        });
      });
    });

    describe('handleDoubleClick', () => {
      beforeEach(() => {
        component.find('table').instance().style.tableLayout = 'fixed';
        header().find('.resize-icon').at(1).simulate('doubleclick');
      });

      it('should call onColumnResize', () => {
        expect(instance.props.onColumnResize).toHaveBeenCalledWith([]);
      });

      it('sets tableLayout to auto', () => {
        expect(component.find('table').instance().style.tableLayout).toEqual('auto');
      });
    });
  });
});
