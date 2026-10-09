import type BaseCard from '../../BaseCard.js';
import { EffectName, type PlayType, type RestrictionType } from '../../Constants.js';
import type Player from '../../Player.js';
import { EffectBuilder } from '../EffectBuilder.js';
import { Restriction, type RestrictionAppliesTo } from '../Restriction.js';

type Props =
    | RestrictionType
    | PlayType
    | {
          cannot: RestrictionType | PlayType;
          applyingPlayer?: Player;
          appliesTo?: RestrictionAppliesTo;
          source?: BaseCard;
      };

export function cardCannot(properties: Props) {
    return EffectBuilder.card.static(
        EffectName.AbilityRestrictions,
        new Restriction(
            typeof properties === 'string'
                ? { type: properties }
                : Object.assign({ type: properties.cannot }, properties)
        )
    );
}
