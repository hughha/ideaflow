import { CompositeDecorator } from "draft-js";
import Entity from "../Entity";

// entity decorateor for Draft.js
function getEntityDecorator() {
  const compositeDecorator = new CompositeDecorator([
    {
      strategy: (contentBlock, callback) => {
        contentBlock.findEntityRanges((meta) => meta.entity, callback);
      },
      component: Entity,
    },
  ]);
  return compositeDecorator;
}
export default getEntityDecorator;
