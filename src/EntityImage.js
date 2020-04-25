import PropTypes from "prop-types";
import React from "react";
import classnames from "classnames";
import styles from "./EntityImage.module.scss";

function colorClass(personId) {
  const n = personId % 10;
  return styles[`color${n}`];
}

// render an entity list image
function EntityImage(props) {
  const { entity } = props;

  const imageStyle = entity.image
    ? { backgroundImage: `url(${entity.image})` }
    : {};

  return (
    <i
      className={classnames(
        styles.profileImage,
        !entity.image && colorClass(entity.id)
      )}
      style={imageStyle}
    />
  );
}

EntityImage.propTypes = {
  entity: PropTypes.shape({
    id: PropTypes.number.isRequired,
    image: PropTypes.string,
  }).isRequired,
};

export default EntityImage;
