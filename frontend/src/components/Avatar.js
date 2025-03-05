/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */

import { forwardRef } from 'react';
import classnames from 'classnames';
import { Badge } from 'reactstrap';
import PropTypes from 'prop-types';

const Avatar = forwardRef((props, ref) => {
    const {
        img,
        size,
        icon,
        color,
        status,
        badgeUp,
        content,
        tag: Tag = 'div', // Default tag is 'div'
        initials,
        imgWidth,
        imgHeight,
        className,
        badgeText,
        badgeColor,
        imgClassName,
        contentStyles,
        ...rest
    } = props;

    // Function to extract initials from content
    const getInitials = (str) =>
        str
            .split(' ')
            .map((word) => word[0])
            .join('');

    return (
        <Tag
            className={classnames('avatar', {
                [className]: className,
                [`bg-${color}`]: color,
                [`avatar-${size}`]: size,
            })}
            ref={ref}
            {...rest}
        >
            {img ? (
                <img
                    className={classnames({ [imgClassName]: imgClassName })}
                    src={img}
                    alt="avatar"
                    height={imgHeight || 32}
                    width={imgWidth || 32}
                />
            ) : (
                <span className="avatar-content" style={contentStyles}>
                    {initials ? getInitials(content) : content}
                    {icon}
                </span>
            )}
            {status && <span className={`avatar-status avatar-status-${status}`}></span>}
            {badgeUp && (
                <Badge className="badge-up" color={badgeColor || 'primary'}>
                    {badgeText}
                </Badge>
            )}
        </Tag>
    );
});

Avatar.defaultProps = {
    tag: 'div',
};

Avatar.propTypes = {
    img: PropTypes.string,
    size: PropTypes.string,
    icon: PropTypes.node,
    color: PropTypes.string,
    status: PropTypes.string,
    badgeUp: PropTypes.bool,
    content: PropTypes.string,
    tag: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
    initials: PropTypes.bool,
    imgWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    imgHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    className: PropTypes.string,
    badgeText: PropTypes.string,
    badgeColor: PropTypes.string,
    imgClassName: PropTypes.string,
    contentStyles: PropTypes.object,
};

export default Avatar;
