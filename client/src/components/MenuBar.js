import React, { useEffect, useState, useContext } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
function MenuBar() {
  const { user, logout } = useContext(AuthContext);
  const [activeItem, setActiveItem] = useState("home");
  const handleItemClick = (e, { name }) => setActiveItem(name);
  useEffect(() => {
    const pathname = window.location.pathname;
    setActiveItem(pathname.substr(1));
  }, [user]);
  const menuBar = user ? (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item
        name={user.username}
        active
        as={Link}
        to={"/"}
      />
      <Menu.Menu position="right">
        <Menu.Item
          name="logout"
          onClick={logout}
        />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item
        name="home"
        active={activeItem === "home" || activeItem === ""}
        onClick={handleItemClick}
        as={Link}
        to={"/"}
      />
      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to={"/login"}
        />
        <Menu.Item
          name="register"
          active={activeItem === "register"}
          onClick={handleItemClick}
          as={Link}
          to={"/register"}
        />
      </Menu.Menu>
    </Menu>
  );

  return menuBar;
}

export default MenuBar;