import "./sidebar.css";
import {
  RssFeed,
  Chat,
  PlayCircleFilledOutlined,
  Group,
  Bookmark,
  HelpOutline,
  WorkOutline,
  Event,
  School,
  Home,
} from "@material-ui/icons";
import CloseFriend from "../closeFriend/CloseFriend";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <Home className="sidebarIcon" />
            <Link to="/" style={{ textDecoration: "none" }}>
            <span className="sidebarListItemText" style={{ color: "black" }}>Home</span>
            </Link>
          </li>
          <li className="sidebarListItem">
            <Chat className="sidebarIcon" />
            <Link to="/messenger" style={{ textDecoration: "none" }}>
                      <span className="sidebarListItemText" style={{ color: "black" }}>Messenger</span>
            </Link>
          </li>
          <li className="sidebarListItem">
            <PlayCircleFilledOutlined className="sidebarIcon" />
            <span className="sidebarListItemText">Gallery</span>
          </li>
          <li className="sidebarListItem">
            <Group className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li>

        </ul>
        <hr className="sidebarHr" />

      </div>
    </div>
  );
}
