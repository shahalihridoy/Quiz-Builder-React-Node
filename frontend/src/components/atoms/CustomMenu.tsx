import { Menu } from "@mui/material";
import React, {
  Children,
  cloneElement,
  CSSProperties,
  Fragment,
  ReactElement,
  useState,
} from "react";

interface MenuProps {
  open?: boolean;
  direction?: "left" | "right" | "center";
  children: ReactElement | ReactElement[];
  handler: ReactElement;
  className?: string;
  style?: CSSProperties;
  shouldCloseOnItemClick?: boolean;
  elevation?: number;
}

const CustomMenu: React.FC<MenuProps> = ({
  open,
  handler,
  direction,
  shouldCloseOnItemClick,
  children,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (customOnClick: any) => () => {
    if (customOnClick) customOnClick();
    if (shouldCloseOnItemClick) handleClose();
  };

  return (
    <Fragment>
      {handler &&
        cloneElement(handler, {
          onClick: handler.props.onClick || handleClick,
        })}
      <Menu
        anchorEl={anchorEl}
        open={open !== undefined ? open : !!anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: direction || "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: direction || "left",
        }}
        {...props}
      >
        {Children.map(children, (child: ReactElement) =>
          cloneElement(child, {
            onClick: handleMenuItemClick(child.props.onClick),
          }),
        )}
      </Menu>
    </Fragment>
  );
};

CustomMenu.defaultProps = {
  direction: "left",
  shouldCloseOnItemClick: true,
};

export default CustomMenu;
