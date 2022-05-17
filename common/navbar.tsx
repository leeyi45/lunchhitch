import { Button } from "@blueprintjs/core";
import { SessionInfo } from "./session";

const NavBar = (props: SessionInfo) => (
    <div style={{
        display: 'flex',
        flexDirection: 'row',
    }}>
        <text>{props.user_name}</text>
        <Button />
    </div>
);

export default NavBar;