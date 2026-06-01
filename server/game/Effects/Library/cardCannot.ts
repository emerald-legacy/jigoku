import type BaseCard from '../../BaseCard.js';
import { EffectNames } from '../../Constants.js';
import type Player from '../../Player.js';
import { EffectBuilder } from '../EffectBuilder.js';
import Restriction from '../Restriction.js';

type Props =
    | string
    | {
          cannot: string;
          applyingPlayer?: Player;
          restricts?: string;
          source?: BaseCard;
      };

export function cardCannot(properties: Props) {
    return EffectBuilder.card.static(
        EffectNames.AbilityRestrictions,
        new Restriction(
            typeof properties === 'string'
                ? { type: properties }
                : Object.assign({ type: properties.cannot }, properties)
        )
    );
}
