import React from 'react';

export default (props) => {
    const {name=''} = props || {};
    if(!name) return null;

    // icon 这个类是和 index.html 中的那个样式类相匹配的
    return (
        <svg className="icon" aria-hidden="true"><use xlinkHref={`#${name}`}></use></svg>
    );
}