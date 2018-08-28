import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';
import InlineSvg from 'app/components/inlineSvg';
import space from 'app/styles/space';
import {Flex} from 'grid-emotion';
import Badge from 'app/components/badge';
import Button from 'app/components/buttons/button';

class AccordionButton extends React.Component {
  static propTypes = {
    labelClosed: PropTypes.string.isRequired,
    labelOpen: PropTypes.string,
    cutoff: PropTypes.number,
    children: PropTypes.arrayOf(PropTypes.node).isRequired,
  };

  static defaultProps = {
    cutoff: 0,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      isOpen: false,
    };
  }

  handleClick = e => {
    e.preventDefault();
    this.setState({isOpen: !this.state.isOpen});
  };

  render() {
    const {labelOpen, labelClosed, cutoff} = this.props;
    const children = React.Children.toArray(this.props.children);

    if (React.Children.count(children) <= cutoff + 1) return children;

    return (
      <React.Fragment>
        {children.slice(0, cutoff)}
        <StyledButton onClick={this.handleClick} open={this.state.isOpen}>
          <Flex align="center" justify="space-between" w={1}>
            <Flex align="center">
              {this.state.isOpen ? labelOpen || labelClosed : labelClosed}
              <Badge style={{marginLeft: space(0.25)}} text={children.length - cutoff} />
            </Flex>
            <StyledInlineSvg src="icon-chevron-down" open={this.state.isOpen} />
          </Flex>
        </StyledButton>
        {this.state.isOpen && children.slice(cutoff)}
      </React.Fragment>
    );
  }
}

const StyledButton = styled(Button)`
  display: block;
  width: 100%;
  box-shadow: ${p => (p.open ? 'inset -2px 2px rgba(0,0,0,0.04)' : null)};
  border: 1px solid ${p => p.theme.offWhite2};
  color: ${p => p.theme.gray4};
  margin: 1em 0;

  &,
  &:focus {
    background: ${p => p.theme.offWhite};
  }

  &:hover {
    color: ${p => p.theme.gray5};
    background: ${p => p.theme.offWhite2};
    border-color: ${p => p.theme.gray1};
  }
`;

const StyledInlineSvg = styled(InlineSvg)`
  transform: rotate(${p => (p.open ? '180deg' : null)});
`;

export default AccordionButton;