import React from 'react';
import Icons from "./basic-icons.svg";

const Icon = ({ name, color, ...props }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            style={{ display: 'block', width: '1rem', height: '1rem', ...props.style }}>
            <use style={{ color: color }} xlinkHref={Icons + "#" + name} />
        </svg>
    )
}

Icon.defaultProps = {
    name: "pencil",
    color: null
}

export default Icon